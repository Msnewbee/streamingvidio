// Fungsi untuk mengambil data anime dari beberapa file JSON
export async function fetchAnimeList() {
    try {
      const urls = [
        { path: './Anime/One_piece.json', label: 'One_piece.json' },
        { path: './Anime/bleach.json', label: 'bleach.json' },
        { path: './Anime/Sololeveling.json', label: 'Sololeveling.json' },
        { path: './Anime/kimetsunoyaiba.json', label: 'kimetsunoyaiba.json' },
        { path: './Anime/Hunter_x_Hunter.json', label: 'Hunter_x_Hunter.json' },
        { path: './Anime/Jujutsu_Kaisen.json', label: 'Jujutsu_Kaisen.json' },
        { path: './Anime/Dandadan.json', label: 'Dandadan.json' },
        { path: './Anime/Sakamoto_Days.json', label: 'Sakamoto_Days.json' },
        { path: './Anime/Chainsaw_Man.json', label: 'Chainsaw_Man.json' },
        { path: './Anime/Zenshu.json', label: 'Zenshu.json' },
        { path: './Anime/Oshi_no_Ko.json', label: 'Oshi_no_Ko.json' },
        { path: './Anime/Kaiju_No_8.json', label: 'Kaiju_No_8.json' },
        { path: './Anime/Tensei_Shitara_Slime_Datta_Ken.json', label: 'Tensei_Shitara_Slime_Datta_Ken.json' },
        { path: './Anime/Classroom_of_the_Elite.json', label: 'Classroom_of_the_Elite.json' },
        { path: './Anime/fuguushoku_kanteishi_ga_jitsu_wa_saikyou_datta.json', label: 'fuguushoku_kanteishi_ga_jitsu_wa_saikyou_datta.json' },
        { path: './Anime/Kusuriya_no_Hitorigoto.json', label: 'Kusuriya_no_Hitorigoto.json' },
        { path: './Anime/Fire_Force.json', label: 'Fire_Force.json' },
        { path: './Anime/my_deer_friend_nokotan.json', label: 'my_deer_friend_nokotan.json' },
        { path: './Anime/Dungeon_Meshi.json', label: 'Dungeon_Meshi.json' },
        { path: './Anime/Farmagia.json', label: 'Farmagia.json' },
        { path: './Anime/sousei_no_aquarion_myth_of_emotions.json', label: 'sousei_no_aquarion_myth_of_emotions.json' },
        { path: './Anime/Unnamed_Memory.json', label: 'Unnamed_Memory.json' },
        { path: './Anime/Ao_no_Exorcist.json', label: 'Ao_no_Exorcist.json' },
        { path: './Anime/Haite Kudasai, Takamine-san.json', label: 'Haite Kudasai, Takamine-san.json'},
        { path: './Anime/"Wind Breaker.json', label: '"Wind Breaker.json'}

      ];
  
      const results = await Promise.all(urls.map(async ({ path, label }) => {
        const res = await fetch(path);
        if (!res.ok) {
        const text = await res.text();
        console.error(`Gagal mengambil ${label}:`, text);
        throw new Error(`Gagal mengambil data dari ${label}`);
       }
       const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error(`Respons dari ${label} bukan JSON:\n`, text);
        throw new SyntaxError(`Respons dari ${label} bukan JSON`);
      }
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
  
  