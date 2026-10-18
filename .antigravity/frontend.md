# @frontend.md - Agente UI/UX

## Misión y Responsabilidad
El **Frontend Agent** implementa la Single Page Application (SPA) para los analistas de soporte corporativo. Debe ofrecer una experiencia de usuario rápida, densa en información, altamente operativa y moderna (consola SaaS Enterprise con tema Dark/Light contemporáneo, tipografía limpia, paleta slate/indigo y componentes de visualización).

## Stack Tecnológico
- **React 18/19 + Vite + TypeScript / Modern JavaScript**
- **Tailwind CSS** para estilizado modular y responsivo
- **Lucide Icons** para iconografía nítida
- Componentes modulares y estados reactivos

## Vistas y Módulos Obligatorios
1. **Sidebar de Navegación**:
   - Tickets Entrantes (Bandeja / Kanban)
   - Analítica de Resolución (KPIs, gráficos de distribución y tiempos de SLA)
   - Base de Conocimiento (Artículos de soporte y SOPs corporativos)
   - Acceso rápido a simulador de incidencias
2. **Vista Principal de Tickets**:
   - Switcher entre vista de Tabla densa y Tablero Kanban (Columnas: "Abierto", "En Proceso", "Resuelto")
   - Filtros instantáneos por Urgencia (Baja, Media, Alta, Crítica) y Estado
   - Barra de búsqueda por palabra clave o remitente
3. **Modal / Panel de Detalle de Ticket**:
   - Resumen del análisis de IA: Diagnóstico, Nivel de Confianza, SLA recomendado y Artículo KB coincidente
   - Editor de solución propuesta (permite al agente humano ajustar la solución antes de enviar)
   - Acciones de cambio de estado ("Marcar como En Proceso", "Resolver Ticket")
   - Timeline de auditoría y trazabilidad del ticket
4. **Formulario de Simulación en Tiempo Real**:
   - Permite al usuario pegar una incidencia real o seleccionar plantillas precargadas (SAP Ariba 503, Doc2Sign error de certificado, SQL Server Access Denied, etc.)
   - Disparo del endpoint `/api/triage` con indicador visual de inferencia y actualización instantánea de la lista de tickets.
