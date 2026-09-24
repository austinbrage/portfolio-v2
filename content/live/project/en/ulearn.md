## Why six services instead of one

Language learning apps usually ship as a single backend: one server, one database, done. uLearn started that way too, and it didn't survive contact with the actual requirements.

The moment you add real-time voice conversation with an AI tutor, you have three genuinely different workloads living under one roof: a speech-to-text leg that needs to be fast, a text-to-speech leg that needs to be fast in a different way, and an LLM call in the middle that's slower than both. Bolting all three onto one service means the slowest one sets the pace for everything else — including the parts of the app that have nothing to do with voice at all, like generating a flashcard while reading.

So uLearn runs as six independent Go services — a content service for LLM-backed generation, speech-to-text, text-to-speech, a text generator, email, and the core API — plus a web frontend, all deployed on AWS (ECS, EC2, DynamoDB) and provisioned with Pulumi. I designed, built, and still operate every part of it solo.

## The hard part wasn't the LLM calls

The obvious assumption about an "AI language app" is that the hard engineering problem is prompting the model well. It isn't — or at least, it's not the *interesting* hard problem.

The actual hard problem is that German, Russian, French, and English don't share a grammar. German needs case and declension handling. Russian needs its own conjugation and declension logic, structurally different from German's. French verb tables don't map cleanly onto either. Asking a model "here's a word, give me its grammatical forms" and trusting whatever comes back is fine for a demo and unreliable for a product people are actually trying to learn from.

The content service handles each language's grammar with its own dedicated logic — conjugation and declension code per language, not one shared prompt trying to generalize across all of them. The LLM still does the generation itself (word info, flashcard content, translations, summaries), but what's asked, how the response is structured, and how it's validated is deterministic per language, not the model improvising grammar on the fly.

## Being precise about what's an "agent" and what isn't

It's tempting to call the content service an "AI agent" — that's the term everyone's using in 2026, and it would look good on paper. It wouldn't be accurate. There's no planning loop, no autonomous tool selection, no multi-step reasoning the model does on its own. It's a set of fixed-purpose LLM endpoints: generate a flashcard field, summarize a passage, translate a phrase, suggest a word, look up grammatical info. Structured, purposeful, useful — and a different thing from an agent in the sense the word actually means.

The one place "AI tutor" is the right word rather than a stretch is the voice conversation feature itself: a live back-and-forth where the model reacts to what a learner actually says, corrects in context, and can generate a custom practice scenario on request. That's closer to what people picture when they hear "AI tutor" — real-time, responsive, not a fixed script.

## Where it runs

uLearn is live at [ultimatelearning.app](https://ultimatelearning.app), with free, Pro, and Premium subscription tiers, supporting German, English, Russian, and French. The web frontend is served through [HTML6](/en/projects/html6) — the same server-side template engine I built at Eldøy Projects — so the engine that started as an internal tool at one company is now the thing rendering my own product in production, for real users, every day.
