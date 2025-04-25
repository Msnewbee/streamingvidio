// File: assets/related.js
import { fetchAnimeList } from './anime.js';

// Daftar path file anime individual
const animeFiles = [
  { path: './Anime/One_piece.json' },
  { path: './Anime/bleach.json' },
  { path: './Anime/Sololeveling.json' },
  { path: './Anime/kimetsunoyaiba.json' },
  { path: './Anime/Hunter_x_Hunter.json' },
  { path: './Anime/Jujutsu_Kaisen.json' },
  { path: './Anime/Dandadan.json' },
  { path: './Anime/Sakamoto_Days.json' },
  { path: './Anime/Chainsaw_Man.json' },
  { path: './Anime/Zenshu.json' },
  { path: './Anime/Oshi_no_Ko.json' },
  { path: './Anime/Kaiju_No_8.json' },
  { path: './Anime/Tensei_Shitara_Slime_Datta_Ken.json' },
  { path: './Anime/Classroom_of_the_Elite.json' },
  { path: './Anime/fuguushoku_kanteishi_ga_jitsu_wa_saikyou_datta.json' },
  { path: './Anime/Kusuriya_no_Hitorigoto.json' },
  { path: './Anime/Fire_Force.json' },
  { path: './Anime/my_deer_friend_nokotan.json' },
  { path: './Anime/Dungeon_Meshi.json' },
  { path: './Anime/Farmagia.json' },
  { path: './Anime/sousei_no_aquarion_myth_of_emotions.json' },
  { path: './Anime/Unnamed_Memory.json' },
  { path: './Anime/Ao_no_Exorcist.json' },
  { path: './Anime/Haite Kudasai, Takamine-san.json' },
  { path: './Anime/"Wind Breaker.json' },
  { path: './Anime/Kuroshitsuji.json' },
  { path: './Anime/The Beginning After the End.json' },
  { path: './Anime/Sentai Daishikkaku.json' },
  { path: './Anime/Tokyo Ghoul.json' },
  { path: './Anime/Attack on Titan.json' }
];

document.addEventListener('DOMContentLoaded', async () => {
  const listEl  = document.getElementById('related-list');
  const titleEl = document.getElementById('page-title');

  let allAnime = [];

  try {
    const results = await Promise.all(
      animeFiles.map(file => fetch(file.path).then(res => res.json()))
    );
    results.forEach((animeList, index) => {
      const folder = animeFiles[index].path.replace('./Anime/', '').replace('.json', '');
      animeList.forEach(anime => {
        anime.folder = folder;
        allAnime.push(anime);
      });
    });
  } catch (err) {
    listEl.innerHTML = `<p>Gagal memuat data: ${err.message}</p>`;
    return;
  }

  // Ambil nama folder dari query string ?folder=xxx
  const params  = new URLSearchParams(window.location.search);
  const folderParam = params.get('folder');
  if (!folderParam) {
    listEl.innerHTML = '<p>Parameter folder tidak ditemukan.</p>';
    return;
  }

  const related = allAnime.filter(a => a.folder === folderParam);

  if (related.length === 0) {
    listEl.innerHTML = '<p>Tidak ada anime dalam folder ini.</p>';
    return;
  }

  titleEl.textContent = `Anime di folder: ${folderParam}`;
  listEl.innerHTML = '';

  related.forEach(anime => {
    const card = document.createElement('div');
    card.classList.add('anime-card');

    const type = (anime.type || 'TV').toUpperCase();
    let labelColor = '#3498db';
    if (type === 'OVA')   labelColor = '#e74c3c';
    if (type === 'MOVIE') labelColor = '#f1c40f';
    if (type === 'SPECIAL') labelColor = '#9b59b6';

    card.innerHTML = `
      <div class="image-container">
        <img
          src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}"
          alt="${anime.title}"
          loading="lazy"
        />
        <div class="type-label" style="background-color:${labelColor}">
          ${type}
        </div>
      </div>
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Total Episode: ${anime.total_episodes}</p>
        <p>Tanggal Rilis: ${anime.release_date}</p>
        <p>Genre: ${anime.genre.join(', ')}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `anime.html?id=${anime.id}`;
    });

    listEl.appendChild(card);
  });
});
