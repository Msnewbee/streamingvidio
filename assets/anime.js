export async function fetchAnimeList() {
    try {
        const response = await fetch('./anime-list.json');
        if (!response.ok) throw new Error('Gagal mengambil data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);
        alert('Gagal mengambil daftar anime. Silakan coba lagi nanti.');
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
    document.getElementById('anime-poster').src = anime.image ? `public/${anime.image}` : 'default-poster.jpg';

    // Load episodes
    const episodeList = document.getElementById('episode-list');
    episodeList.textContent = '';

    if (anime.episodes.length === 0) {
        episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
    } else {
        anime.episodes.forEach(ep => {
            const episodeLink = document.createElement('a');
            episodeLink.href = "#";
            episodeLink.textContent = `Episode ${ep.episode}`;
            episodeLink.addEventListener('click', () => {
                document.getElementById('anime-embed').src = ep.url;
            });
            episodeList.appendChild(episodeLink);
        });
    }

    // Load first episode by default (hanya jika URL valid)
    if (anime.episodes.length > 0) {
        const trustedDomains = ['mega.nz', 'acefile.co', 'another-trusted.com']; // Ganti dengan domain terpercaya
        const url = new URL(anime.episodes[0].url);
        
        if (trustedDomains.includes(url.hostname)) {
            document.getElementById('anime-embed').src = anime.episodes[0].url;
        } else {
            console.warn('URL tidak terpercaya:', anime.episodes[0].url);
        }
    }
}

// Jalankan hanya jika elemen anime-title ada (lebih aman dari path checking)
if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}
