// Contoh untuk /api/watch-counts (GET)
export async function onRequestGet({ request, env }) {
    try {
        const { results } = await env.DB.prepare(
            "SELECT anime_id, count FROM watch_counts"
        ).all();
        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// Contoh untuk /api/watch-counts/:animeId (POST)
export async function onRequestPost({ request, params, env }) {
    const animeId = params.animeId;
    try {
        await env.DB.prepare(
            "INSERT INTO watch_counts (anime_id, count) VALUES (?, 1) ON CONFLICT(anime_id) DO UPDATE SET count = count + 1;"
        ).run(animeId);
        return new Response("Watch count updated", { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
