import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'
import { createPortfolioAssistantHandler } from './portfolioAssistant'

export function portfolioAssistantMiddleware(env: {
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
}) {
  const handler = createPortfolioAssistantHandler({ env: () => env })
  return async (request: IncomingMessage, response: ServerResponse, next: () => void) => {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
    if (url.pathname !== '/api/portfolio-assistant') return next()

    const controller = new AbortController()
    const abort = () => controller.abort()
    request.once('aborted', abort)
    response.once('close', abort)
    try {
      const headers = new Headers()
      for (const [name, value] of Object.entries(request.headers)) {
        if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value)
      }
      const init: RequestInit & { duplex: 'half' } = {
        method: request.method,
        headers,
        signal: controller.signal,
        duplex: 'half',
      }
      if (request.method !== 'GET' && request.method !== 'HEAD')
        init.body = Readable.toWeb(request) as ReadableStream<Uint8Array>
      const result = await handler(new Request(url, init))
      if (!response.destroyed) {
        response.statusCode = result.status
        result.headers.forEach((value, name) => response.setHeader(name, value))
        response.end(Buffer.from(await result.arrayBuffer()))
      }
    } catch {
      if (!response.destroyed && !response.headersSent) {
        response.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
        response.end(JSON.stringify({ error: 'assistant_unavailable' }))
      }
    } finally {
      request.removeListener('aborted', abort)
      response.removeListener('close', abort)
    }
  }
}
