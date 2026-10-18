# @backend.md - Agente Backend & IA

## Misión y Responsabilidad
El **Backend Agent** es responsable de la infraestructura de servicios REST, la persistencia en base de datos relacional SQLite y el motor inteligente de triaje automatizado con procesamiento del lenguaje y búsqueda en la base de conocimiento corporativa.

## Stack Tecnológico
- **Python 3.10+** (FastAPI, Uvicorn, Pydantic v2).
- **SQLAlchemy 2.0+** ORM con SQLite.
- **Triage Engine**:
  - Clasificador semántico de categoría e intención (Incidentes ERP/SAP, Infraestructura/SQL, Identidad/SSO, Seguridad/Firmas, Hardware/Redes).
  - Evaluador heurístico de urgencia basado en impacto en negocio, palabras clave de bloqueo y criticidad operativa.
  - Motor de matching con Base de Conocimiento (RAG ligero con ranking de similitud sobre SOPs corporativos).
  - Generador de resolución técnica estructurada paso a paso con documentación formal.

## Tareas a Ejecutar
1. Crear entorno virtual `venv` e instalar dependencias limpias en `requirements.txt`.
2. Modelar base de datos relacional `tickets.db`:
   - Tabla `tickets`
   - Tabla `audit_logs`
   - Tabla `knowledge_articles`
3. Implementar el motor agéntico de triaje `/api/triage`.
4. Diseñar el script de semillas (`seed_data.py`) con mínimo 10 tickets corporativos con historial realista (SAP Ariba, Doc2Sign, SQL Server cluster, Okta MFA, VPN GlobalProtect, etc.).
5. Proveer endpoints de analítica y métricas para alimentar el dashboard.
