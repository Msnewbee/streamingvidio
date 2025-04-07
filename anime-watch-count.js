export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      if (request.method === "POST" && url.pathname === "/api/increase-watch") {
        const { animeId } = await request.json();
  
        if (!animeId) {
          return new Response("Missing animeId", { status: 400 });
        }
  
        const key = `watchCount_${animeId}`;
        const currentCount = parseInt(await env.MY_KV.get(key)) || 0;
        await env.MY_KV.put(key, currentCount + 1);
  
        return new Response(JSON.stringify({ success: true, newCount: currentCount + 1 }), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      if (request.method === "GET" && url.pathname.startsWith("/api/get-watch")) {
        const animeId = url.searchParams.get("id");
        const key = `watchCount_${animeId}`;
        const count = parseInt(await env.MY_KV.get(key)) || 0;
  
        return new Response(JSON.stringify({ count }), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response("Not found", { status: 404 });
    },
  };
  