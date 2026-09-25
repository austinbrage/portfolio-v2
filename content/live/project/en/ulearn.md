## A conversation, not a script

The AI tutor holds an actual back-and-forth conversation out loud. It reacts to what you say, corrects you in context, and builds a practice scenario on request instead of running through a fixed script.

That's a big enough engineering problem on its own that it got [its own write-up](/en/blog/real-time-voice-ai-tutor): keeping a WebSocket open instead of round-tripping HTTP, gating the mic with real voice-activity detection, and making sure the assistant never talks over itself.

## Read anything, turn it into review

Highlight a word or a phrase anywhere you're reading, including inside a YouTube transcript, and it becomes a flashcard on the spot: translation, grammar, and context already filled in. No manual data entry, no separate app for vocabulary. See it yourself in a [guided tour of reading and looking up a word](https://ultimatelearning.app/en/tour/learn/text).

<figure>
<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing the reading-to-review loop: you read something, tap a word, a flashcard gets created automatically, and it comes back later on a spaced-repetition schedule">
  <defs>
    <marker id="ulearn-loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="400" y="14" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">comes back on its own schedule</text>
  <path d="M 700 90 C 700 0, 100 0, 100 90" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ulearn-loop-arrow)" />
  <line x1="185" y1="135" x2="210" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-loop-arrow)" />
  <line x1="385" y1="135" x2="410" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-loop-arrow)" />
  <line x1="585" y1="135" x2="610" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-loop-arrow)" />
  <rect x="15" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="100" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">You read</text>
  <text x="100" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">text or video</text>
  <rect x="215" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="300" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Tap a word</text>
  <text x="300" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">or phrase</text>
  <rect x="415" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="500" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Card is made</text>
  <text x="500" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">grammar + translation</text>
  <rect x="615" y="90" width="170" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="700" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Reviewed later</text>
  <text x="700" y="156" text-anchor="middle" font-size="11" font-family="monospace" fill="currentColor" fill-opacity="0.75">spaced by how well you know it</text>
</svg>
<figcaption>Reading and reviewing feed each other. Nothing gets typed in by hand, and nothing gets reviewed on a fixed schedule.</figcaption>
</figure>

Review isn't a static deck either. Cards come back spaced by how well you already know each one, not the same order every time. Here's a [guided tour of the review page](https://ultimatelearning.app/en/tour/review) too.

## Four languages, on their own terms

Flashcards are tailored to each language's own grammar, not one template stretched across all four. Russian nouns get full declension tables, since Russian's case system is complex enough to warrant one. German nouns decline too, but simply enough that a dedicated table would be overkill, so its flashcards skip it. French leans on verb conjugation instead. See what that actually looks like a bit further down.

That's possible because each language has its own DynamoDB table, and DynamoDB is schemaless: a new field, like a grammar table a language didn't need before, can be added straight into production, no migration required.

## What it actually looks like

### A flashcard, filled in for you

Translation, meaning, real example sentences, and word frequency, generated from a single tap, not typed in by hand.

<figure>
<img src="/images/ulearn-flashcard-en.png" alt="uLearn flashcard detail for the French verb arriver, with translation, meaning, example sentences, and word frequency" style="width:100%; border-radius:1rem;" />
<figcaption>The flashcard for "arriver," created the moment it was tapped while reading.</figcaption>
</figure>

### The conjugation table it builds

French leans on verb conjugation, so that's what its flashcards get: every tense, generated straight from the verb.

<figure>
<img src="/images/ulearn-flashcard-table-en.png" alt="Conjugation table for the French verb arriver across présent, passé composé, imparfait, and futur simple" style="width:100%; border-radius:1rem;" />
<figcaption>Présent, passé composé, imparfait, futur simple: all four generated, none of them typed in.</figcaption>
</figure>

### Grouped by grammar, not by date

Collections organize flashcards by what they teach, like every French verb that takes être as its auxiliary, not by when they were added.

<figure>
<img src="/images/ulearn-collections-en.png" alt="uLearn collections view showing the Verbs with être French grammar collection" style="width:100%; border-radius:1rem;" />
<figcaption>The "Verbs with être" collection: one grammar rule, every word that follows it.</figcaption>
</figure>

## Built and run by one person

None of that runs on a single server. AWS for hosting and the database, Groq for speech-to-text, OpenAI for text-to-speech, Gemini for chat and text generation, Webshare as a proxy for the YouTube videos learners study from: five outside providers, and one person keeping all of them integrated and running.

<figure>
<svg viewBox="0 0 690 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing five outside providers feeding into nine independent services, all run by one developer">
  <defs>
    <marker id="ulearn-solo-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
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
  <text x="85" y="200" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">5 outside providers</text>
  <line x1="160" y1="97" x2="275" y2="97" stroke="currentColor" stroke-width="1.5" marker-end="url(#ulearn-solo-arrow)" />
  <rect x="290" y="25" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="340" y="25" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="390" y="25" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="290" y="75" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="340" y="75" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="390" y="75" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="290" y="125" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="340" y="125" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <rect x="390" y="125" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" />
  <text x="360" y="195" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">9 independent services</text>
  <text x="345" y="230" text-anchor="middle" font-size="12" font-style="italic" fill="currentColor" fill-opacity="0.75">run and kept online by one developer</text>
</svg>
<figcaption>Five providers, none of them mine to control, feeding nine small services instead of one shared backend, so a problem with one provider stays contained to a single service.</figcaption>
</figure>

The pattern that makes that manageable is a microservices architecture. Nine independent services, each owning one job, deployed on AWS ECS. Touching Gemini's chat generation means opening one specific repository, not a file buried inside a bigger project that touches a dozen other things, and a hiccup in one provider, say Groq's STT API going down, stays contained to that one service instead of taking the whole app with it.

## Where it runs

uLearn is live at [ultimatelearning.app](https://ultimatelearning.app), supporting German, English, Russian, and French, on Free, Pro, and Premium tiers. The web frontend is served through [HTML6](/en/projects/html6), the same template engine built at Eldøy Projects, now running a product of its own in production.
