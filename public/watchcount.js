export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === 'GET' && pathname === '/api/get-watch') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
      }

      const count = await env.WATCH_COUNTS.get(id);
      return new Response(JSON.stringify(parseInt(count) || 0), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    if (request.method === 'POST' && pathname === '/api/increase-watch') {
      try {
        const body = await request.json();
        const id = body.animeId;

        if (!id) {
          return new Response(JSON.stringify({ error: 'Missing animeId' }), { status: 400 });
        }

        const current = parseInt(await env.WATCH_COUNTS.get(id)) || 0;
        const newCount = current + 1;
        await env.WATCH_COUNTS.put(id, newCount.toString());

        return new Response(JSON.stringify({ animeId: id, watchCount: newCount }), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
      }
    }

    // Opsional: reset semua
    if (request.method === 'POST' && pathname === '/api/reset-watch') {
      // KV tidak bisa langsung clear semua key, harus pakai list + delete
      return new Response(JSON.stringify({ message: 'Manual clear required in dashboard' }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};