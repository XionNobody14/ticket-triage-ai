"""
Base de Conocimiento Corporativa Estructurada (SOPs y Procedimientos de Soporte)
"""

DEFAULT_KNOWLEDGE_ARTICLES = [
    {
        "id": "KB-SAP-001",
        "title": "Recuperación de Conexión RFC y Fallos 502/503 en SAP Ariba",
        "category": "ERP & Finanzas",
        "tags": "sap,ariba,rfc,502,503,orden de compra,bloqueo,erp",
        "problem_pattern": "Errores de comunicación HTTP 502/503, bloqueo de órdenes de compra (PO), fallos en SAP Cloud Connector o cola SM58 saturada.",
        "solution_steps": (
            "1. Acceder a la transacción SAP SM58 y verificar las llamadas tRFC fallidas con destino 'ARIBA_INTEGRATION_GATEWAY'.\n"
            "2. Verificar en el servidor Cloud Connector el estado del enlace de subcuenta (Status: Connected).\n"
            "3. En caso de timeout, ejecutar ping RFC desde SM59 al destino RFC especificado.\n"
            "4. Si la cola está colapsada, reiniciar de forma escalonada el pool de subprocesos tRFC y reprocesar paquetes pendientes.\n"
            "5. Notificar al usuario afectado para que reintente la aprobación del pedido desde la interfaz web de Ariba."
        ),
        "severity_hint": "Crítica",
        "escalation_team": "L2-Finanzas-SAP"
    },
    {
        "id": "KB-DOC-002",
        "title": "Resolución de Fallos de Token y Certificados en Doc2Sign",
        "category": "Firma Digital & LegalTech",
        "tags": "doc2sign,firma,token,certificado,nda,webhook,contrato,expirado",
        "problem_pattern": "Imposibilidad de firmar contratos o acuerdos NDA, token de firma expirado, error SSL/TLS en webhook de retorno o certificado revocado.",
        "solution_steps": (
            "1. Consultar la consola de administración de Doc2Sign y localizar el envelope ID mediante el correo del firmante.\n"
            "2. Validar si el token de un solo uso (OTP) caducó; si es así, regenerar enlace seguro mediante 'Resend Notification'.\n"
            "3. Verificar que la entidad emisora del certificado del usuario figure en la lista de confianza corporativa (AATL).\n"
            "4. En caso de fallo de webhook al CRM/ERP, revisar el log de eventos de Doc2Sign Connect y reintentar el dispatch manual.\n"
            "5. Solicitar al usuario limpiar caché de navegador o abrir el enlace en modo incógnito."
        ),
        "severity_hint": "Alta",
        "escalation_team": "L2-LegalTech-Apps"
    },
    {
        "id": "KB-SQL-003",
        "title": "Diagnóstico de Access Denied (Error 1045/18456) y Deadlocks en Base de Datos SQL",
        "category": "Bases de Datos & SQL",
        "tags": "sql,mysql,sql server,1045,18456,access denied,permisos,deadlock,cluster,produccion",
        "problem_pattern": "Fallo de conexión por credenciales inválidas (Error 1045 en MySQL o 18456 en SQL Server), bloqueo mutuo (deadlock) o pool de conexiones exhausto en clúster.",
        "solution_steps": (
            "1. Revisar los registros de auditoría de login en SQL Server Management Studio (SSMS) o /var/log/mysql/error.log.\n"
            "2. Comprobar si la cuenta de servicio o usuario corporativo tiene la contraseña expirada en Active Directory.\n"
            "3. Verificar en sys.dm_exec_requests / SHOW PROCESSLIST si existen consultas bloqueantes de larga duración consumiendo el pool.\n"
            "4. Para deadlocks en producción, capturar el grafo de bloqueo (Extended Events / XML Deadlock Graph) y finalizar sesiones zombie no críticas.\n"
            "5. Reestablecer permisos mínimos estrictos (GRANT SELECT, EXECUTE) según la solicitud formal aprobada por el Security Officer."
        ),
        "severity_hint": "Crítica",
        "escalation_team": "L2-DBA-Team"
    },
    {
        "id": "KB-IAM-004",
        "title": "Desbloqueo de MFA y Sincronización SCIM en Okta / Azure AD",
        "category": "Identidad & Accesos (IAM)",
        "tags": "okta,azure ad,mfa,sso,scim,bloqueo,login,contraseña,token,autenticador",
        "problem_pattern": "Usuario bloqueado tras intentos fallidos de contraseña, pérdida de dispositivo MFA (Google Authenticator / Okta Verify) o fallo en aprovisionamiento SCIM.",
        "solution_steps": (
            "1. Confirmar la identidad del empleado mediante validación cruzada con su supervisor directo o canal seguro de RRHH.\n"
            "2. En la consola Okta/Entra ID, buscar al usuario y revisar el System Log (código de evento: user.authentication.auth_via_mfa.failure).\n"
            "3. Si el dispositivo MFA fue extraviado, revocar los factores registrados y generar un Temporary Access Pass (TAP) de 8 horas.\n"
            "4. Para errores de aprovisionamiento SCIM de cuentas, forzar sincronización manual desde la aplicación asignada.\n"
            "5. Asistir al usuario durante el nuevo registro de factor biométrico o push notification."
        ),
        "severity_hint": "Media",
        "escalation_team": "L1-IAM-ServiceDesk"
    },
    {
        "id": "KB-NET-005",
        "title": "Fallo de Túnel VPN GlobalProtect / Cisco AnyConnect",
        "category": "Infraestructura & Redes",
        "tags": "vpn,globalprotect,cisco,anyconnect,red,tunel,dns,remoto,timeout",
        "problem_pattern": "Desconexiones intermitentes de VPN, fallo al resolver nombres DNS internos de la intranet corporativa o error de handshaking SSL VPN.",
        "solution_steps": (
            "1. Validar el estado operativo del clúster de Firewalls perimetrales (Palo Alto / Cisco ASA).\n"
            "2. Solicitar al usuario comprobar su conexión a internet residencial y descartar bloqueos de proveedores locales en puertos UDP 4501/ESP.\n"
            "3. En el cliente VPN local, vaciar caché DNS (ipconfig /flushdns) y reiniciar el servicio de adaptador virtual (PANGP / vpnagent).\n"
            "4. Comprobar que el usuario tenga asignado el grupo de seguridad de red correspondiente en Active Directory (VPN-Remote-Users).\n"
            "5. Si el problema persiste, redirigir al gateway secundario de contingencia."
        ),
        "severity_hint": "Media",
        "escalation_team": "L1-Redes-Telecom"
    },
    {
        "id": "KB-O365-006",
        "title": "Cuota de Buzón Exhausta y Errores de Autenticación en Microsoft 365 / Outlook",
        "category": "Productividad & Colaboración",
        "tags": "o365,outlook,correo,buzon,cuota,exchange,teams,office",
        "problem_pattern": "Imposibilidad de enviar correos con error 'Buzón lleno - 554 5.2.2 mailbox full', mensajes en cola de salida o errores constantes de petición de credenciales en Outlook.",
        "solution_steps": (
            "1. En el Centro de Administración de Exchange (EAC), verificar el almacenamiento actual del buzón del usuario (límite estándar 50GB/100GB).\n"
            "2. Activar la directiva de retención o habilitar buzón de archivo histórico en línea (Auto-Expanding Archiving).\n"
            "3. Para bucles de petición de contraseña, eliminar credenciales de Office en el Administrador de Credenciales de Windows (Web & Windows Credentials).\n"
            "4. Reparar el perfil de Outlook en modo seguro o forzar regeneración del archivo .OST local.\n"
            "5. Confirmar recepción y envío de mensajes de prueba desde Outlook Web App (OWA)."
        ),
        "severity_hint": "Baja",
        "escalation_team": "L1-Helpdesk-Workspace"
    },
    {
        "id": "KB-JIR-007",
        "title": "Resolución de Bloqueo de Flujos de Trabajo y Permisos en Atlassian Jira / Confluence",
        "category": "Productividad & Colaboración",
        "tags": "jira,confluence,atlassian,permisos,workflow,tickets,tablero,acceso",
        "problem_pattern": "Usuarios no pueden transicionar incidencias, pantallas de edición en blanco, error 'No permission to execute transition' o espacios de Confluence inaccesibles.",
        "solution_steps": (
            "1. Verificar el Permission Scheme del proyecto en Jira y comprobar si el rol del usuario cuenta con el permiso 'Transition Issues'.\n"
            "2. Revisar los validadores y condiciones en el Workflow Designer para la transición en conflicto (ej. campos obligatorios no completados).\n"
            "3. En Confluence, inspeccionar las restricciones de página (Page Restrictions) y herencia de permisos del espacio padre.\n"
            "4. Sincronizar grupos de usuarios desde Atlassian Access / Okta Directory sync.\n"
            "5. Informar al usuario de los campos faltantes requeridos por la regla de transición."
        ),
        "severity_hint": "Baja",
        "escalation_team": "L1-Atlassian-Ops"
    },
    {
        "id": "KB-SEC-008",
        "title": "Alerta de Detección EDR / Cuarentena Antivirus en Endpoint Corporativo",
        "category": "Seguridad & Accesos",
        "tags": "seguridad,edr,crowdstrike,defender,malware,cuarentena,falso positivo,bloqueado",
        "problem_pattern": "Archivo de negocio o ejecutable interno bloqueado por CrowdStrike Falcon / Microsoft Defender for Endpoint, alerta de amenaza en laptop.",
        "solution_steps": (
            "1. Aislar preventivamente el host si la telemetría indica comportamiento sospechoso o ransomware en el panel del SOC.\n"
            "2. Analizar el hash SHA-256 del binario en VirusTotal y en la base de inteligencia de amenazas interna.\n"
            "3. Si se trata de una herramienta de desarrollo interna legítima (falso positivo), tramitar exclusión temporal firmada por el CISO.\n"
            "4. En caso de amenaza real, disparar play-book de respuesta a incidentes (IRP), recolectar volcado de memoria y ejecutar análisis forense.\n"
            "5. Reinstalar la imagen oficial del sistema operativo en el equipo del empleado si hay compromiso crítico."
        ),
        "severity_hint": "Crítica",
        "escalation_team": "SOC-Incident-Response"
    }
]
