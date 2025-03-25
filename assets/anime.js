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

    // Update metadata anime di halaman
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

    // Daftar domain yang diizinkan untuk memutar video
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
            episodeButton.dataset.episode = ep.episode; // Simpan nomor episode di dataset

            episodeButton.addEventListener('click', (event) => {
                event.preventDefault();

                if (isTrustedURL(ep.url)) {
                    playEpisode(ep.url, ep.episode, anime.id);
                    updateUrlWithEpisode(anime.id, ep.episode);
                } else {
                    console.warn('URL episode tidak terpercaya:', ep.url);
                    alert('Sumber video ini tidak dipercaya!');
                }
            });

            episodeList.appendChild(episodeButton);
        });
    }

    // Jika parameter episode tersedia di URL, mainkan episode tersebut
    if (episodeParam) {
        const selectedEpisode = anime.episodes.find(ep => ep.episode == episodeParam);
        if (selectedEpisode) {
            playEpisode(selectedEpisode.url, selectedEpisode.episode, anime.id);
        } else {
            alert('Episode tidak ditemukan!');
        }
    }
}

function playEpisode(url, episode, animeId) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');

    iframePlayer.src = url;
    downloadLink.href = url;
    downloadLink.textContent = `Download Episode ${episode}`;

    // Tambahkan pesan error jika video gagal dimuat
    iframePlayer.onerror = function () {
        alert('Gagal memuat video. Coba sumber lain.');
    };

    // Hapus status "active" dari semua episode dan tambahkan ke episode yang sedang diputar
    document.querySelectorAll('.episode-item').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.episode-item').forEach(e => {
        if (e.dataset.episode == episode) {
            e.classList.add('active');
        }
    });
}

function updateUrlWithEpisode(animeId, episode) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('episode', episode);
    window.history.pushState(null, '', newUrl.toString());
}

// Jalankan loadAnimeDetail jika elemen dengan ID "anime-title" ada di halaman
if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}
