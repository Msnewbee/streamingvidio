// Fungsi untuk mengambil data anime dari beberapa file JSON
export async function fetchAnimeList() {
    try {
        // Ambil data dari One_piece.json
        const response1 = await fetch('./Anime/One_piece.json');
        if (!response1.ok) throw new Error('Gagal mengambil data dari One_piece.json');
        const onePieceData = await response1.json();

        // Ambil data dari anime-list.json
        const response2 = await fetch('./Anime/anime-list.json');
        if (!response2.ok) throw new Error('Gagal mengambil data dari anime-list.json');
        const animeList = await response2.json();

        const response3 = await fetch('./Anime/bleach.json');
        if (!response3.ok) throw new Error('Gagal mengambil data dari anime-list.json');
        const bleachData = await response3.json();


        // Gabungkan data dari kedua file JSON
        return [...animeList, ...onePieceData, ...bleachData];
    } catch (error) {
        console.error('Error fetching anime list:', error);
        return [];
    }
}

// Fungsi untuk memuat detail anime
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

    updateAnimeDetails(anime);
    populateEpisodeList(anime);

    if (episodeParam) {
        const selectedEpisode = anime.episodes.find(ep => ep.episode == episodeParam);
        if (selectedEpisode) {
            playEpisode(selectedEpisode.url, selectedEpisode.episode, anime.id, selectedEpisode.mirrors || []);
        } else {
            alert('Episode tidak ditemukan!');
        }
    }
}

// Fungsi untuk memperbarui tampilan detail anime
function updateAnimeDetails(anime) {
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
}

// Fungsi untuk menampilkan daftar episode
function populateEpisodeList(anime) {
    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';

    if (anime.episodes.length === 0) {
        episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
        return;
    }

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

// Fungsi untuk navigasi episode (sebelum/sesudah)
function navigateEpisode(direction) {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    let currentEpisode = parseInt(urlParams.get('episode')) || 1;

    fetchAnimeList().then(animeList => {
        const anime = animeList.find(a => a.id == animeId);
        if (!anime) return;

        const episodeIndex = anime.episodes.findIndex(ep => ep.episode == currentEpisode);
        const newIndex = episodeIndex + direction;

        if (newIndex >= 0 && newIndex < anime.episodes.length) {
            const newEpisode = anime.episodes[newIndex];
            updateUrlWithEpisode(animeId, newEpisode.episode);
            playEpisode(newEpisode.url, newEpisode.episode, animeId, newEpisode.mirrors || []);
        }
    });
}

// Fungsi untuk memutar episode
function playEpisode(url, episode, animeId, mirrors = []) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');
    const switchButton = document.getElementById('switch-server');

    if (!iframePlayer) {
        console.error('Elemen #anime-embed tidak ditemukan');
        return;
    }

    // Update player source
    iframePlayer.src = url;
    
    // Update download link
    downloadLink.href = url;
    downloadLink.textContent = `Download Episode ${episode}`;
    downloadLink.download = `Episode_${episode}.mp4`;
    
    // Update URL
    updateUrlWithEpisode(animeId, episode);
    
    // Highlight current episode in list
    const episodeButtons = document.querySelectorAll('.episode-item');
    episodeButtons.forEach(btn => {
        if (parseInt(btn.dataset.episode) === episode) {
            btn.style.backgroundColor = '#007bff';
        } else {
            btn.style.backgroundColor = '#3a3a3a';
        }
    });
}

// Fungsi untuk memperbarui URL dengan episode terpilih
function updateUrlWithEpisode(animeId, episode) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('episode', episode);
    window.history.pushState(null, '', newUrl.toString());
}

// Event listener saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
    const prevEpisodeBtn = document.getElementById('prev-episode');
    const nextEpisodeBtn = document.getElementById('next-episode');

    if (prevEpisodeBtn) prevEpisodeBtn.addEventListener('click', () => navigateEpisode(-1));
    if (nextEpisodeBtn) nextEpisodeBtn.addEventListener('click', () => navigateEpisode(1));

    if (document.getElementById('anime-title')) {
        loadAnimeDetail();
    }
});
