import express from 'express';
import fetch from 'node-fetch'; // pastikan ini terinstall: npm install node-fetch

const app = express();
const PORT = 3000;

// Allow JSON body parsing (kalau nanti mau POST juga)
app.use(express.json());

// Konstanta URL Worker terbaru
const BASE_API_URL = 'https://lingering-union-0acf.bilariko2.workers.dev/api';

// Endpoint untuk get watch count
app.get('/api/get-watch', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  try {
    const response = await fetch(`${BASE_API_URL}/get-watch?id=${id}`);
    const data = await response.json();

    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error('Error fetching watch count:', error);
    res.status(500).json({ error: 'Failed to fetch data from Worker' });
  }
});

// Endpoint untuk increase watch count (POST)
app.post('/api/increase-watch', async (req, res) => {
  const { animeId } = req.body;

  if (!animeId) {
    return res.status(400).json({ error: 'Missing animeId in request body' });
  }

  try {
    const response = await fetch(`${BASE_API_URL}/increase-watch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animeId }),
    });

    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (error) {
    console.error('Error increasing watch count:', error);
    res.status(500).json({ error: 'Failed to update watch count' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

