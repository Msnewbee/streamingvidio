// File: assets/related.js
import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Kita tahu ini halaman khusus untuk Attack on Titan
  // jadi langsung gunakan prefix folder:
  const prefix = 'attack_on_titan';
  const container = document.getElementById('related-list');

  let allAnime;
  try {
    allAnime = await fetchAnimeList();
  } catch (err) {
    container.innerHTML = `<p>Gagal memuat data: ${err.message}</p>`;
    return;
  }

  // Filter semua entri yang folder-nya mulai dengan prefix
  const related = allAnime.filter(a =>
    a.folder.toLowerCase().startsWith(prefix + '_')
  );

  if (related.length === 0) {
    container.innerHTML = '<p>Tidak ada serial serupa.</p>';
    return;
  }

  // Reset loading text
  container.innerHTML = '';

  // Buat card untuk setiap entri
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

    container.appendChild(card);
  });
});
