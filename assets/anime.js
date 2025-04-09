// Fungsi untuk mengambil data anime dari beberapa file JSON
export async function fetchAnimeList() {
    try {
      const urls = [
        { path: './Anime/One_piece.json', label: 'One_piece.json' },
        { path: './Anime/anime-list.json', label: 'anime-list.json' },
        { path: './Anime/bleach.json', label: 'bleach.json' }
      ];
  
      const results = await Promise.all(urls.map(async ({ path, label }) => {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Gagal mengambil data dari ${label}`);
        return await res.json();
      }));
  
      // Gabungkan dan hilangkan duplikat berdasarkan ID
      const combined = results.flat();
      const uniqueAnime = Array.from(new Map(combined.map(a => [a.id, a])).values());
      return uniqueAnime;
    } catch (error) {
      console.error('Error fetching anime list:', error);
      return [];
    }
  }
  
  // Fungsi untuk memuat detail anime (dipakai di halaman detail, misalnya: anime.html)
  export async function loadAnimeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
  
    const animeList = await fetchAnimeList();
    const anime = animeList.find(a => a.id == animeId);
  
    if (!anime) {
      window.location.href = 'index.html';
      return;
    }
  
    updateAnimeDetails(anime);
    populateEpisodeList(anime);
  }
  
  // Fungsi untuk memperbarui tampilan detail anime (memeriksa apakah elemen ada terlebih dahulu)
  function updateAnimeDetails(anime) {
    const titleEl = document.getElementById('anime-title');
    if (titleEl) titleEl.textContent = anime.title || '-';
  
    const jtitleEl = document.getElementById('anime-jtitle');
    if (jtitleEl) jtitleEl.textContent = anime.japanese_title || '-';
  
    const scoreEl = document.getElementById('anime-score');
    if (scoreEl) scoreEl.textContent = anime.score ?? '-';
  
    const producersEl = document.getElementById('anime-producers');
    if (producersEl) producersEl.textContent = anime.producers || '-';
  
    const studioEl = document.getElementById('anime-studio');
    if (studioEl) studioEl.textContent = anime.studio || '-';
  
    const typeEl = document.getElementById('anime-type');
    if (typeEl) typeEl.textContent = anime.type || '-';
  
    const statusEl = document.getElementById('anime-status');
    if (statusEl) statusEl.textContent = anime.status || '-';
  
    const durationEl = document.getElementById('anime-duration');
    if (durationEl) durationEl.textContent = anime.duration || '-';
  
    const releaseEl = document.getElementById('anime-release');
    if (releaseEl) releaseEl.textContent = anime.release_date || '-';
  
    const genreEl = document.getElementById('anime-genre');
    if (genreEl) genreEl.textContent = Array.isArray(anime.genre) ? anime.genre.join(', ') : '-';
  
    const synopsisEl = document.getElementById('anime-synopsis');
    if (synopsisEl) synopsisEl.textContent = anime.synopsis || '-';
  
    const posterEl = document.getElementById('anime-poster');
    if (posterEl) posterEl.src = anime.image ? `public/${anime.image}` : 'default-poster.jpg';
  
    const trailerFrame = document.getElementById('anime-trailer');
    if (trailerFrame) {
      trailerFrame.src = anime.trailer_url || '';
    }
  }
  
  // Fungsi untuk menampilkan daftar episode (hanya dipakai pada halaman detail anime)
  function populateEpisodeList(anime) {
    const episodeList = document.getElementById('episode-list');
    if (!episodeList) return;
    episodeList.innerHTML = '';
  
    if (!anime.episodes || anime.episodes.length === 0) {
      episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
      return;
    }
  
    anime.episodes.forEach((ep) => {
      const episodeButton = document.createElement('a');
      episodeButton.textContent = `Episode ${ep.episode}`;
      episodeButton.classList.add("episode-item");
      episodeButton.href = `player.html?id=${anime.id}&episode=${ep.episode}`;
      episodeList.appendChild(episodeButton);
    });
  }
  
  // Event listener saat tombol back/forward ditekan di browser
  window.addEventListener('popstate', () => {
    loadAnimeDetail();
  });
  
  // Jika halaman detail anime (misalnya, anime.html) memiliki elemen tertentu, maka jalankan loadAnimeDetail
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('anime-synopsis')) {
      loadAnimeDetail();
    }
  });
  
  