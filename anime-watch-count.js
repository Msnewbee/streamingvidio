function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or a specific domain
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }

  if (pathname.startsWith("/api/get-watch")) {
    const id = searchParams.get("id");
    const count = await WATCH_KV.get(`watch:${id}`) || "0";
    return new Response(JSON.stringify({ id, count: Number(count) }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  // Default fallback
  return new Response("Not found", { status: 404 });
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
