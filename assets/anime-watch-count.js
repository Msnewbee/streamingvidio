export default {
    async fetch(request, env) {
      const { method } = request;
      const url = new URL(request.url);
  
      if (url.pathname === "/api/watch-count") {
        const animeId = url.searchParams.get("id");
  
        if (!animeId) {
          return new Response("Missing anime ID", { status: 400 });
        }
  
        const key = `watchCount:${animeId}`;
  
        if (method === "POST") {
          // Tambah 1 ke count
          const current = parseInt(await env.ANIME_KV.get(key)) || 0;
          await env.ANIME_KV.put(key, (current + 1).toString());
          return new Response(JSON.stringify({ id: animeId, count: current + 1 }), {
            headers: { "Content-Type": "application/json" }
          });
        }
  
        if (method === "GET") {
          const count = parseInt(await env.ANIME_KV.get(key)) || 0;
          return new Response(JSON.stringify({ id: animeId, count }), {
            headers: { "Content-Type": "application/json" }
          });
        }
  
        return new Response("Method Not Allowed", { status: 405 });
      }
  
      return new Response("Not Found", { status: 404 });
    }
  }
  