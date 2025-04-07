let cachedAnimeList = null;

// Ambil data anime dari Cloudflare Worker
export async function fetchAnimeList() {
    if (cachedAnimeList) return cachedAnimeList;

    try {
        const res = await fetch("https://streamingvidio.pages.dev/anime-cache"); // Ganti sesuai domain kamu
        if (!res.ok) throw new Error("Gagal mengambil data dari worker");

        const data = await res.json();
        cachedAnimeList = data;
        return data;

    } catch (error) {
        console.error("Error fetching anime list from worker:", error);
        return [];
    }
}

// Fungsi render daftar anime ke dalam halaman
function renderAnimeList(animeList) {
    const container = document.getElementById("anime-list");
    if (!container) return;

    container.innerHTML = "";
    animeList.forEach(anime => {
        const card = document.createElement("div");
        card.className = "anime-card";

        // Sesuaikan path gambar jika perlu
        const thumbnailUrl = `https://streamingvidio.pages.dev/Public/${anime.image}`;

        card.innerHTML = `
            <a href="anime.html?folder=${anime.folder}">
                <img src="${thumbnailUrl}" alt="${anime.title}" class="anime-thumb" />
                <h3 class="anime-title">${anime.title}</h3>
            </a>
        `;
        container.appendChild(card);
    });
}

// Panggil saat halaman selesai dimuat
window.addEventListener("DOMContentLoaded", async () => {
    const animeList = await fetchAnimeList();
    renderAnimeList(animeList);
});



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
        const selectedEpisode = anime.episodes.find(ep => parseInt(ep.episode) === parseInt(episodeParam));
        if (selectedEpisode) {
            playEpisode(anime, selectedEpisode.url, selectedEpisode.episode, selectedEpisode.mirrors || []);
        } else {
            alert('Episode tidak ditemukan!');
        }
    }
}

// Fungsi untuk memperbarui tampilan detail anime
function updateAnimeDetails(anime) {
    document.getElementById('anime-title').textContent = anime.title || '-';
    document.getElementById('anime-jtitle').textContent = anime.japanese_title || '-';
    document.getElementById('anime-score').textContent = anime.score ?? '-';
    document.getElementById('anime-producers').textContent = anime.producers || '-';
    document.getElementById('anime-studio').textContent = anime.studio || '-';
    document.getElementById('anime-type').textContent = anime.type || '-';
    document.getElementById('anime-status').textContent = anime.status || '-';
    document.getElementById('anime-duration').textContent = anime.duration || '-';
    document.getElementById('anime-release').textContent = anime.release_date || '-';
    document.getElementById('anime-genre').textContent = Array.isArray(anime.genre) ? anime.genre.join(', ') : '-';
    document.getElementById('anime-synopsis').textContent = anime.synopsis || '-';
    document.getElementById('anime-poster').src = anime.image ? `public/${anime.image}` : 'default-poster.jpg';

    const trailerFrame = document.getElementById('anime-trailer');
    if (trailerFrame) trailerFrame.src = anime.trailer_url || '';
}

// Fungsi untuk menampilkan daftar episode
function populateEpisodeList(anime) {
    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';

    if (!anime.episodes || anime.episodes.length === 0) {
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
            playEpisode(anime, ep.url, ep.episode, ep.mirrors || []);
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

        const episodeIndex = anime.episodes.findIndex(ep => parseInt(ep.episode) === currentEpisode);
        const newIndex = episodeIndex + direction;

        if (newIndex >= 0 && newIndex < anime.episodes.length) {
            const newEpisode = anime.episodes[newIndex];
            updateUrlWithEpisode(animeId, newEpisode.episode);
            playEpisode(anime, newEpisode.url, newEpisode.episode, newEpisode.mirrors || []);
        }
    });
}

// Fungsi untuk memutar episode
function playEpisode(anime, url, episode, mirrors = []) {
    const iframePlayer = document.getElementById('anime-embed');
    if (!iframePlayer) {
        console.error('Elemen #anime-embed tidak ditemukan');
        return;
    }

    iframePlayer.src = url;
    updateUrlWithEpisode(anime.id, episode);

    const episodeButtons = document.querySelectorAll('.episode-item');
    episodeButtons.forEach(btn => {
        if (parseInt(btn.dataset.episode) === parseInt(episode)) {
            btn.classList.add('active-episode');
        } else {
            btn.classList.remove('active-episode');
        }
    });

    // Prefetch episode selanjutnya
    preloadNextEpisode(anime, episode);
}

// Prefetch episode berikutnya
function preloadNextEpisode(anime, currentEpisode) {
    const nextIndex = anime.episodes.findIndex(ep => parseInt(ep.episode) === parseInt(currentEpisode)) + 1;
    const nextEp = anime.episodes[nextIndex];
    if (nextEp && nextEp.url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = nextEp.url;
        document.head.appendChild(link);
    }
}

// Fungsi untuk memperbarui URL dengan episode terpilih
function updateUrlWithEpisode(animeId, episode) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('episode', episode);
    window.history.pushState(null, '', newUrl.toString());
}

// Saat tombol back/forward ditekan di browser
window.addEventListener('popstate', () => {
    loadAnimeDetail();
});

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


