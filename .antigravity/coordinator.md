# @coordinator.md - Agente Orquestador & Arquitectura

## Misión y Responsabilidad
El **Coordinator** es la máxima autoridad técnica del proyecto `ticket-triage-ai`. Define la arquitectura global, los contratos de comunicación (OpenAPI / Schemas Pydantic / TypeScript Interfaces) y supervisa el progreso del equipo multiagente asegurando que ningún agente rompa las interfaces entre Backend y Frontend.

## Contratos de Datos y Arquitectura de Referencia

### 1. Modelo de Datos Canónico (Ticket)
```json
{
  "id": 1,
  "title": "Fallo crítico en sincronización SAP Ariba ERP",
  "description": "Los pedidos de compra emitidos después de las 14:00 están bloqueados con error 502 Bad Gateway...",
  "category": "ERP & Finanzas",
  "urgency": "Crítica", // Enum: ["Baja", "Media", "Alta", "Crítica"]
  "status": "Abierto", // Enum: ["Abierto", "En Proceso", "Resuelto"]
  "suggested_solution": "1. Reiniciar el servicio de integración RFC...\n2. Limpiar la cola de mensajes en SAP PI...",
  "confidence_score": 0.94,
  "matched_kb_id": "KB-SAP-01",
  "user_email": "m.garcia@empresa.com",
  "assigned_team": "L2-Finanzas-SAP",
  "audit_logs": [
    {
      "timestamp": "2026-10-17T18:00:00Z",
      "author": "AI Triage Engine",
      "action": "Clasificación automática",
      "details": "Categoría asignada: ERP & Finanzas, Urgencia: Crítica, Coincidencia KB: 94%"
    }
  ],
  "created_at": "2026-10-17T18:00:00Z",
  "updated_at": "2026-10-17T18:00:00Z"
}
```

### 2. Contrato de Endpoint de Triaje Agéntico (`POST /api/triage`)
- **Request Body**:
```json
{
  "title": "string",
  "description": "string (mínimo 10 caracteres)",
  "user_email": "string (opcional)",
  "dry_run": false // si es true, no persiste en BD y solo devuelve el análisis
}
```
- **Response Body**:
```json
{
  "ticket": { ... }, // Objeto Ticket si dry_run es false
  "analysis": {
    "category": "ERP & Finanzas",
    "urgency": "Crítica",
    "confidence_score": 0.94,
    "matched_kb": {
      "id": "KB-SAP-01",
      "title": "Procedimiento de recuperación de conectividad SAP RFC / Ariba",
      "similarity": 0.92
    },
    "suggested_solution": "Paso 1: ...\nPaso 2: ...",
    "sla_hours": 2,
    "recommended_team": "L2-Finanzas-SAP",
    "reasoning": "La incidencia describe bloqueo de transacciones de compra en SAP Ariba con código de error HTTP 502..."
  }
}
```

### 3. Endpoints Principales
- `GET /api/health` -> Estado del servidor y estadísticas rápidas.
- `GET /api/tickets` -> Listado con filtros: `urgency`, `status`, `category`, `search`.
- `GET /api/tickets/{id}` -> Detalle completo con logs de auditoría.
- `POST /api/tickets` -> Creación manual o vía triaje.
- `PATCH /api/tickets/{id}` -> Actualización de estado, solución sugerida o asignación.
- `POST /api/triage` -> Pipeline agéntico de análisis, clasificación y generación de solución.
- `GET /api/analytics` -> Métricas clave (distribución por categoría, urgencia, tiempo estimado ahorrado, tasa de resolución).
- `GET /api/knowledge` -> Catálogo de Base de Conocimiento corporativa.

## Reglas de Gobernanza
1. Ningún cambio de nombre de propiedad en backend sin actualizar el schema en frontend.
2. Todo endpoint debe tener tipado estricto con Pydantic.
3. Se debe mantener actualizada la lista de tareas en `TASKS.md`.
4. El Agente QA debe aprobar antes del push a GitHub.
