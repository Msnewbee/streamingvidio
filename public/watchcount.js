const watchCounts = new Map(); // Sementara, bisa diganti KV untuk persist

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // GET /api/get-watch?id=...
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

    // POST /api/increase-watch
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

    // ✅ Tambahan baru: POST /api/reset-watch
    if (request.method === 'POST' && pathname === '/api/reset-watch') {
      watchCounts.clear(); // Hapus semua data tonton
      return new Response(JSON.stringify({ message: 'All watch counts reset' }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    // 404 fallback
    return new Response('Not found', { status: 404 });
  },
};
