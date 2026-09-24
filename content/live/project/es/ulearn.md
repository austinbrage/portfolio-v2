## Por qué seis servicios en lugar de uno

Las apps de aprendizaje de idiomas suelen lanzarse como un backend único: un servidor, una base de datos, listo. uLearn empezó así también, y no sobrevivió al contacto con los requerimientos reales.

En el momento en que agregás conversación por voz en tiempo real con un tutor de IA, tenés tres cargas de trabajo genuinamente distintas viviendo bajo un mismo techo: una etapa de speech-to-text que necesita ser rápida, una etapa de text-to-speech que necesita ser rápida de otra forma, y una llamada a un LLM en el medio que es más lenta que ambas. Meter las tres en un solo servicio hace que la más lenta marque el ritmo de todo lo demás — incluidas partes de la app que no tienen nada que ver con la voz, como generar una flashcard mientras se lee.

Por eso uLearn corre como seis servicios independientes en Go — un servicio de contenido respaldado por LLM, speech-to-text, text-to-speech, un generador de texto, email y la API central — más un frontend web, todo desplegado en AWS (ECS, EC2, DynamoDB) y provisionado con Pulumi. Diseñé, construí y sigo operando cada parte en solitario.

## Lo difícil no fueron las llamadas al LLM

La suposición obvia sobre una "app de idiomas con IA" es que el problema difícil de ingeniería es escribir bien los prompts. No lo es — o al menos, no es el problema difícil *interesante*.

El problema real es que el alemán, el ruso, el francés y el inglés no comparten una misma gramática. El alemán necesita manejo de casos y declinaciones. El ruso necesita su propia lógica de conjugación y declinación, estructuralmente distinta de la del alemán. Las tablas verbales del francés no encajan bien en ninguna de las dos. Pedirle a un modelo "acá tenés una palabra, dame sus formas gramaticales" y confiar en lo que devuelva está bien para una demo, pero no es confiable para un producto del que la gente realmente está tratando de aprender.

El servicio de contenido maneja la gramática de cada idioma con su propia lógica dedicada — código de conjugación y declinación por idioma, no un solo prompt compartido tratando de generalizar entre todos. El LLM sigue haciendo la generación en sí (información de palabras, contenido de flashcards, traducciones, resúmenes), pero qué se pide, cómo se estructura la respuesta y cómo se valida es determinista por idioma, no el modelo improvisando gramática sobre la marcha.

## Siendo precisos sobre qué es un "agente" y qué no

Es tentador llamar al servicio de contenido un "agente de IA" — es el término que todos usan en 2026, y quedaría bien en el papel. No sería preciso. No hay un loop de planificación, ni selección autónoma de herramientas, ni razonamiento en múltiples pasos que el modelo haga por su cuenta. Es un conjunto de endpoints de LLM con propósito fijo: generar un campo de flashcard, resumir un texto, traducir una frase, sugerir una palabra, buscar información gramatical. Estructurado, útil — y algo distinto de un agente en el sentido en que la palabra realmente se usa.

El único lugar donde "tutor de IA" es la palabra correcta y no una exageración es la propia función de conversación por voz: un ida y vuelta en vivo donde el modelo reacciona a lo que el estudiante realmente dice, corrige en contexto y puede generar un escenario de práctica personalizado a pedido. Eso sí se acerca a lo que la gente imagina cuando escucha "tutor de IA" — en tiempo real, con capacidad de respuesta, no un guion fijo.

## Dónde corre

uLearn está en vivo en [ultimatelearning.app](https://ultimatelearning.app), con planes de suscripción Free, Pro y Premium, soportando alemán, inglés, ruso y francés. El frontend web se sirve a través de [HTML6](/es/projects/html6) — el mismo motor de plantillas del lado del servidor que construí en Eldoy Projects — así que el motor que empezó como una herramienta interna en una empresa hoy es lo que renderiza mi propio producto en producción, para usuarios reales, todos los días.
