export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      if (url.pathname === "/api/increase-watch" && request.method === "POST") {
        const { animeId } = await request.json();
        if (!animeId) return new Response("animeId diperlukan", { status: 400 });
  
        const count = await env.WATCH_KV.get(animeId);
        const newCount = parseInt(count || "0") + 1;
        await env.WATCH_KV.put(animeId, newCount.toString());
  
        return new Response(JSON.stringify({ animeId, count: newCount }), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      if (url.pathname === "/api/get-watch" && request.method === "GET") {
        const animeId = url.searchParams.get("id");
        if (!animeId) return new Response("id diperlukan", { status: 400 });
  
        const count = await env.WATCH_KV.get(animeId);
        return new Response(JSON.stringify({ animeId, count: parseInt(count || "0") }), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response("Not Found", { status: 404 });
    },
  };
  