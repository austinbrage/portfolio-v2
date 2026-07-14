## Detrás de escena

Construir la plataforma de e-commerce implicó equilibrar dos necesidades en
tensión: un catálogo que se sintiera instantáneo al navegar, y un panel de
administración que se mantuviera preciso bajo carga concurrente real —
pedidos entrando mientras se ajustaba el inventario, descuentos cambiando a
mitad del checkout, ese tipo de cosas.

![Panel de administración mostrando analíticas de pedidos e inventario](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)

### Qué haría diferente

Con más tiempo, movería más de la lógica de reconciliación de inventario a
la capa de base de datos (bloqueo a nivel de fila) en lugar de apoyarme
tanto en Redis como fuente de verdad — funcionó, pero agregó una clase de
bugs de invalidación de caché que un modelo de consistencia más estricto
habría evitado directamente.

### Notas de stack

- **Frontend**: React, con code-splitting bastante agresivo por ruta para
  mantener el bundle inicial pequeño.
- **Backend**: Servicios de Node.js detrás de un API gateway, cada uno con
  un alcance acotado (catálogo, pedidos, pagos) en vez de un monolito.
- **Datos**: MongoDB para el catálogo (la flexibilidad de esquema importaba
  más que las relaciones estrictas ahí), Redis para caché de rutas críticas.
- **Pagos**: [Stripe](https://stripe.com/docs) para el procesamiento y confirmación de pedidos vía webhooks.

Para un enfoque distinto de estado en tiempo real sin una capa de pagos de por medio, mirá [la app de gestión de tareas](/es/projects/task-management-app) que construí después.
