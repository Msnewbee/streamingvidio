// File: assets/related.js
import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params          = new URLSearchParams(window.location.search);
  const animeId         = params.get('id');
  const relatedListEl   = document.getElementById('related-list');

  if (!animeId) {
    relatedListEl.innerHTML = '<p>ID anime tidak valid.</p>';
    return;
  }

  let animeData = [];
  try {
    animeData = await fetchAnimeList();
  } catch {
    relatedListEl.innerHTML = '<p>Gagal memuat data.</p>';
    return;
  }

  const current = animeData.find(a => String(a.id) === animeId);
  if (!current) {
    relatedListEl.innerHTML = '<p>Anime tidak ditemukan.</p>';
    return;
  }

  // Ambil prefix folder (misal 'shingeki_no_kyojin') untuk franchise
  const prefix = current.folder.split('_').slice(0, 3).join('_');
  const related = animeData.filter(a =>
    a.id !== current.id &&
    a.folder.startsWith(prefix + '_')
  );

  if (related.length === 0) {
    relatedListEl.innerHTML = '<p>Tidak ada serial serupa.</p>';
    return;
  }

  // Reset container
  relatedListEl.innerHTML = '';

  // Buat card ala script.js
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
        <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}"
             alt="${anime.title}" loading="lazy" />
        <div class="type-label" style="background-color:${labelColor}">${type}</div>
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

    relatedListEl.appendChild(card);
  });
});

