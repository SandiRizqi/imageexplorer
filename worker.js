

export default {
    async fetch(request, env) {
      try {
        const url = new URL(request.url)
        const response = await env.ASSETS.fetch(url.pathname + url.search, request)
        return response
      } catch (e) {
        return new Response(e.message || e.toString(), { status: 500 })
      }
    },
  }