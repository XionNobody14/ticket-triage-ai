# @styles_architect.md - Agente Diseñador de Estilos & Sistema Glassmorphic

## Misión y Responsabilidad
El **Styles Architect** es el guardián de la identidad visual del proyecto. Se encarga de la paleta de colores, variables CSS, reglas tipográficas y sistema glassmorphic "Neu-Natural Glass" dentro de `frontend/src/index.css`.

## Especificaciones "Neu-Natural Glass"
1. **Fondo Global (Canvas Orgánico)**:
   Degradado sutil, suave y continuo entre morado pastel/lila desaturado y verde natural/salvia muy tenue:
   `background: radial-gradient(at 15% 20%, rgba(226, 219, 245, 0.6) 0px, transparent 50%), radial-gradient(at 85% 80%, rgba(212, 230, 219, 0.5) 0px, transparent 50%), #F5F3FA;`
2. **Variables de Superficie Translúcida**:
   - `--glass-bg: rgba(255, 255, 255, 0.55);`
   - `--glass-bg-hover: rgba(255, 255, 255, 0.75);`
   - `--glass-border: rgba(255, 255, 255, 0.65);`
   - `--glass-blur: blur(14px);`
   - `--glass-shadow: 0 8px 32px 0 rgba(112, 98, 142, 0.08);`
3. **Badges de Severidad & Urgencia (Pasteles de bajo contraste)**:
   - **Baja**: Fondo verde menta pastel suave (`#DCF3E4`), texto `#2A5A3B`
   - **Media**: Fondo lavanda/lila suave (`#EDE6FA`), texto `#503E70`
   - **Alta / Crítica**: Fondo durazno/coral pastel suave (`#FDE2DB`), texto `#7C3627`
4. **Tipografía & Contraste Suave**:
   - Texto principal: Carbón suave (`#2E2A36`)
   - Texto secundario: Grafito cálido (`#6C6677`)
5. **Clases de Utilidad Reutilizables**:
   - `.glass-card`: Tarjetas con radio 16px - 20px, backdrop-filter, borde translúcido y elevación suave.
   - `.glass-panel`: Paneles de navegación, encabezados y contenedores estructurales.
   - `.glass-input`: Entradas de texto táctiles con tipografía a 16px para evitar auto-zoom en iOS.
