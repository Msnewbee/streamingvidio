function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://streamingvidio.pages.dev",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/get-watch") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response("Missing id", { status: 400 });
      }

      const count = await env.MY_KV.get(`watch_count_${id}`);
      const response = {
        id,
        watch_count: parseInt(count || "0"),
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // <- Tambahkan ini
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
