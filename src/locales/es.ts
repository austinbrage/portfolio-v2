/**
 * Spanish Translations
 */


export default {
  // Navbar
  "navbar-brand": "Portafolio",
  "navbar-home": "Inicio",
  "navbar-projects": "Proyectos",
  "navbar-blog": "Blog",
  "navbar-contact": "Contacto",

  // Hero
  "hero-name": "Agustin Brage",
  "hero-badge": "Disponible para Trabajar",
  "hero-greeting": "Hola, soy",
  "hero-description-prefix": "Un",
  "hero-description-highlight": "desarrollador full-stack",
  "hero-description-suffix": "enfocado en productos, construyendo aplicaciones rápidas, confiables y hermosas.",
  "hero-cta-primary": "Ver Mi Trabajo",
  "hero-cta-secondary": "Contáctame",

  // Experience
  "experience-title": "Experiencia",
  "experience-view-details": "Ver detalles",

  "experiences": [
    {
      title: "Desarrollador Full-Stack Senior",
      company: "TechCorp Solutions",
      startDate: "Ene 2023",
      endDate: "Presente",
      location: "San Francisco, CA",
      description: "Liderando el desarrollo de aplicaciones web escalables, mentoreando desarrolladores junior e implementando mejores prácticas en todo el equipo de ingeniería. Reducción de tiempos de carga en un 40% y aumento de la participación de usuarios en un 25% mediante optimización estratégica.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"]
    }
  ],

  // Projects
  "projects-title": "Proyectos Destacados",
  "projects-view-all": "Ver Todos los Proyectos",
  "projects-code": "Código",
  "projects-details": "Detalles",

  // Projects Page
  "projects-page-back": "Volver al Inicio",
  "projects-page-title": "Todos los Proyectos",
  "projects-page-description": "Una muestra de mi trabajo en desarrollo web, aplicaciones móviles y soluciones tecnológicas innovadoras. Cada proyecto representa un desafío único y una experiencia de aprendizaje.",

  // Project Detail Page
  "project-detail-back": "Volver a Proyectos",
  "project-detail-view-demo": "Ver Demo en Vivo",
  "project-detail-view-source": "Ver Código Fuente",
  "project-detail-timeline": "Duración",
  "project-detail-team": "Equipo",
  "project-detail-role": "Rol",
  "project-detail-overview": "Descripción General",
  "project-detail-challenge": "El Desafío",
  "project-detail-solution": "La Solución",
  "project-detail-features": "Características Clave",
  "project-detail-cta-title": "¿Te interesa este proyecto?",
  "project-detail-cta-description": "Me encantaría discutir los detalles técnicos, desafíos enfrentados y lecciones aprendidas al construir este proyecto.",
  "project-detail-cta-button": "Contactame",
  "project-detail-not-found": "Proyecto no encontrado",

  // Blog
  "blog-title": "Últimas Entradas del Blog",
  "blog-view-all": "Ver Todas las Entradas",

  // Blog Page
  "blog-page-back": "Volver al Inicio",
  "blog-page-title": "Blog",
  "blog-page-description": "Reflexiones, tutoriales y conocimientos sobre desarrollo web, ingeniería de software y las últimas tendencias tecnológicas. Acompañame en mi viaje de aprendizaje continuo y compartir conocimiento.",

  // Footer
  "footer-title": "Trabajemos Juntos",
  "footer-description": "Siempre estoy interesado en escuchar sobre nuevos proyectos y oportunidades. Ya sea que tengas una pregunta o solo quieras saludar, ¡no dudes en contactarme!",
  "footer-cta": "Contactame",
  "footer-copyright": "© 2025 Agustin Brage. Todos los derechos reservados.",

  // Contact Page
  "contact-back-button": "Volver al Inicio",
  "contact-hero-title": "Conectemos",
  "contact-hero-subtitle": "¿Tenés un proyecto en mente o solo querés charlar? ¡Me encantaría saber de vos!",
  "contact-card-email": "Correo",
  "contact-card-phone": "Teléfono",
  "contact-card-location": "Ubicación",
  "contact-location-value": "San Francisco, CA",
  "contact-phone-value": "+1 (234) 567-890",
  "contact-form-title": "Enviame un Mensaje",
  "contact-form-name-label": "Tu Nombre",
  "contact-form-name-placeholder": "Juan Pérez",
  "contact-form-email-label": "Tu Correo",
  "contact-form-email-placeholder": "juan@ejemplo.com",
  "contact-form-message-label": "Tu Mensaje",
  "contact-form-message-placeholder": "Contame sobre tu proyecto...",
  "contact-form-submit": "Enviar Mensaje",
  "contact-form-success": "¡Gracias por contactarme! Te responderé pronto.",
  "contact-social-title": "Conectate en Redes",
  "contact-social-github": "GitHub",
  "contact-social-linkedin": "LinkedIn",
  "contact-social-twitter": "Twitter",
  "contact-availability-title": "Disponibilidad",
  "contact-availability-description": "Actualmente estoy disponible para proyectos freelance y oportunidades de tiempo completo. ¡Construyamos algo increíble juntos!",
  "contact-availability-badge": "✨ Disponible para Trabajar",

  "projects": [
    {
      id: 1,
      title: "Plataforma de E-Commerce",
      description: "Tienda en línea completa con gestión de inventario en tiempo real, procesamiento de pagos y panel de análisis.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      gradient: "from-blue-500",
      githubUrl: "https://github.com/austinbrage/ecommerce",
      liveUrl: "https://demo-ecommerce.com",
      longDescription: "Construí una solución completa de e-commerce desde cero, manejando todo desde la gestión del catálogo de productos hasta el procesamiento seguro de pagos. La plataforma presenta una interfaz moderna y responsiva con capacidades avanzadas de búsqueda y filtrado, seguimiento de inventario en tiempo real, y un sofisticado panel de administración para gestionar pedidos, clientes y análisis.",
      challenge: "El principal desafío fue implementar una arquitectura escalable que pudiera manejar alto tráfico durante eventos de ventas mientras se mantenían tiempos de carga inferiores a un segundo. Además, integrar múltiples pasarelas de pago asegurando el cumplimiento PCI requirió planificación y ejecución cuidadosas.",
      solution: "Implementé una arquitectura de microservicios con caché Redis para datos frecuentemente accedidos, integración de CDN para activos estáticos y capacidades de escalado horizontal. Usé Stripe para el procesamiento de pagos con manejo adecuado de webhooks para confirmación de pedidos y actualizaciones de inventario.",
      features: [
        "Gestión de inventario en tiempo real en múltiples almacenes",
        "Filtrado y búsqueda avanzada de productos con Elasticsearch",
        "Procesamiento seguro de pagos con integración de Stripe",
        "Panel de administración completo con análisis",
        "Notificaciones por correo y seguimiento de pedidos",
        "Diseño responsivo optimizado para compras móviles"
      ],
      timeline: "3 meses",
      team: "4 desarrolladores, 1 diseñador, 1 PM",
      role: "Desarrollador Líder"
    },
    {
      id: 2,
      title: "App de Gestión de Tareas",
      description: "Herramienta de gestión de proyectos colaborativa con interfaz de arrastrar y soltar, chat de equipo y seguimiento de progreso.",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80",
      tags: ["Next.js", "TypeScript", "Prisma", "TailwindCSS"],
      gradient: "from-purple-500",
      githubUrl: "https://github.com/austinbrage/task-manager",
      liveUrl: "https://demo-taskmanager.com",
      longDescription: "Desarrollé una aplicación moderna de gestión de tareas diseñada para equipos remotos. La app presenta una interfaz intuitiva de arrastrar y soltar inspirada en Trello y Asana, características de colaboración en tiempo real y capacidades completas de seguimiento de proyectos. Construida con Next.js para rendimiento óptimo y SEO.",
      challenge: "Crear una experiencia fluida de colaboración en tiempo real donde múltiples miembros del equipo pudieran trabajar en el mismo tablero simultáneamente sin conflictos. También era necesario asegurar que la interfaz de arrastrar y soltar funcionara perfectamente en diferentes dispositivos y navegadores.",
      solution: "Implementé conexiones WebSocket para actualizaciones en tiempo real con resolución de conflictos usando transformación operacional. Usé actualizaciones optimistas de UI para retroalimentación instantánea e implementé un sistema robusto de gestión de estado con Zustand para manejar estados complejos del tablero.",
      features: [
        "Tableros de tareas arrastrables con columnas personalizables",
        "Colaboración en tiempo real con seguimiento de cursor en vivo",
        "Chat de equipo y @menciones para comunicación rápida",
        "Adjuntos de archivos y descripciones de texto enriquecido",
        "Seguimiento de progreso con gráficos de burndown",
        "Flujos de trabajo personalizados y reglas de automatización"
      ],
      timeline: "4 meses",
      team: "Proyecto individual",
      role: "Desarrollador Full-Stack y Diseñador"
    },
    {
      id: 3,
      title: "Panel de Análisis",
      description: "Plataforma de visualización de datos en tiempo real con widgets personalizables, generación de informes e integraciones de API.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["Vue.js", "D3.js", "Python", "FastAPI"],
      gradient: "from-orange-500",
      githubUrl: "https://github.com/austinbrage/analytics",
      liveUrl: "https://demo-analytics.com",
      longDescription: "Creé un potente panel de análisis que agrega datos de múltiples fuentes y los presenta a través de visualizaciones hermosas e interactivas. La plataforma permite a los usuarios crear paneles personalizados, configurar informes automatizados y obtener información de sus datos a través de opciones avanzadas de gráficos y filtrado.",
      challenge: "Procesar y visualizar grandes conjuntos de datos en tiempo real sin impactar el rendimiento. El panel necesitaba manejar millones de puntos de datos mientras proporcionaba interacciones fluidas y actualizaciones instantáneas.",
      solution: "Implementé agregación de datos del lado del servidor con Python y FastAPI, usando consultas de base de datos eficientes y estrategias de caché. En el frontend, usé Web Workers para cálculos pesados y desplazamiento virtual para tablas de datos grandes. Implementé carga progresiva de datos para mostrar resultados iniciales rápidamente.",
      features: [
        "Panel personalizable con widgets de arrastrar y soltar",
        "Gráficos interactivos usando D3.js y Chart.js",
        "Actualizaciones de datos en tiempo real vía WebSocket",
        "Filtrado avanzado y profundización de datos",
        "Generación programada de informes y entrega por correo",
        "Integraciones de API con plataformas populares"
      ],
      timeline: "5 meses",
      team: "3 desarrolladores, 1 analista de datos",
      role: "Líder de Frontend"
    },
    {
      id: 4,
      title: "Plataforma de Redes Sociales",
      description: "App de redes sociales moderna con mensajería en tiempo real, compartición de contenido y análisis de participación.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      tags: ["React Native", "GraphQL", "PostgreSQL", "Redis"],
      gradient: "from-green-500",
      githubUrl: "https://github.com/austinbrage/social-app",
      liveUrl: "https://demo-social.com",
      longDescription: "Construí una aplicación multiplataforma de redes sociales con características similares a Twitter e Instagram. La app incluye un sofisticado algoritmo de recomendación, mensajería en tiempo real, compartición de medios con procesamiento de imágenes y análisis detallados de participación para creadores de contenido.",
      challenge: "Construir una app móvil que funcione bien tanto en iOS como en Android mientras se mantiene paridad de características con plataformas web. También era necesario implementar un sistema eficiente de notificaciones que no agotara la batería.",
      solution: "Usé React Native con módulos nativos para características críticas de rendimiento. Implementé GraphQL para obtención eficiente de datos y caché. Construí un sistema inteligente de notificaciones usando Firebase Cloud Messaging con agrupación y niveles de prioridad para optimizar el uso de batería.",
      features: [
        "Mensajería en tiempo real con confirmaciones de lectura",
        "Compartición de medios con compresión y filtros automáticos",
        "Feed social con recomendaciones personalizadas",
        "Función de historias con expiración de 24 horas",
        "Análisis detallados para creadores de contenido",
        "Notificaciones push con agrupación inteligente"
      ],
      timeline: "6 meses",
      team: "5 desarrolladores, 2 diseñadores",
      role: "Desarrollador Líder Móvil"
    },
    {
      id: 5,
      title: "Generador de Contenido IA",
      description: "Plataforma de creación de contenido inteligente impulsada por aprendizaje automático para generar textos de marketing y artículos de blog.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      tags: ["Python", "OpenAI", "React", "FastAPI"],
      gradient: "from-violet-500",
      githubUrl: "https://github.com/austinbrage/ai-content",
      liveUrl: "https://demo-ai-content.com",
      longDescription: "Desarrollé una plataforma de creación de contenido impulsada por IA que ayuda a especialistas en marketing y escritores a generar contenido de alta calidad eficientemente. La plataforma aprovecha los modelos GPT de OpenAI para crear textos de marketing atractivos, artículos de blog y contenido para redes sociales manteniendo consistencia en la voz de marca.",
      challenge: "Crear un sistema confiable de generación de contenido con IA que produzca contenido consistente y apropiado para la marca evitando resultados genéricos o repetitivos. También era necesario implementar límites de tasa apropiados y gestión de costos para el uso de API.",
      solution: "Construí un sofisticado sistema de ingeniería de prompts con plantillas personalizadas y capacidades de ajuste fino. Implementé un pipeline de generación de contenido multi-etapa con análisis de tono y coincidencia de voz de marca. Agregué caché inteligente para reducir costos de API y tiempos de respuesta para solicitudes similares.",
      features: [
        "Múltiples tipos de contenido: artículos, redes sociales, anuncios",
        "Personalización y consistencia de voz de marca",
        "Sugerencias de optimización SEO",
        "Plantillas de contenido y biblioteca de prompts",
        "Colaboración y edición en tiempo real",
        "Análisis de uso y seguimiento de costos"
      ],
      timeline: "4 meses",
      team: "3 desarrolladores, 1 ingeniero de ML",
      role: "Líder Backend e Integración ML"
    },
    {
      id: 6,
      title: "App de Seguimiento de Fitness",
      description: "Rastreador de fitness integral con planificación de entrenamientos, seguimiento de nutrición y visualización de progreso.",
      image: "https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=800&q=80",
      tags: ["React Native", "Firebase", "HealthKit", "Charts"],
      gradient: "from-emerald-500",
      githubUrl: "https://github.com/austinbrage/fitness-tracker",
      liveUrl: "https://demo-fitness.com",
      longDescription: "Construí una aplicación integral de seguimiento de fitness que ayuda a los usuarios a alcanzar sus objetivos de salud a través de planificación de entrenamientos, seguimiento de nutrición y análisis detallados de progreso. La app se integra con APIs nativas de salud para proporcionar seguimiento preciso y recomendaciones personalizadas.",
      challenge: "Integrar con APIs de salud específicas de plataforma (HealthKit para iOS, Google Fit para Android) mientras se mantiene una experiencia de usuario consistente en todas las plataformas. También era necesario manejar funcionalidad offline para entornos de gimnasio con conectividad pobre.",
      solution: "Creé una capa de abstracción unificada de datos de salud que funciona perfectamente en ambas plataformas. Implementé arquitectura local-first con Firebase para sincronización, asegurando que la app funcione perfectamente offline y se sincronice automáticamente cuando se conecta. Usé tareas en segundo plano para seguimiento continuo de actividad.",
      features: [
        "Planificación de entrenamientos con biblioteca de ejercicios y videos",
        "Seguimiento de nutrición con escaneo de códigos de barras",
        "Visualización de progreso con gráficos interactivos",
        "Integración con HealthKit y Google Fit",
        "Características sociales para responsabilidad y motivación",
        "Offline-first con sincronización automática en la nube"
      ],
      timeline: "5 meses",
      team: "2 desarrolladores, 1 consultor de fitness",
      role: "Desarrollador Móvil Líder"
    }
  ],

  "blogPosts": [
    {
      id: 1,
      title: "Construyendo Aplicaciones React Escalables",
      excerpt: "Aprende las mejores prácticas y patrones para crear aplicaciones React que puedan crecer con las necesidades de tu negocio.",
      date: "28 Nov 2025",
      readTime: "5 min de lectura",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      category: "Desarrollo",
      tags: ["React", "Arquitectura", "Mejores Prácticas"]
    },
    {
      id: 2,
      title: "El Futuro del Desarrollo Web",
      excerpt: "Explorando las próximas tendencias y tecnologías que darán forma a cómo construimos para la web en 2026 y más allá.",
      date: "20 Nov 2025",
      readTime: "8 min de lectura",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      category: "Tendencias Tech",
      tags: ["Web3", "IA", "Tecnología Futura"]
    },
    {
      id: 3,
      title: "Dominando TypeScript en 2025",
      excerpt: "Una guía completa de características avanzadas de TypeScript y cómo aprovecharlas en tus proyectos.",
      date: "15 Nov 2025",
      readTime: "6 min de lectura",
      image: "https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?w=800&q=80",
      category: "Desarrollo",
      tags: ["TypeScript", "JavaScript", "Programación"]
    },
    {
      id: 4,
      title: "Sistemas de Diseño Escalables",
      excerpt: "Cómo construir y mantener sistemas de diseño que crecen con tu producto y equipo.",
      date: "10 Nov 2025",
      readTime: "7 min de lectura",
      image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80",
      category: "Diseño",
      tags: ["Sistemas de Diseño", "UI/UX", "Escalabilidad"]
    },
    {
      id: 5,
      title: "Optimizando el Rendimiento Web",
      excerpt: "Técnicas probadas para hacer tus aplicaciones web más rápidas y eficientes.",
      date: "5 Nov 2025",
      readTime: "10 min de lectura",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      category: "Rendimiento",
      tags: ["Optimización", "Web Vitals", "Performance"]
    },
    {
      id: 6,
      title: "Construyendo con IA: Guía para Desarrolladores",
      excerpt: "Integrando capacidades de IA en tus aplicaciones con ejemplos prácticos y mejores prácticas.",
      date: "30 Oct 2025",
      readTime: "12 min de lectura",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      category: "IA & ML",
      tags: ["IA", "Machine Learning", "Integración"]
    }
  ]
}