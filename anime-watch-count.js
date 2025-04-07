export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    if (!id) {
      return new Response("Missing ID", {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const count = await env.MY_KV.get(`watch_count_${id}`) || "0";

    return new Response(JSON.stringify({ id, count }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
