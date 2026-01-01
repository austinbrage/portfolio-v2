/**
 * English Translations
 */


export default {
  // Navbar
  "navbar-brand": "Portfolio",
  "navbar-home": "Home",
  "navbar-projects": "Projects",
  "navbar-blog": "Blog",
  "navbar-contact": "Contact",

  // Hero
  "hero-name": "Austin Brage",
  "hero-badge": "Available for Work",
  "hero-greeting": "Hi, I'm",
  "hero-description-prefix": "A product-focused",
  "hero-description-highlight": "full-stack developer",
  "hero-description-suffix": "building fast, reliable, beautiful products.",
  "hero-cta-primary": "View My Work",
  "hero-cta-secondary": "Contact Me",

  // Experience
  "experience-title": "Experience",
  "experience-view-details": "View details",

  "experiences": [
    {
      title: "Senior Full-Stack Developer",
      company: "TechCorp Solutions",
      startDate: "Jan 2023",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "Leading the development of scalable web applications, mentoring junior developers, and implementing best practices across the engineering team. Reduced load times by 40% and increased user engagement by 25% through strategic optimization.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"]
    }
  ],

  // Projects
  "projects-title": "Featured Projects",
  "projects-view-all": "View All Projects",
  "projects-code": "Code",
  "projects-details": "Details",

  // Projects Page
  "projects-page-back": "Back to Home",
  "projects-page-title": "All Projects",
  "projects-page-description": "A showcase of my work across web development, mobile apps, and innovative tech solutions. Each project represents a unique challenge and learning experience.",

  // Project Detail Page
  "project-detail-back": "Back to Projects",
  "project-detail-view-demo": "View Live Demo",
  "project-detail-view-source": "View Source Code",
  "project-detail-timeline": "Timeline",
  "project-detail-team": "Team",
  "project-detail-role": "Role",
  "project-detail-overview": "Overview",
  "project-detail-challenge": "The Challenge",
  "project-detail-solution": "The Solution",
  "project-detail-features": "Key Features",
  "project-detail-cta-title": "Interested in this project?",
  "project-detail-cta-description": "I'd love to discuss the technical details, challenges faced, and lessons learned from building this project.",
  "project-detail-cta-button": "Get in Touch",
  "project-detail-not-found": "Project not found",

  // Blog
  "blog-title": "Latest from the Blog",
  "blog-view-all": "View All Posts",

  // Blog Page
  "blog-page-back": "Back to Home",
  "blog-page-title": "Blog",
  "blog-page-description": "Thoughts, tutorials, and insights about web development, software engineering, and the latest tech trends. Join me on my journey of continuous learning and sharing knowledge.",

  // Footer
  "footer-title": "Let's Work Together",
  "footer-description": "I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!",
  "footer-cta": "Get In Touch",
  "footer-copyright": "© 2025 Austin Brage. All rights reserved.",

  // Contact Page
  "contact-back-button": "Back to Home",
  "contact-hero-title": "Let's Connect",
  "contact-hero-subtitle": "Have a project in mind or just want to chat? I'd love to hear from you!",
  "contact-card-email": "Email",
  "contact-card-phone": "Phone",
  "contact-card-location": "Location",
  "contact-location-value": "San Francisco, CA",
  "contact-phone-value": "+1 (234) 567-890",
  "contact-form-title": "Send Me a Message",
  "contact-form-name-label": "Your Name",
  "contact-form-name-placeholder": "John Doe",
  "contact-form-email-label": "Your Email",
  "contact-form-email-placeholder": "john@example.com",
  "contact-form-message-label": "Your Message",
  "contact-form-message-placeholder": "Tell me about your project...",
  "contact-form-submit": "Send Message",
  "contact-form-success": "Thanks for reaching out! I'll get back to you soon.",
  "contact-social-title": "Connect on Social",
  "contact-social-github": "GitHub",
  "contact-social-linkedin": "LinkedIn",
  "contact-social-twitter": "Twitter",
  "contact-availability-title": "Availability",
  "contact-availability-description": "I'm currently available for freelance projects and full-time opportunities. Let's build something amazing together!",
  "contact-availability-badge": "✨ Open to Work",

  "projects": [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured online store with real-time inventory management, payment processing, and analytics dashboard.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      gradient: "from-blue-500",
      githubUrl: "https://github.com/austinbrage/ecommerce",
      liveUrl: "https://demo-ecommerce.com",
      longDescription: "Built a comprehensive e-commerce solution from the ground up, handling everything from product catalog management to secure payment processing. The platform features a modern, responsive interface with advanced search and filtering capabilities, real-time inventory tracking, and a sophisticated admin dashboard for managing orders, customers, and analytics.",
      challenge: "The main challenge was implementing a scalable architecture that could handle high traffic during sales events while maintaining sub-second page load times. Additionally, integrating multiple payment gateways while ensuring PCI compliance required careful planning and execution.",
      solution: "Implemented a microservices architecture with Redis caching for frequently accessed data, CDN integration for static assets, and horizontal scaling capabilities. Used Stripe for payment processing with proper webhook handling for order confirmation and inventory updates.",
      features: [
        "Real-time inventory management across multiple warehouses",
        "Advanced product filtering and search with Elasticsearch",
        "Secure payment processing with Stripe integration",
        "Comprehensive admin dashboard with analytics",
        "Email notifications and order tracking",
        "Responsive design optimized for mobile shopping"
      ],
      timeline: "3 months",
      team: "4 developers, 1 designer, 1 PM",
      role: "Lead Developer"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative project management tool with drag-and-drop interface, team chat, and progress tracking.",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80",
      tags: ["Next.js", "TypeScript", "Prisma", "TailwindCSS"],
      gradient: "from-purple-500",
      githubUrl: "https://github.com/austinbrage/task-manager",
      liveUrl: "https://demo-taskmanager.com",
      longDescription: "Developed a modern task management application designed for remote teams. The app features an intuitive drag-and-drop interface inspired by Trello and Asana, real-time collaboration features, and comprehensive project tracking capabilities. Built with Next.js for optimal performance and SEO.",
      challenge: "Creating a smooth real-time collaboration experience where multiple team members could work on the same board simultaneously without conflicts. Also needed to ensure the drag-and-drop interface worked flawlessly across different devices and browsers.",
      solution: "Implemented WebSocket connections for real-time updates with conflict resolution using operational transformation. Used optimistic UI updates for instant feedback and implemented a robust state management system with Zustand to handle complex board states.",
      features: [
        "Drag-and-drop task boards with customizable columns",
        "Real-time collaboration with live cursor tracking",
        "Team chat and @mentions for quick communication",
        "File attachments and rich text descriptions",
        "Progress tracking with burndown charts",
        "Custom workflows and automation rules"
      ],
      timeline: "4 months",
      team: "Solo project",
      role: "Full-Stack Developer & Designer"
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      description: "Real-time data visualization platform with customizable widgets, report generation, and API integrations.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["Vue.js", "D3.js", "Python", "FastAPI"],
      gradient: "from-orange-500",
      githubUrl: "https://github.com/austinbrage/analytics",
      liveUrl: "https://demo-analytics.com",
      longDescription: "Created a powerful analytics dashboard that aggregates data from multiple sources and presents it through beautiful, interactive visualizations. The platform allows users to create custom dashboards, set up automated reports, and gain insights from their data through advanced charting and filtering options.",
      challenge: "Processing and visualizing large datasets in real-time without impacting performance. The dashboard needed to handle millions of data points while providing smooth interactions and instant updates.",
      solution: "Implemented server-side data aggregation with Python and FastAPI, using efficient database queries and caching strategies. On the frontend, used Web Workers for heavy computations and virtual scrolling for large data tables. Implemented progressive data loading to show initial results quickly.",
      features: [
        "Customizable dashboard with drag-and-drop widgets",
        "Interactive charts using D3.js and Chart.js",
        "Real-time data updates via WebSocket",
        "Advanced filtering and data drill-down",
        "Scheduled report generation and email delivery",
        "API integrations with popular platforms"
      ],
      timeline: "5 months",
      team: "3 developers, 1 data analyst",
      role: "Frontend Lead"
    },
    {
      id: 4,
      title: "Social Media Platform",
      description: "Modern social networking app with real-time messaging, content sharing, and engagement analytics.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      tags: ["React Native", "GraphQL", "PostgreSQL", "Redis"],
      gradient: "from-green-500",
      githubUrl: "https://github.com/austinbrage/social-app",
      liveUrl: "https://demo-social.com",
      longDescription: "Built a cross-platform social networking application with features similar to Twitter and Instagram. The app includes a sophisticated recommendation algorithm, real-time messaging, media sharing with image processing, and detailed engagement analytics for content creators.",
      challenge: "Building a mobile app that performs well on both iOS and Android while maintaining feature parity with web platforms. Also needed to implement an efficient notification system that doesn't drain battery life.",
      solution: "Used React Native with native modules for performance-critical features. Implemented GraphQL for efficient data fetching and caching. Built a smart notification system using Firebase Cloud Messaging with batching and priority levels to optimize battery usage.",
      features: [
        "Real-time messaging with read receipts",
        "Media sharing with automatic compression and filtering",
        "Social feed with personalized recommendations",
        "Stories feature with 24-hour expiration",
        "Detailed analytics for content creators",
        "Push notifications with smart batching"
      ],
      timeline: "6 months",
      team: "5 developers, 2 designers",
      role: "Mobile Lead Developer"
    },
    {
      id: 5,
      title: "AI Content Generator",
      description: "Intelligent content creation platform powered by machine learning for generating marketing copy and blog posts.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      tags: ["Python", "OpenAI", "React", "FastAPI"],
      gradient: "from-violet-500",
      githubUrl: "https://github.com/austinbrage/ai-content",
      liveUrl: "https://demo-ai-content.com",
      longDescription: "Developed an AI-powered content creation platform that helps marketers and writers generate high-quality content efficiently. The platform leverages OpenAI's GPT models to create engaging marketing copy, blog posts, and social media content while maintaining brand voice consistency.",
      challenge: "Creating a reliable AI content generation system that produces consistent, brand-appropriate content while avoiding generic or repetitive outputs. Also needed to implement proper rate limiting and cost management for API usage.",
      solution: "Built a sophisticated prompt engineering system with custom templates and fine-tuning capabilities. Implemented a multi-stage content generation pipeline with tone analysis and brand voice matching. Added smart caching to reduce API costs and response times for similar requests.",
      features: [
        "Multiple content types: blog posts, social media, ads",
        "Brand voice customization and consistency",
        "SEO optimization suggestions",
        "Content templates and prompt library",
        "Real-time collaboration and editing",
        "Usage analytics and cost tracking"
      ],
      timeline: "4 months",
      team: "3 developers, 1 ML engineer",
      role: "Backend Lead & ML Integration"
    },
    {
      id: 6,
      title: "Fitness Tracking App",
      description: "Comprehensive fitness tracker with workout planning, nutrition tracking, and progress visualization.",
      image: "https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=800&q=80",
      tags: ["React Native", "Firebase", "HealthKit", "Charts"],
      gradient: "from-emerald-500",
      githubUrl: "https://github.com/austinbrage/fitness-tracker",
      liveUrl: "https://demo-fitness.com",
      longDescription: "Built a comprehensive fitness tracking application that helps users achieve their health goals through workout planning, nutrition tracking, and detailed progress analytics. The app integrates with native health APIs to provide accurate tracking and personalized recommendations.",
      challenge: "Integrating with platform-specific health APIs (HealthKit for iOS, Google Fit for Android) while maintaining a consistent user experience across platforms. Also needed to handle offline functionality for gym environments with poor connectivity.",
      solution: "Created a unified health data abstraction layer that works seamlessly across both platforms. Implemented local-first architecture with Firebase for sync, ensuring the app works perfectly offline and syncs automatically when connected. Used background tasks for continuous activity tracking.",
      features: [
        "Workout planning with exercise library and videos",
        "Nutrition tracking with barcode scanning",
        "Progress visualization with interactive charts",
        "Integration with HealthKit and Google Fit",
        "Social features for accountability and motivation",
        "Offline-first with automatic cloud sync"
      ],
      timeline: "5 months",
      team: "2 developers, 1 fitness consultant",
      role: "Lead Mobile Developer"
    }
  ],

  "blogPosts": [
    {
      id: 1,
      title: "Building Scalable React Applications",
      excerpt: "Learn the best practices and patterns for creating React apps that can grow with your business needs.",
      date: "Nov 28, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      category: "Development",
      tags: ["React", "Architecture", "Best Practices"]
    },
    {
      id: 2,
      title: "The Future of Web Development",
      excerpt: "Exploring upcoming trends and technologies that will shape how we build for the web in 2026 and beyond.",
      date: "Nov 20, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      category: "Tech Trends",
      tags: ["Web3", "AI", "Future Tech"]
    },
    {
      id: 3,
      title: "Mastering TypeScript in 2025",
      excerpt: "A comprehensive guide to advanced TypeScript features and how to leverage them in your projects.",
      date: "Nov 15, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?w=800&q=80",
      category: "Development",
      tags: ["TypeScript", "JavaScript", "Programming"]
    },
    {
      id: 4,
      title: "Design Systems That Scale",
      excerpt: "How to build and maintain design systems that grow with your product and team.",
      date: "Nov 10, 2025",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80",
      category: "Design",
      tags: ["Design Systems", "UI/UX", "Scalability"]
    },
    {
      id: 5,
      title: "Optimizing Web Performance",
      excerpt: "Proven techniques to make your web applications faster and more efficient.",
      date: "Nov 5, 2025",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      category: "Performance",
      tags: ["Optimization", "Web Vitals", "Performance"]
    },
    {
      id: 6,
      title: "Building with AI: A Developer's Guide",
      excerpt: "Integrating AI capabilities into your applications with practical examples and best practices.",
      date: "Oct 30, 2025",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      category: "AI & ML",
      tags: ["AI", "Machine Learning", "Integration"]
    }
  ]
}