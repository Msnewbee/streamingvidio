export default {
    async fetch(request, env, ctx) {
      const CACHE_KEY = "animeListCache";
      const CACHE_TTL = 3600 * 1000; // 1 jam (ms)
      const now = Date.now();
  
      // Cek cache dari KV
      const cached = await env.MY_KV.get(CACHE_KEY, { type: "json" });
  
      if (cached && now - cached.timestamp < CACHE_TTL) {
        return new Response(JSON.stringify(cached.data), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // URL file JSON dari Cloudflare Pages (ganti sesuai domain kamu)
      const urls = [
        "https://streamingvidio.pages.dev/Anime/One_piece.json",
        "https://streamingvidio.pages.dev//Anime/anime-list.json",
        "https://streamingvidio.pages.dev/Anime/bleach.json"
      ];
  
      try {
        const fetchPromises = urls.map((url) => fetch(url).then(res => res.json()));
        const results = await Promise.all(fetchPromises);
  
        const combined = results.flat();
        const uniqueAnime = Array.from(new Map(combined.map(a => [a.id, a])).values());
  
        // Simpan ke KV
        await env.MY_KV.put(CACHE_KEY, JSON.stringify({
          data: uniqueAnime,
          timestamp: now
        }));
  
        return new Response(JSON.stringify(uniqueAnime), {
          headers: { "Content-Type": "application/json" },
        });
  
      } catch (error) {
        return new Response("Gagal mengambil data", { status: 500 });
      }
    }
  }