// File: assets/related.js
import { fetchAnimeList } from './anime.js';
document.addEventListener('DOMContentLoaded', async () => {
    const params    = new URLSearchParams(window.location.search);
    const animeId   = params.get('id');
    const listEl    = document.getElementById('related-list');
    const titleEl   = document.getElementById('page-title');
  
    if (!animeId) {
      return listEl.innerHTML = '<p>ID anime tidak valid.</p>';
    }
  
    // Temukan file JSON yang memuat current.id
    const fileArray = await loadFileArrayById(animeId);
    if (!fileArray) {
      return listEl.innerHTML = '<p>Tidak ditemukan data serial serupa.</p>';
    }
  
    // Ubah judul
    const current = fileArray.find(a => String(a.id) === animeId);
    titleEl.textContent = `Serial Serupa: ${current.title}`;
  
    // Buat list semua entry kecuali current sendiri
    const related = fileArray.filter(a => String(a.id) !== animeId);
    if (related.length === 0) {
      return listEl.innerHTML = '<p>Tidak ada serial serupa dalam file ini.</p>';
    }
  
    // Render card persis style di script.js
    listEl.innerHTML = '';
    related.forEach(anime => {
      const card = document.createElement('div');
      card.classList.add('anime-card');
  
      const type = (anime.type || 'TV').toUpperCase();
      let color = '#3498db';
      if (type === 'OVA')   color = '#e74c3c';
      if (type === 'MOVIE') color = '#f1c40f';
      if (type === 'SPECIAL') color = '#9b59b6';
  
      card.innerHTML = `
        <div class="image-container">
          <img src="${anime.image? `public/${anime.image}`:'default-poster.jpg'}"
               alt="${anime.title}" loading="lazy"/>
          <div class="type-label" style="background-color:${color}">${type}</div>
        </div>
        <div class="card-content">
          <h3>${anime.title}</h3>
          <p>Total Episode: ${anime.total_episodes}</p>
          <p>Rilis: ${anime.release_date}</p>
          <p>Genre: ${anime.genre.join(', ')}</p>
        </div>
      `;
  
      card.addEventListener('click', () => {
        window.location.href = `anime.html?id=${anime.id}`;
      });
  
      listEl.appendChild(card);
    });
  });