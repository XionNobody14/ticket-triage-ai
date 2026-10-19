"""
Script de Semillas (Seed Data) para Ticket Triage AI
Crea la base de datos, puebla los artículos de SOPs y precarga al menos 12 tickets corporativos realistas.
"""
from datetime import datetime, timedelta, timezone
from app.database import engine, SessionLocal, Base
from app.models import Ticket, AuditLog, KnowledgeArticle, User
from app.knowledge_base import DEFAULT_KNOWLEDGE_ARTICLES
from app.auth_utils import hash_password

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def run_seed():
    print("[INIT] Inicializando esquema de Base de Datos...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Limpiar datos previos si existen
        db.query(AuditLog).delete()
        db.query(Ticket).delete()
        db.query(KnowledgeArticle).delete()
        db.commit()

        print("[INFO] Insertando Artículos de Base de Conocimiento (SOPs)...")
        for article_data in DEFAULT_KNOWLEDGE_ARTICLES:
            kb = KnowledgeArticle(
                id=article_data["id"],
                title=article_data["title"],
                category=article_data["category"],
                tags=article_data["tags"],
                problem_pattern=article_data["problem_pattern"],
                solution_steps=article_data["solution_steps"],
                severity_hint=article_data["severity_hint"],
                escalation_team=article_data["escalation_team"]
            )
            db.add(kb)
        db.commit()

        print("🎫 Creando tickets corporativos de soporte...")
        now = datetime.now(timezone.utc)

        sample_tickets = [
            {
                "title": "Fallo crítico en sincronización SAP Ariba: Error 503 en aprobación de órdenes de compra",
                "description": (
                    "El equipo de compras de Planta Norte reporta que las órdenes de compra (PO) emitidas "
                    "hacia proveedores estratégicos están fallando con error HTTP 503 Service Unavailable. "
                    "El Cloud Connector muestra llamadas tRFC encoladas con timeout hacia ARIBA_INTEGRATION_GATEWAY. "
                    "Afecta la entrega de suministros de producción."
                ),
                "category": "ERP & Finanzas",
                "urgency": "Crítica",
                "status": "Abierto",
                "confidence_score": 0.96,
                "matched_kb_id": "KB-SAP-001",
                "user_email": "carlos.mendoza@corporativo.com",
                "assigned_team": "L2-Finanzas-SAP",
                "sla_hours": 2,
                "suggested_solution": (
                    "1. Inspeccionar transacción SM58 en SAP S/4HANA y filtrar errores del destino ARIBA_INTEGRATION_GATEWAY.\n"
                    "2. Reiniciar el túnel de SAP Cloud Connector en el nodo primario de infraestructura.\n"
                    "3. Ejecutar prueba de conectividad RFC en SM59 y forzar reprocesamiento de colas tRFC encoladas.\n"
                    "4. Notificar a Jefatura de Compras una vez confirmado el flujo de órdenes."
                ),
                "created_offset": timedelta(minutes=-45),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Severidad Crítica detectada por impacto en cadena de suministro de producción. Confianza 96%."),
                    ("Sistema de Notificaciones", "Alerta SLA", "Ticket asignado automáticamente a L2-Finanzas-SAP. SLA 2 horas.")
                ]
            },
            {
                "title": "Error de token expirado y fallo de certificado en firma de contrato NDA en Doc2Sign",
                "description": (
                    "Un cliente corporativo externo y nuestro Director Legal no pueden completar la firma "
                    "del contrato de confidencialidad NDA-2026-X. Al abrir el enlace seguro muestra 'Token inválido o expirado' "
                    "y en la consola de administración de Doc2Sign se registra un error de certificado digital no reconocido."
                ),
                "category": "Firma Digital & LegalTech",
                "urgency": "Alta",
                "status": "En Proceso",
                "confidence_score": 0.94,
                "matched_kb_id": "KB-DOC-002",
                "user_email": "valeria.rojas@legal.empresa.com",
                "assigned_team": "L2-LegalTech-Apps",
                "sla_hours": 6,
                "suggested_solution": (
                    "1. Acceder al dashboard de Doc2Sign y ubicar el Envelope ID por correo de Valeria Rojas.\n"
                    "2. Regenerar enlace de invitación de un solo uso mediante 'Resend Secure Notification'.\n"
                    "3. Verificar en la lista de confianza AATL corporativa el certificado de la contraparte.\n"
                    "4. Confirmar que el webhook de sincronización a Salesforce CRM no tenga errores pendientes."
                ),
                "created_offset": timedelta(hours=-2),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Identificado como incidente de LegalTech. Severidad Alta."),
                    ("Analista L2 Andrea Soto", "Asignación Tomada", "Iniciando validación del envelope y reenvío de invitación segura.")
                ]
            },
            {
                "title": "Access Denied 18456 y Deadlock en clúster SQL Server durante cierre contable",
                "description": (
                    "Durante la ejecución de las consultas de consolidación de balance contable, "
                    "el servicio de reportería financiera arrojó error 'Login failed for user svc_financial_reporting (Error 18456)'. "
                    "Al mismo tiempo el servidor presenta múltiples bloqueos (deadlocks) en la base de datos Finanzas_Prod."
                ),
                "category": "Bases de Datos & SQL",
                "urgency": "Crítica",
                "status": "En Proceso",
                "confidence_score": 0.95,
                "matched_kb_id": "KB-SQL-003",
                "user_email": "rodrigo.alvarez@contabilidad.com",
                "assigned_team": "L2-DBA-Team",
                "sla_hours": 2,
                "suggested_solution": (
                    "1. Comprobar en Active Directory si la cuenta de servicio svc_financial_reporting fue bloqueada por intentos erróneos.\n"
                    "2. Desbloquear cuenta y validar rotación de credenciales en el almacén de secretos.\n"
                    "3. Ejecutar sp_who2 en SQL Server y revisar grafo de deadlocks mediante sys.dm_exec_requests.\n"
                    "4. Terminar sesiones zombie que bloquean las tablas maestras de balance."
                ),
                "created_offset": timedelta(hours=-1, minutes=-15),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Criticidad máxima por coincidencia de palabras clave 'cierre contable', 'deadlock' y 'SQL Prod'."),
                    ("DBA On-Call", "Investigación Activa", "Cuenta de servicio desbloqueada. Matando SPID 142 bloqueante.")
                ]
            },
            {
                "title": "Bloqueo de autenticador MFA Okta tras actualización de smartphone (VP Ventas)",
                "description": (
                    "El Vicepresidente de Ventas cambió de terminal móvil y perdió el enlace de Okta Verify. "
                    "No puede ingresar a Salesforce, correo ni portal corporativo para la reunión de directorio en 30 minutos."
                ),
                "category": "Identidad & Accesos (IAM)",
                "urgency": "Alta",
                "status": "Resuelto",
                "confidence_score": 0.97,
                "matched_kb_id": "KB-IAM-004",
                "user_email": "guillermo.perez@ventas.empresa.com",
                "assigned_team": "L1-IAM-ServiceDesk",
                "sla_hours": 6,
                "suggested_solution": (
                    "1. Realizar llamada de verificación de identidad por canal seguro.\n"
                    "2. En la consola Okta Admin, resetear el factor Okta Verify del usuario.\n"
                    "3. Emitir un Temporary Access Pass (TAP) con expiración de 4 horas.\n"
                    "4. Guiar al usuario para reasociar su nuevo dispositivo mediante código QR."
                ),
                "created_offset": timedelta(hours=-4),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Incidente de identidad priorizado por impacto ejecutivo."),
                    ("Analista ServiceDesk", "Resolución Completada", "Identidad verificada. TAP temporal entregado y nuevo Okta Verify enrolado satisfactoriamente.")
                ]
            },
            {
                "title": "Desconexiones intermitentes en VPN Cisco AnyConnect para personal en trabajo remoto",
                "description": (
                    "Varios usuarios remotos de la filial Chile reportan desconexiones cada 10 minutos al usar Cisco AnyConnect. "
                    "El log del cliente muestra 'VPN establishment capability for a remote user is disabled. A secure gateway has dropped the connection'."
                ),
                "category": "Infraestructura & Redes",
                "urgency": "Media",
                "status": "Abierto",
                "confidence_score": 0.91,
                "matched_kb_id": "KB-NET-005",
                "user_email": "soporte.chile@empresa.com",
                "assigned_team": "L1-Redes-Telecom",
                "sla_hours": 12,
                "suggested_solution": (
                    "1. Verificar carga de CPU y memoria en el concentrador ASA de la región Cono Sur.\n"
                    "2. Comprobar límites de MTU y forzar perfil TCP en lugar de DTLS para conexiones con paquetes fragmentados.\n"
                    "3. Pedir a los usuarios vaciar caché DNS local mediante 'ipconfig /flushdns'.\n"
                    "4. Redirigir el DNS del perfil VPN hacia el concentrador secundario de contingencia."
                ),
                "created_offset": timedelta(hours=-6),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Categorizado en Infraestructura & Redes con urgencia Media.")
                ]
            },
            {
                "title": "Buzón de correo exhausto (Error 554 5.2.2 mailbox full) en Gerencia de Facturación",
                "description": (
                    "La casilla facturacion.central@empresa.com no está recibiendo correos electrónicos de los clientes. "
                    "Los remitentes reciben rebote '554 5.2.2 mailbox full'. Hay riesgo de retraso en la cobranza mensual."
                ),
                "category": "Productividad & Colaboración",
                "urgency": "Alta",
                "status": "Resuelto",
                "confidence_score": 0.93,
                "matched_kb_id": "KB-O365-006",
                "user_email": "facturacion.central@empresa.com",
                "assigned_team": "L1-Helpdesk-Workspace",
                "sla_hours": 6,
                "suggested_solution": (
                    "1. Habilitar en Exchange Online el auto-expanding archiving para el buzón compartido.\n"
                    "2. Ejecutar comando de PowerShell Start-ManagedFolderAssistant para forzar purga de elementos eliminados.\n"
                    "3. Expandir la cuota preventiva temporal a 100 GB.\n"
                    "4. Confirmar recepción enviando mensaje de prueba y verificando en Message Trace."
                ),
                "created_offset": timedelta(hours=-10),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Identificado problema de capacidad en Exchange Online."),
                    ("Ingeniero O365", "Resolución Completada", "Buzón expandido y política de archivo histórico activada.")
                ]
            },
            {
                "title": "Falso positivo de CrowdStrike Falcon aisló binario de automatización en servidor CI/CD",
                "description": (
                    "El agente EDR de CrowdStrike detectó el script compilado 'deploy-sync.exe' en el agente Jenkins de staging "
                    "como sospechoso y lo puso en cuarentena preventiva. Todos los despliegues de la tarde están detenidos."
                ),
                "category": "Seguridad & Accesos",
                "urgency": "Alta",
                "status": "En Proceso",
                "confidence_score": 0.95,
                "matched_kb_id": "KB-SEC-008",
                "user_email": "devops-leads@empresa.com",
                "assigned_team": "SOC-Incident-Response",
                "sla_hours": 6,
                "suggested_solution": (
                    "1. Consultar en la consola Falcon el evento de detección para el host jenkins-agent-02.\n"
                    "2. Extraer el hash SHA-256 del binario y contrastarlo con el commit verificado en GitLab.\n"
                    "3. Generar una regla de exclusión por hash y ruta firmada por el Lead de Seguridad.\n"
                    "4. Restaurar el archivo de la cuarentena y reanudar la cola de integración continua."
                ),
                "created_offset": timedelta(hours=-3),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Detectado incidente de seguridad/falso positivo EDR."),
                    ("Analista SOC Nivel 2", "En Proceso", "Hash SHA-256 verificado. Tramitando excepción de firma digital.")
                ]
            },
            {
                "title": "Error al transicionar historias de usuario en Jira: 'No permission to transition'",
                "description": (
                    "Los desarrolladores del equipo Frontend no pueden mover tarjetas a la columna 'In Review' en el proyecto CORE. "
                    "Muestra mensaje de advertencia 'You do not have permission to execute this workflow transition'."
                ),
                "category": "Productividad & Colaboración",
                "urgency": "Baja",
                "status": "Resuelto",
                "confidence_score": 0.89,
                "matched_kb_id": "KB-JIR-007",
                "user_email": "martin.scrum@empresa.com",
                "assigned_team": "L1-Atlassian-Ops",
                "sla_hours": 48,
                "suggested_solution": (
                    "1. Abrir la configuración del proyecto CORE en Jira Service Management.\n"
                    "2. En el Permission Scheme, añadir el grupo 'dev-frontend-team' al permiso 'Transition Issues'.\n"
                    "3. Validar las condiciones del flujo de trabajo en la transición 'To Review'.\n"
                    "4. Notificar al Scrum Master para que el equipo pruebe nuevamente."
                ),
                "created_offset": timedelta(days=-1),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Urgencia baja. Incidente de configuración de permisos en Jira."),
                    ("Atlassian Admin", "Resuelto", "Esquema de permisos actualizado y probado con el Scrum Master.")
                ]
            },
            {
                "title": "Timeouts en webhook de retorno de Doc2Sign hacia Salesforce CRM en contratos B2B",
                "description": (
                    "Cuando un cliente firma un contrato en Doc2Sign, la oportunidad en Salesforce no cambia a 'Closed Won'. "
                    "El log de eventos de Doc2Sign Connect muestra errores HTTP 504 Gateway Timeout hacia el endpoint de integración."
                ),
                "category": "Firma Digital & LegalTech",
                "urgency": "Alta",
                "status": "Abierto",
                "confidence_score": 0.94,
                "matched_kb_id": "KB-DOC-002",
                "user_email": "salesops@empresa.com",
                "assigned_team": "L2-LegalTech-Apps",
                "sla_hours": 6,
                "suggested_solution": (
                    "1. Revisar en Salesforce el Apex Rest Resource correspondiente al webhook de Doc2Sign.\n"
                    "2. Comprobar si existen triggers de larga duración bloqueando la transacción del CRM.\n"
                    "3. En Doc2Sign Connect, reintentar manualmente los sobres fallidos con estado 'Delivery Failure'.\n"
                    "4. Implementar procesamiento asíncrono (Queueable Apex) para desacoplar el webhook."
                ),
                "created_offset": timedelta(hours=-5),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Incidente de integración LegalTech/Salesforce.")
                ]
            },
            {
                "title": "Agotamiento de pool de conexiones y lentitud en base de datos PostgreSQL de Clientes",
                "description": (
                    "El servicio de autenticación de clientes reporta lentitud severa. PgBouncer indica que el pool "
                    "de 200 conexiones está al 100% de ocupación. Se observan transacciones abiertas en estado 'idle in transaction'."
                ),
                "category": "Bases de Datos & SQL",
                "urgency": "Crítica",
                "status": "Resuelto",
                "confidence_score": 0.97,
                "matched_kb_id": "KB-SQL-003",
                "user_email": "infra-alert@empresa.com",
                "assigned_team": "L2-DBA-Team",
                "sla_hours": 2,
                "suggested_solution": (
                    "1. Conectar a PgBouncer y verificar 'SHOW CLIENTS' y 'SHOW POOLS'.\n"
                    "2. Ejecutar consulta en pg_stat_activity para identificar consultas con más de 120 segundos en ejecución.\n"
                    "3. Ejecutar pg_terminate_backend() sobre sesiones colgadas.\n"
                    "4. Configurar idle_in_transaction_session_timeout a 30s para evitar recurrencias."
                ),
                "created_offset": timedelta(days=-2),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Crítico por saturación de base de datos de producción."),
                    ("DBA de Guardia", "Resuelto", "Sesiones inactivas finalizadas y parámetro de timeout optimizado.")
                ]
            },
            {
                "title": "Consulta sobre configuración de firma digital corporativa en Adobe Acrobat Reader",
                "description": (
                    "Un asistente de tesorería solicita instrucciones para agregar el sello de tiempo (Timestamp Server) "
                    "y el certificado digital corporativo en su nueva laptop Windows 11."
                ),
                "category": "Firma Digital & LegalTech",
                "urgency": "Baja",
                "status": "Abierto",
                "confidence_score": 0.90,
                "matched_kb_id": "KB-DOC-002",
                "user_email": "lorena.tesoreria@empresa.com",
                "assigned_team": "L1-LegalTech-Apps",
                "sla_hours": 48,
                "suggested_solution": (
                    "1. Enviar al usuario el manual interactivo de configuración de certificados.\n"
                    "2. Configurar la URL del servidor RFC 3161 de timestamp en Preferencias -> Firmas -> Servidores de fechado.\n"
                    "3. Validar firma de prueba en documento de muestra."
                ),
                "created_offset": timedelta(hours=-8),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Solicitud catalogada como consulta informativa. Urgencia Baja.")
                ]
            },
            {
                "title": "Falla de aprovisionamiento de usuario en SAP S/4HANA mediante interfaz IDOC",
                "description": (
                    "Los nuevos ingresos de personal no se están creando automáticamente en SAP. "
                    "La transacción WE02 muestra IDOCs de tipo HRMD_A con estado 51 'Application document not posted'."
                ),
                "category": "ERP & Finanzas",
                "urgency": "Media",
                "status": "En Proceso",
                "confidence_score": 0.93,
                "matched_kb_id": "KB-SAP-001",
                "user_email": "rrhh.it@empresa.com",
                "assigned_team": "L2-Finanzas-SAP",
                "sla_hours": 12,
                "suggested_solution": (
                    "1. Abrir transacción WE02 y filtrar IDOCs con estado 51.\n"
                    "2. Inspeccionar segmento de datos para encontrar campos obligatorios vacíos (ej. Sociedad o División de Personal).\n"
                    "3. Corregir mapeo en la tabla de conversión y reprocesar con BD87.\n"
                    "4. Notificar a RRHH para verificación en el registro maestro."
                ),
                "created_offset": timedelta(hours=-16),
                "audit": [
                    ("AI Triage Engine", "Clasificación Agéntica", "Categorizado en ERP & Finanzas."),
                    ("Analista SAP", "En Proceso", "Identificado campo de sociedad no mapeado para nueva filial.")
                ]
            }
        ]

        for item in sample_tickets:
            created_dt = now + item["created_offset"]
            t = Ticket(
                title=item["title"],
                description=item["description"],
                category=item["category"],
                urgency=item["urgency"],
                status=item["status"],
                suggested_solution=item["suggested_solution"],
                confidence_score=item["confidence_score"],
                matched_kb_id=item["matched_kb_id"],
                user_email=item["user_email"],
                assigned_team=item["assigned_team"],
                sla_hours=item["sla_hours"],
                created_at=created_dt,
                updated_at=created_dt
            )
            db.add(t)
            db.flush()

            for author, action, details in item["audit"]:
                log = AuditLog(
                    ticket_id=t.id,
                    timestamp=created_dt + timedelta(minutes=5),
                    author=author,
                    action=action,
                    details=details
                )
                db.add(log)

        db.commit()
        print(f"[SUCCESS] Se crearon exitosamente {len(sample_tickets)} tickets corporativos con historial completo.")

        # Verificar y crear usuario Administrador Principal si no existe
        admin = db.query(User).filter(User.email == "admin@xion.com").first()
        if not admin:
            admin = User(
                email="admin@xion.com",
                full_name="Administrador Principal",
                role="admin",
                hashed_password=hash_password("Heartless2003"),
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("👤 Usuario Administrador Principal (admin@xion.com) asegurado.")
        else:
            print("👤 Usuario Administrador Principal (admin@xion.com) ya existe.")


    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error al poblar base de datos: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
