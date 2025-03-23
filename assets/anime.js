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

    // Update metadata on the page
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
            const episodeButton = document.createElement('button');
            episodeButton.textContent = `Episode ${ep.episode}`;
            episodeButton.classList.add("episode-item");

            episodeButton.addEventListener('click', (event) => {
                event.preventDefault();
                
                if (isTrustedURL(ep.url)) {
                    playEpisode(ep.url, ep.episode, anime.id);
                } else {
                    console.warn('URL episode tidak terpercaya:', ep.url);
                }
            });

            episodeList.appendChild(episodeButton);
        });
    }

    const lastWatched = JSON.parse(localStorage.getItem('lastWatched'));
    if (lastWatched && lastWatched.animeId === anime.id) {
        playEpisode(lastWatched.url, lastWatched.episode, anime.id);
    }
}

function playEpisode(url, episode, animeId) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');

    iframePlayer.src = url;
    downloadLink.href = url;
    downloadLink.textContent = `Download Episode ${episode}`;

    localStorage.setItem('lastWatched', JSON.stringify({
        animeId: animeId,
        episode: episode,
        url: url
    }));

    document.querySelectorAll('.episode-item').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.episode-item').forEach(e => {
        if (e.textContent.includes(`Episode ${episode}`)) {
            e.classList.add('active');
        }
    });
}

if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}

// Anime Search Feature (Fixes null error)
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
