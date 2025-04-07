export default {
  async fetch(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const json = JSON.stringify({ id, count: 123 });

    return new Response(json, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // <-- ini penting
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  }
}


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
