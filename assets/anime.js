export async function fetchAnimeList() {
    try {
        const response = await fetch('../anime-list.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);
        return [];
    }
}

export async function loadAnimeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    
    const animeList = await fetchAnimeList();
    const anime = animeList.find(a => a.id == animeId);
    
    if (!anime) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update metadata
    document.getElementById('anime-title').textContent = anime.title;
    document.getElementById('anime-jtitle').textContent = anime.japanese_title;
    document.getElementById('anime-score').textContent = anime.score;
    document.getElementById('anime-studio').textContent = anime.studio;
    document.getElementById('anime-type').textContent = anime.type;
    document.getElementById('anime-status').textContent = anime.status;
    document.getElementById('anime-duration').textContent = anime.duration;
    document.getElementById('anime-release').textContent = anime.release_date;
    document.getElementById('anime-genre').textContent = anime.genre.join(', ');
    document.getElementById('anime-poster').src = `public/${anime.image}`;
    
    // Load episodes
    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';
    
    anime.episodes.forEach(ep => {
        const episodeLink = document.createElement('a');
        episodeLink.href = "#";
        episodeLink.textContent = `Episode ${ep.episode}`;
        episodeLink.addEventListener('click', () => {
            document.getElementById('anime-embed').src = ep.url;
        });
        episodeList.appendChild(episodeLink);
    });
    
    // Load first episode by default
    if (anime.episodes.length > 0) {
        document.getElementById('anime-embed').src = anime.episodes[0].url;
    }
}

// Jalankan saat halaman anime.html dimuat
if (window.location.pathname.includes('anime.html')) {
    loadAnimeDetail();
}
