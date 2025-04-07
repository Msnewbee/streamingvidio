// Express example, bisa juga pake Next.js API route
import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/api/get-watch', async (req, res) => {
  const id = req.query.id;
  const response = await fetch(`https://anime-watch-count.bilariko2.workers.dev/api/get-watch?id=${id}`);
  const data = await response.json();

  res.set('Access-Control-Allow-Origin', '*');
  res.json(data);
});

app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
