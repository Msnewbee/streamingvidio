document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('prev-episode').addEventListener('click', () => navigateEpisode(-1));
    document.getElementById('next-episode').addEventListener('click', () => navigateEpisode(1));
});

function navigateEpisode(direction) {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    let currentEpisode = parseInt(urlParams.get('episode')) || 1;

    fetchAnimeList().then(animeList => {
        const anime = animeList.find(a => a.id == animeId);
        if (!anime) return;

        const episodeIndex = anime.episodes.findIndex(ep => ep.episode == currentEpisode);
        let newIndex = episodeIndex + direction;

        if (newIndex >= 0 && newIndex < anime.episodes.length) {
            const newEpisode = anime.episodes[newIndex];
            updateUrlWithEpisode(animeId, newEpisode.episode);
            playEpisode(newEpisode.url, newEpisode.episode, animeId, newEpisode.mirrors || []);
        }
    });
}

function playEpisode(url, episode, animeId, mirrors = []) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');

    if (!iframePlayer) {
        console.error('Elemen #anime-embed tidak ditemukan');
        return;
    }

    iframePlayer.src = url;
    downloadLink.href = url;
    downloadLink.textContent = `Download Episode ${episode}`;
}

export async function fetchAnimeList() {
    try {
        const response = await fetch('./anime-list.json');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);
        return [];
    }
}

export async function loadAnimeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    const episodeParam = urlParams.get('episode');

    const animeList = await fetchAnimeList();
    const anime = animeList.find(a => a.id == animeId);

    if (!anime) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('anime-title').textContent = anime.title;
    document.getElementById('anime-jtitle').textContent = anime.japanese_title;
    document.getElementById('anime-score').textContent = anime.score;
    document.getElementById('anime-producers').textContent = anime.producers;
    document.getElementById('anime-studio').textContent = anime.studio;
    document.getElementById('anime-type').textContent = anime.type;
    document.getElementById('anime-status').textContent = anime.status;
    document.getElementById('anime-duration').textContent = anime.duration;
    document.getElementById('anime-release').textContent = anime.release_date;
    document.getElementById('anime-genre').textContent = anime.genre.join(', ');
    document.getElementById('anime-poster').src = anime.image ? `public/${anime.image}` : 'default-poster.jpg';

    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';

    if (anime.episodes.length === 0) {
        episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
    } else {
        anime.episodes.forEach((ep) => {
            const episodeButton = document.createElement('button');
            episodeButton.textContent = `Episode ${ep.episode}`;
            episodeButton.classList.add("episode-item");
            episodeButton.dataset.episode = ep.episode;

            episodeButton.addEventListener('click', (event) => {
                event.preventDefault();
                playEpisode(ep.url, ep.episode, anime.id, ep.mirrors || []);
                updateUrlWithEpisode(anime.id, ep.episode);
            });

            episodeList.appendChild(episodeButton);
        });
    }

    if (episodeParam) {
        const selectedEpisode = anime.episodes.find(ep => ep.episode == episodeParam);
        if (selectedEpisode) {
            playEpisode(selectedEpisode.url, selectedEpisode.episode, anime.id, selectedEpisode.mirrors || []);
        } else {
            alert('Episode tidak ditemukan!');
        }
    }
}

function updateUrlWithEpisode(animeId, episode) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('episode', episode);
    window.history.pushState(null, '', newUrl.toString());
}

if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}
