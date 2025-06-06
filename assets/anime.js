let _cache = null;

export async function fetchAnimeList() {
  if (_cache) return _cache;

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
      { path: './Anime/"Wind Breaker.json', label: '"Wind Breaker.json'},
      { path: './Anime/Kuroshitsuji.json', label: 'Kuroshitsuji.json'},
      { path: './Anime/The Beginning After the End.json', label: 'The Beginning After the End.json'},
      { path: './Anime/Sentai Daishikkaku.json', label: 'Sentai Daishikkaku.json'},
      { path: './Anime/Tokyo Ghoul.json', label: 'Tokyo Ghoul.json' },
      { path: './Anime/Attack on Titan.json', label: 'Attack on Titan.json' },
      { path: './Anime/Code Geass.json', label: 'Code Geass.json' },
      { path: './Anime/Doraemon.json', label: 'Doraemon.json' },
      { path: './Anime/Witch Watch.json', label: 'Witch Watch.json' },
      { path: './Anime/Kijin Gentoushou.json', label: 'Kijin Gentoushou.json' },
      { path: './Anime/Momentary Lily.json', label: 'Momentary Lily.json' },
      { path: './Anime/Our Last Crusade or the Rise of a New World.json', label: 'Our Last Crusade or the Rise of a New World.json' },
      { path: './Anime/Bye Bye, Earth.json', label: 'Bye Bye, Earth.json' },
      { path: './Anime/Teogonia.json', label: 'Teogonia.json' },
      { path: './Anime/Katainaka no Ossan, Kensei ni Naru.json', label: 'Katainaka no Ossan, Kensei ni Naru.json' },
      { path: './Anime/Yosuga no Sora.json', label: 'Yosuga no Sora.json' }

    ];

    // Promise.allSettled agar satu file gagal nggak crash semuanya
  const settled = await Promise.allSettled(
    urls.map(async ({ path, label }) => {
      const safePath = encodeURI(path);
      const res = await fetch(safePath);
      if (!res.ok) {
        const txt = await res.text();
        console.error(`Gagal ambil ${label}:`, txt);
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.headers.get('content-type')?.includes('application/json')) {
        console.error(`${label} bukan JSON.`);
        throw new SyntaxError('Bukan JSON');
      }
      const dataArray = await res.json();       // JSON adalah array
      // kita juga bisa simpan sumber file-nya kalau perlu:
      return dataArray.map(item => ({ ...item, source: label }));
    })
  );

  // kumpulkan semua yang fulfilled jadi satu array
  const arrays = settled
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  // flatten jadi satu array
  const combined = arrays.flat();

  // unik berdasarkan id
  const unique = Array.from(new Map(combined.map(a => [a.id, a])).values());

  _cache = unique;
  return unique;
}

function loadAd(domain, id, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return console.warn(`Container ${containerId} tidak ada`);
  const s = document.createElement('script');
  s.src = `https://${domain}/400/${id}`;
  container.appendChild(s);
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


loadAd('vemtoutcheeg.com', 9264100, 'counter-detail');
loadAd('vemtoutcheeg.com', 9264105, 'counter-detail');
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

