// workers.js atau serverless function Anda
export default {
  async fetch(request, env) {
    if (request.method === 'POST' && request.url.endsWith('/api/d1')) {
      try {
        const { sql, params } = await request.json();
        const stmt = env.DB.prepare(sql);
        
        if (params && params.length > 0) {
          stmt.bind(...params);
        }
        
        const result = await stmt.all();
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new Response('Not found', { status: 404 });
  },
};
