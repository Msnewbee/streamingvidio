const watchCounts = new Map(); // Sementara, bisa ganti ke KV storage kalau butuh persist

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === 'GET' && pathname === '/api/get-watch') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'Missing id' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const count = watchCounts.get(id) || 0;
      return new Response(JSON.stringify(count), {
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
          return new Response(JSON.stringify({ error: 'Missing animeId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const current = watchCounts.get(id) || 0;
        watchCounts.set(id, current + 1);

        return new Response(JSON.stringify({ animeId: id, watchCount: current + 1 }), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON or request error' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};