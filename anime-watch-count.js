// Helper untuk menambahkan CORS
function withCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "https://streamingvidio.pages.dev");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
}


export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);
    const animeId = searchParams.get("id");

    // Preflight request handler (untuk OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "https://streamingvidio.pages.dev",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        }
      });
    }

    if (!animeId) {
      return withCorsHeaders(new Response("Anime ID tidak ditemukan", { status: 400 }));
    }

    const count = await env.MY_KV.get(`watch:${animeId}`) || "0";

    return withCorsHeaders(new Response(JSON.stringify({ count }), {
      headers: { "Content-Type": "application/json" }
    }));
  }
};
