# Vandan’s portfolio

A React + TypeScript portfolio inspired by Robinhood’s classic web dashboard and iOS app. The timeline is an illustrative career chronology, not investment performance.

## Develop

```sh
npm ci
npm run dev
npm run build
npm run lint
npm test
```

The chart uses native SVG and timestamps, with seeded decorative stock-style movement that stays consistent across views. Dates, labels, and card targets live in `src/data/timeline.ts`; projects, experience, education, and skills live in `src/data/portfolioData.ts`. Public profile, contact links, and resume paths live in `src/data/profile.ts`.

## Search and assistant

Typing filters published experience, projects, and skills. Multiple terms require all terms unless the query explicitly uses “or”; unknown modifiers are preserved. Submitted answers and result links use the same ranked matches. Browsing another section clears the Home search, and newer queries cancel earlier requests.

Typing, submitting, and receiving an answer share one Search panel and the same matching entry links. Keyword searches return local results immediately. Questions can use Gemini through `POST /api/portfolio-assistant`; if credentials are missing or the provider fails, the published portfolio fallback uses the same interface without provider-status banners. Requests show a small progress indicator after 180ms, expanding into a center-out dot wave after one second. Both stop when the answer arrives, without an artificial minimum delay, and respect reduced motion. Model responses supply prose only; trusted links and result navigation remain local.

To enable live answers, set `GEMINI_API_KEY` in `.env.local` for development and in the Vercel server environment for deployment, then restart/redeploy. `GEMINI_MODEL` is optional (default: `gemini-3.5-flash-lite`); choose a model available to the provider account. The Vite dev/preview middleware and Vercel `/api` function share the same handler. Only the public site records enter its context. The browser never reads the key; do not use a `VITE_`-prefixed provider secret.

API/client tests mock the provider. Live credentials and provider access still require an end-to-end check once configured.

## Content maintenance

Experience/project copy remains the existing published version, pending the owner’s content pass. The supplied resume drafts have not been copied into the site.

Replace the downloadable PDFs in `public/resumes/` with public-safe versions before publishing a resume update. The current links point to `Vandan_Patel_CS.pdf` and `Vandan_Patel_Finance.pdf`; omit personal phone numbers and home addresses from replacement PDFs. An APM download can be added when its public-safe PDF is ready.

No deployment is performed by local development or build commands.
