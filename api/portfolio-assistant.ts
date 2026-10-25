import { handlePortfolioAssistant } from '../server/portfolioAssistant.js'

// Explicit .js extensions are required throughout this dependency chain because
// production loads emitted ES modules directly, without Vite's import resolver.
// Vercel's Node runtime discovers this /api entry point. The browser only talks
// to this same-origin route; GEMINI_API_KEY is read inside the server handler.
export default { fetch: handlePortfolioAssistant }
