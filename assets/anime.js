async function checkVideoAvailability(url) {
    try {
        let response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (e) {
        return false;
    }
}

function playEpisode(url, episode, animeId, mirrors = []) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');
    const videoContainer = document.getElementById('video-player');
    
    videoContainer.innerHTML = '<p>Loading video...</p>';

    checkVideoAvailability(url).then(isAvailable => {
        if (isAvailable) {
            iframePlayer.src = url;
            downloadLink.href = url;
            downloadLink.textContent = `Download Episode ${episode}`;
        } else if (mirrors.length > 0) {
            playEpisode(mirrors[0], episode, animeId, mirrors.slice(1));
        } else {
            videoContainer.innerHTML = '<p>Video tidak tersedia.</p>';
        }
    }).catch(() => {
        videoContainer.innerHTML = '<p>Video tidak bisa dimuat.</p>';
    });

    iframePlayer.onerror = function () {
        alert('Gagal memuat video. Coba sumber lain.');
    };

    document.querySelectorAll('.episode-item').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.episode-item').forEach(e => {
        if (e.dataset.episode == episode) {
            e.classList.add('active');
        }
    });
}

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

    const trustedDomains = ['mega.nz', 'filedon.co', 'acefile.co'];

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
            episodeButton.dataset.episode = ep.episode;

            episodeButton.addEventListener('click', (event) => {
                event.preventDefault();
                if (isTrustedURL(ep.url)) {
                    playEpisode(ep.url, ep.episode, anime.id, ep.mirrors || []);
                    updateUrlWithEpisode(anime.id, ep.episode);
                } else {
                    console.warn('URL episode tidak terpercaya:', ep.url);
                    alert('Sumber video ini tidak dipercaya!');
                }
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
