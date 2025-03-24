export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/watch/')) {
            return handleWatchCount(request, env);
        } else if (url.pathname.startsWith('/last-watched/')) {
            return handleLastWatched(request, env);
        }
        return new Response("Not Found", { status: 404 });
    }
};

async function handleWatchCount(request, env) {
    const animeId = request.url.split('/').pop();

    if (request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT watch_count FROM anime WHERE id = ?").bind(animeId).all();
        const watchCount = results.length ? results[0].watch_count : 0;
        return new Response(JSON.stringify({ count: watchCount }), { headers: { "Content-Type": "application/json" } });
    } else if (request.method === "POST") {
        await env.DB.prepare("UPDATE anime SET watch_count = watch_count + 1 WHERE id = ?").bind(animeId).run();
        return new Response("Updated", { status: 200 });
    }
    return new Response("Method Not Allowed", { status: 405 });
}

async function handleLastWatched(request, env) {
    const animeId = request.url.split('/').pop();

    if (request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT episode, url FROM last_watched WHERE anime_id = ?").bind(animeId).all();
        return new Response(JSON.stringify({ lastWatched: results.length ? results[0] : null }), { headers: { "Content-Type": "application/json" } });
    } else if (request.method === "POST") {
        const { episode, url } = await request.json();
        await env.DB.prepare("INSERT INTO last_watched (anime_id, episode, url) VALUES (?, ?, ?) ON CONFLICT(anime_id) DO UPDATE SET episode = excluded.episode, url = excluded.url")
            .bind(animeId, episode, url)
            .run();
        return new Response("Saved", { status: 200 });
    }
    return new Response("Method Not Allowed", { status: 405 });
}
