export default {
    async fetch(request, env) {
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
  
        const count = await env.MY_KV.get(id);
        return new Response(JSON.stringify(parseInt(count || "0")), {
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
  
          const current = parseInt((await env.MY_KV.get(id)) || "0");
          const newCount = current + 1;
  
          await env.MY_KV.put(id, newCount.toString());
  
          return new Response(JSON.stringify({ animeId: id, watchCount: newCount }), {
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
  