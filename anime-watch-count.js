function withCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "https://streamingvidio.pages.dev");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "https://streamingvidio.pages.dev",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    if (request.method === "GET") {
      const animeId = searchParams.get("id");
      if (!animeId) {
        return withCorsHeaders(new Response(JSON.stringify({ error: "Anime ID tidak ditemukan" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }));
      }

      const count = parseInt(await env.MY_KV.get(`watch:${animeId}`) || "0", 10);
      return withCorsHeaders(new Response(JSON.stringify({ count }), {
        headers: { "Content-Type": "application/json" },
      }));
    }

    if (request.method === "POST") {
      try {
        const body = await request.json();
        const animeId = body.animeId;

        if (!animeId) {
          return withCorsHeaders(new Response(JSON.stringify({ error: "animeId diperlukan" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }));
        }

        const key = `watch:${animeId}`;
        const currentCount = parseInt(await env.MY_KV.get(key) || "0", 10);
        const updatedCount = currentCount + 1;
        await env.MY_KV.put(key, String(updatedCount));

        return withCorsHeaders(new Response(JSON.stringify({ updatedCount }), {
          headers: { "Content-Type": "application/json" },
        }));
      } catch (err) {
        return withCorsHeaders(new Response(JSON.stringify({ error: "Request tidak valid" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }));
      }
    }

    return withCorsHeaders(new Response("Metode tidak didukung", { status: 405 }));
  },
};

