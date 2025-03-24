export async function fetchAnimeList() {
    try {
        const response = await fetch('./anime-list.json');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);

        const episodeSection = document.getElementById('episode-list');
        if (episodeSection) {
            episodeSection.innerHTML = `<p style="color: red;">Gagal memuat daftar anime. Silakan coba lagi nanti.</p>`;
        }
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

    // Update metadata pada halaman
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

    const trustedDomains = ['mega.nz', 'filedon.co', 'acefile.co', 'Smoothpre.com', 'another-trusted.com'];

    function isTrustedURL(url) {
        try {
            const parsedURL = new URL(url);
            return trustedDomains.includes(parsedURL.hostname);
        } catch (e) {
            return false;
        }
    }

    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';

    if (anime.episodes.length === 0) {
        episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
    } else {
        anime.episodes.forEach((ep) => {
            const episodeContainer = document.createElement('div');
            episodeContainer.classList.add('episode-container');

            const episodeLabel = document.createElement('p');
            episodeLabel.textContent = `Episode ${ep.episode}:`;
            episodeContainer.appendChild(episodeLabel);

            const playButton = document.createElement('button');
            playButton.textContent = `Putar Episode ${ep.episode}`;
            playButton.classList.add("episode-button");

            playButton.addEventListener('click', (event) => {
                event.preventDefault();
                showServerOptions(ep.servers, ep.episode, anime.id);
            });

            episodeContainer.appendChild(playButton);
            episodeList.appendChild(episodeContainer);
        });
    }

    const lastWatched = JSON.parse(localStorage.getItem('lastWatched'));
    if (lastWatched && lastWatched.animeId === anime.id) {
        showServerOptions(lastWatched.servers, lastWatched.episode, anime.id, lastWatched.url);
    }
}

function showServerOptions(servers, episode, animeId, selectedURL = null) {
    const serverList = document.getElementById('server-list');
    serverList.innerHTML = ''; // Bersihkan server list

    servers.forEach(server => {
        const serverButton = document.createElement('button');
        serverButton.textContent = server.name;
        serverButton.classList.add("server-button");

        if (selectedURL === server.url) {
            serverButton.classList.add("active");
        }

        serverButton.addEventListener('click', (event) => {
            event.preventDefault();
            playEpisode(server.url, episode, animeId, servers);
        });

        serverList.appendChild(serverButton);
    });

    // Putar episode pertama saat tombol pertama diklik
    if (selectedURL === null && servers.length > 0) {
        playEpisode(servers[0].url, episode, animeId, servers);
    }
}

function playEpisode(url, episode, animeId, servers) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');

    iframePlayer.src = url;
    downloadLink.href = url;
    downloadLink.textContent = `Download Episode ${episode}`;

    localStorage.setItem('lastWatched', JSON.stringify({
        animeId: animeId,
        episode: episode,
        url: url,
        servers: servers
    }));

    document.querySelectorAll('.server-button').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.server-button').forEach(e => {
        if (e.textContent.includes(url)) {
            e.classList.add('active');
        }
    });
}

if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}

// Anime Search Feature
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const animeList = document.getElementById("anime-list");

    if (searchInput && animeList) {
        searchInput.addEventListener("input", function () {
            const searchText = searchInput.value.toLowerCase();
            const animeItems = animeList.getElementsByTagName("li");

            for (let item of animeItems) {
                const title = item.textContent.toLowerCase();
                item.style.display = title.includes(searchText) ? "block" : "none";
            }
        });
    }
});
