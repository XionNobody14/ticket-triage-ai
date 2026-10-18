# TASKS.md - Plan de Ejecución Multiagente (ticket-triage-ai)

Orquestado mediante el patrón **Coordinator-Workers**. Cada agente marca con `[x]` sus tareas asignadas una vez completadas y verificadas.

---

## 🏛️ Fase 1: Arquitectura y Contratos (@coordinator.md)
- [x] Diseñar estructura de roles multiagente en `.antigravity/` (`coordinator.md`, `backend.md`, `frontend.md`, `qa_reviewer.md`).
- [x] Definir especificaciones canónicas de contratos de datos OpenAPI / Pydantic / TypeScript.
- [x] Configurar archivo maestro `TASKS.md` y estructura de carpetas `backend/` y `frontend/`.

---

## ⚙️ Fase 2: Backend, Persistencia y Pipeline Agéntico (@backend.md)
- [x] Inicializar entorno virtual `venv` e instalar dependencias (`fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`).
- [x] Definir modelos SQLAlchemy (`Ticket`, `AuditLog`, `KnowledgeArticle`) y schemas Pydantic en `backend/app/`.
- [x] Implementar motor agéntico de triaje `triage_engine.py`:
  - [x] Clasificación semántica de Categoría.
  - [x] Determinación de severidad y urgencia (`Baja`, `Media`, `Alta`, `Crítica`).
  - [x] Búsqueda y correspondencia semántica con Base de Conocimiento corporativa.
  - [x] Redacción de solución técnica estructurada paso a paso y tiempo SLA estimado.
- [x] Implementar routers REST en FastAPI:
  - [x] `GET /api/health`
  - [x] `GET /api/tickets` (filtros: urgencia, estado, categoría, búsqueda)
  - [x] `GET /api/tickets/{id}`
  - [x] `POST /api/tickets`
  - [x] `PATCH /api/tickets/{id}`
  - [x] `POST /api/triage`
  - [x] `GET /api/analytics`
  - [x] `GET /api/knowledge`
- [x] Crear script de semillas `seed_data.py` con mínimo 10 tickets corporativos con historial realista (SAP Ariba, Doc2Sign, SQL cluster, Okta, etc.).
- [x] Ejecutar script de semillas y verificar creación de SQLite `tickets.db`.

---

## 🎨 Fase 3: Frontend SPA & Dashboard de Soporte (@frontend.md)
- [x] Inicializar proyecto Vite + React + Tailwind CSS en `frontend/`.
- [x] Instalar dependencias UI (`lucide-react`, utilidades CSS, etc.).
- [x] Configurar tema Enterprise Console (estética SaaS moderna, slate/indigo, tipografía nítida).
- [x] Implementar componentes estructurales:
  - [x] Sidebar de navegación (Tickets, Analítica, Base de Conocimiento, Simulador).
  - [x] Barra superior con estado del servidor, selector de vista y botón de simulación rápida.
  - [x] Tarjetas de KPIs (Tickets Abiertos, Tiempo SLA promedio, Tasa de automatización IA, Incidentes Críticos).
- [x] Implementar vistas operacionales:
  - [x] Vista de Tickets en Tabla interactiva con badges de Urgencia y Estado.
  - [x] Vista Tablero Kanban interactivo con columnas (Abierto, En Proceso, Resuelto).
  - [x] Modal de Detalle de Ticket con desglose de IA (Diagnóstico, KB Matched, editor de solución sugerida, logs de auditoría y cambio de estado).
  - [x] Modal / Formulario de Simulación en tiempo real (con templates precargados y llamada directa a `/api/triage`).
  - [x] Vista de Analítica de resolución (distribución por categoría, métricas de ahorro y tendencias).
  - [x] Vista de Base de Conocimiento (artículos de soporte, procedimientos y SOPs corporativos).

---

## 🧪 Fase 4: Pruebas, Calidad y Verificación (@qa_reviewer.md)
- [x] Crear y ejecutar suite de pruebas de Backend (`pytest` con 9 tests unitarios y de integración de endpoints).
- [x] Ejecutar `npm run build` en `frontend/` y verificar ausencia de errores de compilación y tipos.
- [x] Crear scripts de ejecución multiplataforma:
  - [x] `run_backend.bat` & `run_backend.sh`
  - [x] `run_frontend.bat` & `run_frontend.sh`
  - [x] `run_all.bat`
- [x] Verificar interoperabilidad entre backend y frontend en local.

---

## 🚀 Fase 5: Control de Versiones y Publicación en GitHub (@coordinator.md)
- [x] Crear `.gitignore` robusto (`venv/`, `node_modules/`, `dist/`, `*.db`, `.env`, etc.).
- [x] Crear documentación completa en `README.md` con arquitectura, manual de uso y capturas explicativas.
- [x] Inicializar repositorio Git local (`git init`, `git branch -M main`).
- [x] Realizar commit inicial de código (`git add .`, `git commit -m "feat: initial commit - ticket triage multi-agent platform"`).
- [x] Publicar repositorio en GitHub usando `gh repo create ticket-triage-ai --public --source=. --remote=origin --push`.
- [x] Verificar y confirmar la URL pública del repositorio en GitHub.

---

## 🌿 Fase 6: Refactorización Neu-Natural Glass & Responsividad Móvil

### Subagente 1: @styles_architect.md (Paleta de Variables y Sistema Glassmorphic)
- [x] Configurar fondo global con degradado orgánico lila pastel / verde salvia tenue.
- [x] Definir variables CSS glassmorphic (`--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`).
- [x] Configurar badges de prioridad en pasteles de bajo contraste (Menta `#DCF3E4`, Lila `#EDE6FA`, Coral `#FDE2DB`).
- [x] Establecer tipografía en carbón suave (`#2E2A36`) y secundario (`#6C6677`).
- [x] Crear clases de utilidad: `.glass-card`, `.glass-panel`, `.glass-input`.

### Subagente 2: @ui_mobile_engineer.md (Componentes y Adaptación Móvil)
- [x] Adaptar navegación: Sidebar responsive con Drawer móvil y Bottom Navigation Bar (targets >= 44x44px).
- [x] Adaptar Tablero Kanban en móvil con pestañas intercambiables para evitar desbordamiento horizontal.
- [x] Adaptar modales de Detalle y Triaje como Bottom Sheet / Fullscreen táctil con cierre rápido.
- [x] Aplicar `.glass-input` y tipografía de 16px en inputs para prevenir auto-zoom en iOS.
- [x] Integrar `.glass-card` con bordes redondeados (16-20px) y backdrop-filter activo en todas las tarjetas.

### Subagente 3: @qa_reviewer.md (Validación, Build y Git)
- [x] Validar ausencia de errores de sintaxis y solapamientos en breakpoints (375px y 768px).
- [x] Ejecutar `npm run build` en `frontend/` y verificar compilación limpia sin advertencias.
- [x] Confirmar checklist en `TASKS.md`.
- [x] Realizar commit y push semántico a GitHub (`feat(ui): implement neu-natural glass design and mobile responsiveness`).
