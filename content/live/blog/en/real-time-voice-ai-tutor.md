## Why most voice AI feels like a phone menu

Build a voice AI assistant the straightforward way and this is what you get by default: **dead air** after you stop talking, then the reply starts, and if you try to jump in early, it either ignores you or you talk over each other.

That's **not a model problem**. It's **plumbing**: how audio moves from the mic to speech-to-text, through the model, out through text-to-speech, and back to the speaker, without every hop turning into a wait.

[uLearn's AI tutor](https://ultimatelearning.app/en/tour/tutor/session) lives or dies on that plumbing. It's a language-learning app built around **holding a spoken conversation**, not typing into a chat box. Feeling like a person, not a voice form, meant treating the transport layer as a **key design phase** from day one.

## The loop, start to finish

Every turn runs through the same four stages: the client's VAD hears speech, Groq's Whisper transcribes it, a Gemini model writes the reply, and OpenAI turns that reply into audio streamed back to the same client. Then it loops, mic muted until playback ends.

<figure>
<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of the four-stage voice loop: client VAD detects speech, Groq's Whisper transcribes it, a Gemini model writes the reply, OpenAI streams it back as speech, and the loop repeats once playback ends">
  <defs>
    <marker id="voicetutor-pipeline-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="400" y="18" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">loops back once playback ends, mic muted until then</text>
  <path d="M 700 130 C 700 40, 100 40, 100 130" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#voicetutor-pipeline-arrow)" />
  <line x1="185" y1="175" x2="210" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#voicetutor-pipeline-arrow)" />
  <line x1="385" y1="175" x2="410" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#voicetutor-pipeline-arrow)" />
  <line x1="585" y1="175" x2="610" y2="175" stroke="currentColor" stroke-width="1.5" marker-end="url(#voicetutor-pipeline-arrow)" />
  <rect x="15" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="100" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Client VAD</text>
  <text x="100" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">hears you speak</text>
  <rect x="215" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="300" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Groq STT</text>
  <text x="300" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">transcribes your voice</text>
  <rect x="415" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="500" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Gemini chat</text>
  <text x="500" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">writes the reply</text>
  <rect x="615" y="130" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="700" y="168" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">OpenAI TTS</text>
  <text x="700" y="196" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">streams it back</text>
</svg>
<figcaption>Every turn runs through the same four stages, then loops. The client's VAD hears speech, Groq's Whisper transcribes it, Gemini writes the reply, and OpenAI turns it into audio streamed back to the same client, whose mic stays muted until that audio finishes.</figcaption>
</figure>

## Keeping the connection open instead of asking twice

The STT and TTS services behind the tutor are small Go backends, both reachable over WebSocket instead of plain HTTP. A conversation is a stream of short exchanges back to back. Paying for a new connection on every one of them is overhead a request/response API can't avoid.

Audio goes in as raw PCM over an already-open socket. A `finalize` message tells the STT service to hand the buffered audio to Groq's Whisper (`whisper-large-v3`) in one call.

Audio comes back the same way. The TTS service streams synthesized speech from OpenAI's `gpt-4o-mini-tts` as soon as chunks exist, logging time-to-first-byte on every request. The learner hears the first syllable before the last one has even been generated.

One more detail: STT always runs with automatic language detection instead of a fixed locale. A learner mixing Spanglish or Denglish needs a transcript that doesn't assume they're speaking only one language.

## Teaching the client when to stop listening

Streaming solves transport. The other half is knowing *when* to send audio at all: voice activity detection (VAD), code that listens to the raw mic signal and decides whether someone is actually speaking into it right now.

The tutor runs that client-side with [`@ricky0123/vad-web`](https://www.npmjs.com/package/@ricky0123/vad-web), a Silero VAD model wired up through `MicVAD`:

```js
const vad = await window.vad.MicVAD.new({
  onSpeechStart: () => startSendingAudio(),
  onSpeechEnd: () => scheduleFinalize(),
});
vad.start();
```

Two small buffers keep that gate from clipping words. A pre-roll flushes recent audio the instant speech is detected, so the first word survives. A post-roll keeps sending briefly after speech ends, so the last word does too. A safety timeout forces a finalize if VAD ever misses the end of an utterance.

## Not letting the assistant talk over itself

The real failure mode isn't latency. It's the assistant hearing its own voice through the mic and mistaking it for the learner's next sentence.

The fix is a state flag. While the assistant talks, the client sits in `assistantSpeaking`, and every layer checks it. VAD refuses to start a new recording mid-sentence. The audio worklet (it never actually stops capturing, it just doesn't always send) throws away whatever it just captured instead of buffering it.

That's the "hard lock" in the diagram: the mic doesn't stop listening, it just gets muted at the source until playback ends.

## What "real-time" actually took

No single clever trick. A transport choice (stay on one socket instead of round-tripping HTTP), a detection choice (let real VAD decide where speech starts and ends), and a discipline (always know if the assistant is talking, and act on it everywhere). Small pieces. Together, they're the gap between a voicemail and a conversation.
