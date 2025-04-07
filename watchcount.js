export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(true),
      });
    }

    if (request.method === "GET" && path === "/api/get-watch") {
      const id = url.searchParams.get("id");
      if (!id) {
        return jsonResponse({ error: "Missing id" }, 400);
      }

      try {
        const count = await env.MY_KV.get(id);
        return jsonResponse(Number(count || 0));
      } catch (e) {
        return jsonResponse({ error: "Failed to read KV" }, 500);
      }
    }

    if (request.method === "POST" && path === "/api/increase-watch") {
      try {
        const body = await request.json();
        const id = body.animeId;
        if (!id) {
          return jsonResponse({ error: "Missing animeId" }, 400);
        }

        const current = Number(await env.MY_KV.get(id)) || 0;
        await env.MY_KV.put(id, String(current + 1));

        return jsonResponse({ animeId: id, watchCount: current + 1 });
      } catch (e) {
        return jsonResponse({ error: "Invalid JSON or failed update" }, 400);
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders() });
  },
};

function corsHeaders(isPreflight = false) {
  const headers = {
    "Access-Control-Allow-Origin": "*", // bisa ganti jadi 'https://streamingvidio.pages.dev' jika mau lebih aman
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (isPreflight) {
    headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
  }
  return headers;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}
