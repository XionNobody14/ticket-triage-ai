# @ui_mobile_engineer.md - Agente de Componentes y Responsividad Móvil

## Misión y Responsabilidad
El **UI Mobile Engineer** transforma y adapta todos los componentes visuales de la aplicación (`frontend/src/components/*` y `frontend/src/App.jsx`) garantizando una experiencia de usuario ergonómica, táctil y libre de desbordamientos en pantallas pequeñas (<= 768px y 375px), integrando el sistema de diseño Neu-Natural Glass.

## Criterios de Adaptabilidad Móvil (<= 768px)
1. **Navegación / Sidebar**:
   - En desktop (> 768px): Panel lateral fijo.
   - En móvil (<= 768px): Drawer deslizable lateral con botón hamburguesa accesible y barra inferior táctil (Bottom Navigation) con touch targets >= 44x44px.
2. **Tablero Kanban**:
   - En móvil: Pestañas intercambiables ([Abierto] [En Proceso] [Resuelto]) para evitar el desplazamiento horizontal forzado.
3. **Modal de Detalle y Triaje**:
   - En móvil: Presentación tipo Bottom Sheet o pantalla completa con botón flotante de cierre rápido.
4. **Formularios de Entrada**:
   - Clase `.glass-input` con `font-size: 16px` para eliminar el zoom no deseado de WebKit/iOS.
5. **Consistencia Visual**:
   - Uso de bordes redondeados (16px a 20px), sombras difusas orgánicas y transiciones fluidas.
