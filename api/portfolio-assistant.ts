import { handlePortfolioAssistant } from '../server/portfolioAssistant'

// Vercel's Node runtime discovers this /api entry point. The browser only talks
// to this same-origin route; GEMINI_API_KEY is read inside the server handler.
export default { fetch: handlePortfolioAssistant }
