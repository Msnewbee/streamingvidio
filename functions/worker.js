// Worker code example
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Watch count endpoints
    if (path.startsWith('/api/watch-counts')) {
      if (request.method === 'GET') {
        // Get all watch counts
        const { results } = await env.DB.prepare(
          "SELECT anime_id, count FROM watch_counts"
        ).all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (request.method === 'POST' && path.includes('/api/watch-counts/')) {
        // Increment watch count for specific anime
        const animeId = path.split('/').pop();
        await env.DB.prepare(
          "INSERT INTO watch_counts (anime_id, count) VALUES (?, 1) ON CONFLICT(anime_id) DO UPDATE SET count = count + 1"
        ).bind(animeId).run();
        return new Response(null, { status: 204 });
      }
    }
    
    // Last watched endpoints
    if (path.startsWith('/api/last-watched/')) {
      const animeId = path.split('/').pop();
      
      if (request.method === 'GET') {
        // Get last watched episode
        const result = await env.DB.prepare(
          "SELECT episode, url FROM last_watched WHERE anime_id = ?"
        ).bind(animeId).first();
        
        return new Response(JSON.stringify({
          lastWatched: result || null
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else if (request.method === 'POST') {
        // Save last watched episode
        const data = await request.json();
        await env.DB.prepare(
          "INSERT INTO last_watched (anime_id, episode, url) VALUES (?, ?, ?) ON CONFLICT(anime_id) DO UPDATE SET episode = ?, url = ?"
        ).bind(animeId, data.episode, data.url, data.episode, data.url).run();
        return new Response(null, { status: 204 });
      }
    }
    
    return new Response('Not found', { status: 404 });
  }
}
