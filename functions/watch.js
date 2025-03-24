export async function onRequestPost({ params, env }) {
    const animeId = params.id;
    const currentCount = await env.WATCH_COUNT_KV.get(animeId) || 0;
    await env.WATCH_COUNT_KV.put(animeId, parseInt(currentCount) + 1);
    return new Response(JSON.stringify({ success: true, count: parseInt(currentCount) + 1 }), {
        headers: { "Content-Type": "application/json" }
    });
}

export async function onRequestGet({ params, env }) {
    const animeId = params.id;
    const count = await env.WATCH_COUNT_KV.get(animeId) || 0;
    return new Response(JSON.stringify({ count: parseInt(count) }), {
        headers: { "Content-Type": "application/json" }
    });
}
