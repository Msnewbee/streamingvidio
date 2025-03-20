import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
    const animeList = await fetchAnimeList();
    const container = document.getElementById('anime-list');
    
    animeList.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <img src="public/${anime.image}" alt="${anime.title}">
            <h2>${anime.title}</h2>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `anime.html?id=${anime.id}`;
        });
        
        container.appendChild(card);
    });
});
