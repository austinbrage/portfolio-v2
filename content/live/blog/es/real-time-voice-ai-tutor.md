## Por qué la mayoría de las IA de voz se sienten como un menú telefónico

Construí un asistente de voz con IA de la forma directa y esto es lo que te queda por defecto: **silencio muerto** después de que dejás de hablar, después arranca la respuesta, y si intentás meterte antes, o te ignora o las voces chocan.

Eso **no es un problema del modelo**. Es **plomería**: cómo viaja el audio del micrófono al speech-to-text, a través del modelo, de vuelta por text-to-speech, y hasta el parlante, sin que cada salto se convierta en una espera.

[El tutor de IA de uLearn](https://ultimatelearning.app/es/tour/tutor/session) vive o muere en esa plomería. Es una app de aprendizaje de idiomas construida para **sostener una conversación hablada**, no para escribir en un chat. Que se sienta como hablar con una persona, y no con un formulario de voz, significó tratar la capa de transporte como una **fase de diseño clave** desde el día uno.

## El ciclo, de punta a punta

Cada turno pasa por las mismas cuatro etapas: el VAD del cliente detecta que hablás, Whisper de Groq lo transcribe, un modelo de Gemini escribe la respuesta, y OpenAI convierte esa respuesta en audio que se transmite de vuelta al mismo cliente. Después se repite, con el micrófono silenciado hasta que termina la reproducción.

<figure>
<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama del ciclo de voz de cuatro etapas: el VAD del cliente detecta habla, Whisper de Groq lo transcribe, un modelo de Gemini escribe la respuesta, OpenAI la transmite como voz, y el ciclo se repite apenas termina la reproducción">
  <defs>
    <marker id="voicetutor-pipeline-arrow-es" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="400" y="18" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">se repite apenas termina la reproducción, mic silenciado hasta entonces</text>
  <path d="M 700 130 C 700 40, 100 40, 100 130" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#voicetutor-pipeline-arrow-es)" />
  <line x1="185" y1="175" x2="210" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#voicetutor-pipeline-arrow-es)" />
  <line x1="385" y1="175" x2="410" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#voicetutor-pipeline-arrow-es)" />
  <line x1="585" y1="175" x2="610" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#voicetutor-pipeline-arrow-es)" />
  <rect x="15" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="100" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">VAD del cliente</text>
  <text x="100" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">te escucha hablar</text>
  <rect x="215" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="300" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Groq STT</text>
  <text x="300" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">transcribe tu voz</text>
  <rect x="415" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="500" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Chat Gemini</text>
  <text x="500" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">escribe la respuesta</text>
  <rect x="615" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="700" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">OpenAI TTS</text>
  <text x="700" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">la transmite de vuelta</text>
</svg>
<figcaption>Cada turno pasa por las mismas cuatro etapas, y después se repite. El VAD del cliente detecta habla, Whisper de Groq la transcribe, Gemini escribe la respuesta, y OpenAI la convierte en audio que se transmite de vuelta al mismo cliente, cuyo micrófono queda silenciado hasta que ese audio termina.</figcaption>
</figure>

## Mantener la conexión abierta en vez de preguntar dos veces

Los servicios de STT y TTS detrás del tutor son dos backends chicos en Go, y ambos se acceden por WebSocket en vez de HTTP plano. Una conversación es una sucesión de intercambios cortos, uno detrás de otro. Pagar una conexión nueva por cada uno es un costo que una API de request/response no puede evitar.

El audio entra como PCM crudo por un socket que ya está abierto. Un mensaje `finalize` le dice al servicio de STT que le pase el audio buffereado a Whisper de Groq (`whisper-large-v3`) en una sola llamada.

El audio vuelve por el mismo camino. El servicio de TTS transmite el habla sintetizada desde `gpt-4o-mini-tts` de OpenAI apenas hay chunks disponibles, registrando el time-to-first-byte en cada request. El estudiante escucha la primera sílaba antes de que termine de generarse la última.

Un detalle más: el STT siempre corre con detección automática de idioma en vez de un locale fijo. Un estudiante que mezcla Spanglish o Denglish necesita una transcripción que no asuma que habla solo un idioma.

## Enseñarle al cliente cuándo dejar de escuchar

El streaming resuelve el transporte. La otra mitad es saber *cuándo* enviar audio: detección de actividad de voz (VAD), código que escucha la señal cruda del micrófono y decide si alguien está hablando en ese momento.

El tutor corre eso del lado del cliente con [`@ricky0123/vad-web`](https://www.npmjs.com/package/@ricky0123/vad-web), un modelo VAD (Silero) conectado a través de `MicVAD`:

```js
const vad = await window.vad.MicVAD.new({
  onSpeechStart: () => startSendingAudio(),
  onSpeechEnd: () => scheduleFinalize(),
});
vad.start();
```

Dos buffers chicos evitan que ese filtro corte palabras. Un pre-roll vuelca el audio reciente apenas se detecta habla, para que la primera palabra sobreviva. Un post-roll sigue enviando un rato después de que el habla termina, para que la última palabra también sobreviva. Un timeout de seguridad fuerza un finalize si el VAD llega a no detectar el final de una intervención.

## No dejar que el asistente hable sobre sí mismo

El verdadero modo de falla no es la latencia. Es que el asistente escuche su propia voz por el micrófono y la confunda con la siguiente frase del estudiante.

La solución es una bandera de estado. Mientras el asistente habla, el cliente queda en `assistantSpeaking`, y cada capa lo chequea. El VAD se niega a arrancar una grabación a mitad de oración. El audio worklet (nunca deja de capturar, solo no siempre envía) tira lo que acaba de capturar en vez de bufferearlo.

Ese es el "bloqueo duro" del diagrama: el micrófono no deja de escuchar, se silencia en el origen hasta que termina la reproducción.

## Lo que en verdad hizo falta para el "tiempo real"

Ningún truco único. Una decisión de transporte (quedarse en un socket en vez de ir y volver por HTTP), una decisión de detección (dejar que un VAD real decida dónde empieza y termina el habla), y una disciplina (saber siempre si el asistente está hablando, y actuar en consecuencia en todas partes). Piezas chicas. Juntas, son la diferencia entre un mensaje de voz y una conversación.
