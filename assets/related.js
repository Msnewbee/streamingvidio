// File: assets/related.js
import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params  = new URLSearchParams(window.location.search);
  const animeId = params.get('id');
  const listEl  = document.getElementById('related-list');
  const titleEl = document.getElementById('page-title');

  if (!animeId) {
    listEl.innerHTML = '<p>ID anime tidak valid.</p>';
    return;
  }

  let allAnime;
  try {
    allAnime = await fetchAnimeList();
  } catch (err) {
    listEl.innerHTML = `<p>Gagal memuat data: ${err.message}</p>`;
    return;
  }

  // Temukan data anime yang sedang dibuka
  const current = allAnime.find(a => String(a.id) === animeId);
  if (!current) {
    listEl.innerHTML = '<p>Anime tidak ditemukan.</p>';
    return;
  }

  // Set judul halaman
  titleEl.textContent = `Serial Serupa: ${current.title}`;

  // Ambil basePrefix: 3 segmen pertama dari folder
  const parts = current.folder.split('_');
  const basePrefix = parts.length > 3
    ? parts.slice(0, 3).join('_')
    : parts.join('_');

  // Filter semua anime dengan folder yang diawali basePrefix
  const related = allAnime.filter(a =>
    a.id !== current.id &&
    a.folder.startsWith(basePrefix)
  );

  if (related.length === 0) {
    listEl.innerHTML = '<p>Tidak ada serial serupa dalam file ini.</p>';
    return;
  }

  // Clear loading text
  listEl.innerHTML = '';

  // Render setiap card (sama seperti di script.js)
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
