// File: assets/related.js
import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params      = new URLSearchParams(window.location.search);
  const animeId     = params.get('id');
  const listEl      = document.getElementById('related-list');
  const titleEl     = document.getElementById('page-title');

  if (!animeId) {
    listEl.innerHTML = '<p>ID anime tidak valid.</p>';
    return;
  }

  let allAnime;
  try {
    allAnime = await fetchAnimeList();
  } catch (e) {
    listEl.innerHTML = `<p>Error: ${e.message}</p>`;
    return;
  }

  const current = allAnime.find(a => String(a.id) === animeId);
  if (!current) {
    listEl.innerHTML = '<p>Anime tidak ditemukan.</p>';
    return;
  }

  // Set judul halaman
  titleEl.textContent = `Serial Serupa: ${current.title}`;

  // Sekarang filter **seluruh** anime yang __label sama
  const related = allAnime.filter(a =>
    a.__label === current.__label &&
    a.id !== current.id
  );

  if (related.length === 0) {
    listEl.innerHTML = '<p>Tidak ada serial serupa.</p>';
    return;
  }

  listEl.innerHTML = ''; // clear

  // Render sama persis style script.js
  related.forEach(anime => {
    const card = document.createElement('div');
    card.classList.add('anime-card');

    const type = (anime.type || 'TV').toUpperCase();
    let labelColor = '#3498db';
    if (type === 'OVA')   labelColor = '#e74c3c';
    if (type === 'MOVIE') labelColor = '#f1c40f';
    if (type === 'SPECIAL')labelColor = '#9b59b6';

    card.innerHTML = `
      <div class="image-container">
        <img
          src="${anime.image? `public/${anime.image}`:'default-poster.jpg'}"
          alt="${anime.title}" loading="lazy"
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
