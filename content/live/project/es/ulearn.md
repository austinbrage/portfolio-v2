## Una conversación, no un guion

El tutor de IA sostiene una conversación de ida y vuelta real, en voz alta. Reacciona a lo que decís, corrige en contexto, y armar un escenario de práctica a pedido en vez de seguir un guion fijo.

Es un problema de ingeniería lo bastante grande como para tener [su propia nota](/es/blog/real-time-voice-ai-tutor): mantener un WebSocket abierto en vez de ir y volver por HTTP, filtrar el micrófono con detección de actividad de voz real, y asegurarse de que el asistente nunca hable sobre sí mismo.

## Leé cualquier cosa, convertila en repaso

Marcá una palabra o una frase en cualquier cosa que estés leyendo, incluso dentro de una transcripción de YouTube, y se convierte en una flashcard en el momento: traducción, gramática y contexto ya completos. Sin entrada manual de datos, sin una app separada para vocabulario. Míralo por tu cuenta en un [tour guiado de leer y buscar una palabra](https://ultimatelearning.app/es/tour/learn/text).

<figure>
<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama del ciclo lectura-repaso: leés algo, tocás una palabra, se crea una flashcard automáticamente, y vuelve más adelante según un cronograma de repetición espaciada">
  <defs>
    <marker id="ulearn-loop-arrow-es" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="400" y="14" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">vuelve según su propio cronograma</text>
  <path d="M 700 90 C 700 0, 100 0, 100 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ulearn-loop-arrow-es)" />
  <line x1="185" y1="135" x2="210" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-loop-arrow-es)" />
  <line x1="385" y1="135" x2="410" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-loop-arrow-es)" />
  <line x1="585" y1="135" x2="610" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-loop-arrow-es)" />
  <rect x="15" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="100" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Leés</text>
  <text x="100" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">texto o video</text>
  <rect x="215" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="300" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Tocás una palabra</text>
  <text x="300" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">o frase</text>
  <rect x="415" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="500" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Se crea la card</text>
  <text x="500" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">gramática + traducción</text>
  <rect x="615" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="700" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Se repasa después</text>
  <text x="700" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">espaciado según cuánto sabés</text>
</svg>
<figcaption>Leer y repasar se alimentan entre sí. Nada se escribe a mano, y nada se repasa con un cronograma fijo.</figcaption>
</figure>

<figure>
<div style="position:relative; width:100%; aspect-ratio:16/9; border-radius:1rem; overflow:hidden;">
<iframe src="https://www.youtube.com/embed/YrviB941Ym8" title="Demo de uLearn: leer, tocar una palabra, crear una flashcard y repasarla" style="position:absolute; inset:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
<figcaption>El mismo flujo en vivo, tal como aparece en la home de uLearn.</figcaption>
</figure>

El repaso tampoco es un mazo estático. Las cards vuelven espaciadas según cuánto ya sabés cada una, no en el mismo orden todas las veces. Acá tenés también un [tour guiado de la página de repaso](https://ultimatelearning.app/es/tour/review).

## Cuatro idiomas, cada uno a su manera

Las flashcards están hechas a medida de la gramática de cada idioma, no en base a una sola plantilla estirada para los cuatro. Los sustantivos en ruso tienen tablas de declinación completas, porque el sistema de casos del ruso es lo bastante complejo como para justificarlas. Los sustantivos en alemán también declinan, pero de forma tan simple que una tabla dedicada sería excesiva, así que sus flashcards la omiten. El francés se apoya más en la conjugación verbal. Mirá cómo se ve eso un poco más abajo.

Eso es posible porque cada idioma tiene su propia tabla en DynamoDB, y DynamoDB no tiene schema fijo: un campo nuevo, como una tabla de gramática que un idioma no necesitaba antes, se puede agregar directo en producción, sin migración.

## Cómo se ve en la práctica

### Una flashcard, completada por vos

Traducción, significado, oraciones de ejemplo reales y frecuencia de uso, generado con un solo toque, no escrito a mano.

<figure>
<img src="/images/ulearn-flashcard-es.png" alt="Detalle de flashcard de uLearn para el verbo francés arriver, con traducción, significado, oraciones de ejemplo y frecuencia de uso" style="width:100%; border-radius:1rem;" />
<figcaption>La flashcard de "arriver", creada en el momento en que se tocó la palabra mientras se leía.</figcaption>
</figure>

### La tabla de conjugación que arma

El francés se apoya en la conjugación verbal, así que eso es lo que reciben sus flashcards: cada tiempo verbal, generado directo desde el verbo.

<figure>
<img src="/images/ulearn-flashcard-table-es.png" alt="Tabla de conjugación del verbo francés arriver en présent, passé composé, imparfait y futur simple" style="width:100%; border-radius:1rem;" />
<figcaption>Présent, passé composé, imparfait, futur simple: los cuatro generados, ninguno escrito a mano.</figcaption>
</figure>

### Agrupado por gramática, no por fecha

Las colecciones organizan las flashcards por lo que enseñan, como todos los verbos franceses que usan être como auxiliar, no por cuándo se agregaron.

<figure>
<img src="/images/ulearn-collections-es.png" alt="Vista de colecciones de uLearn mostrando la colección de gramática Verbos con être en francés" style="width:100%; border-radius:1rem;" />
<figcaption>La colección "Verbos con être": una sola regla de gramática, todas las palabras que la siguen.</figcaption>
</figure>

## Construido y operado por una sola persona

Nada de eso corre en un solo servidor. AWS para hosting y la base de datos, Groq para speech-to-text, OpenAI para text-to-speech, Gemini para chat y generación de texto, Webshare como proxy para los videos de YouTube que los estudiantes usan para aprender: cinco proveedores externos, y una sola persona manteniendo todo eso integrado y funcionando.

<figure>
<svg viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de cinco proveedores externos alimentando nueve servicios independientes, todo operado por un desarrollador">
  <defs>
    <marker id="ulearn-solo-arrow-es" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <rect x="15" y="15" width="140" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="85" y="34" text-anchor="middle" font-size="11" fill="currentColor">AWS</text>
  <rect x="15" y="49" width="140" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="85" y="68" text-anchor="middle" font-size="11" fill="currentColor">Groq</text>
  <rect x="15" y="83" width="140" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="85" y="102" text-anchor="middle" font-size="11" fill="currentColor">OpenAI</text>
  <rect x="15" y="117" width="140" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="85" y="136" text-anchor="middle" font-size="11" fill="currentColor">Gemini</text>
  <rect x="15" y="151" width="140" height="28" rx="14" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="85" y="170" text-anchor="middle" font-size="11" fill="currentColor">Webshare</text>
  <text x="85" y="200" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">5 proveedores externos</text>
  <line x1="160" y1="97" x2="275" y2="97" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-solo-arrow-es)" />
  <rect x="290" y="25" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="340" y="25" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="390" y="25" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="290" y="75" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="340" y="75" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="390" y="75" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="290" y="125" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="340" y="125" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="390" y="125" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="360" y="195" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">9 servicios independientes</text>
  <text x="345" y="230" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">operados por un solo desarrollador</text>
</svg>
<figcaption>Cinco proveedores, ninguno bajo mi control, alimentando nueve servicios chicos en vez de un solo backend compartido, así un problema con un proveedor queda contenido a un solo servicio.</figcaption>
</figure>

La técnica que hace eso manejable es una arquitectura de microservicios. Nueve servicios independientes, cada uno con un solo trabajo, desplegados en AWS ECS. Tocar la generación de chats con Gemini significa abrir un repositorio específico, no un archivo enterrado dentro de un proyecto más grande que toca una docena de otras cosas, y un problema en un proveedor, digamos que se cae la API de STT de Groq, queda contenido a ese servicio en vez de tirar abajo toda la app.

## Dónde corre

uLearn está en vivo en [ultimatelearning.app](https://ultimatelearning.app), soportando alemán, inglés, ruso y francés, en planes Free, Pro y Premium. El frontend web se sirve a través de [HTML6](/es/projects/html6), el mismo motor de plantillas construido en Eldøy Projects, ahora corriendo un producto propio en producción.
