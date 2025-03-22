export async function fetchAnimeList() {
    try {
        const response = await fetch('./anime-list.json');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);

        // Tampilkan pesan error di halaman
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

    // Update metadata di halaman
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

    // Validasi domain terpercaya sebelum menampilkan video
    const trustedDomains = ['mega.nz', 'acefile.co', 'another-trusted.com'];

    function isTrustedURL(url) {
        try {
            const parsedURL = new URL(url);
            return trustedDomains.includes(parsedURL.hostname);
        } catch (e) {
            return false; // Jika URL tidak valid
        }
    }

    // Muat daftar episode
    const episodeList = document.getElementById('episode-list');
    episodeList.textContent = '';

    if (anime.episodes.length === 0) {
        episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
    } else {
        anime.episodes.forEach((ep, index) => {
            const episodeLink = document.createElement('a');
            episodeLink.href = "#";
            episodeLink.textContent = `Episode ${ep.episode}`;
            episodeLink.classList.add("episode-item");

            episodeLink.addEventListener('click', (event) => {
                event.preventDefault();

                if (isTrustedURL(ep.url)) {
                    document.getElementById('anime-embed').src = ep.url;

                    // Hapus highlight dari episode sebelumnya
                    document.querySelectorAll('.episode-item').forEach(e => e.classList.remove('active'));
                    episodeLink.classList.add('active');
                } else {
                    console.warn('URL episode tidak terpercaya:', ep.url);
                }
            });

            episodeList.appendChild(episodeLink);
        });
    }

    // Load episode pertama jika tersedia & aman
    if (anime.episodes.length > 0) {
        const firstEpisodeURL = anime.episodes[0].url;
        if (isTrustedURL(firstEpisodeURL)) {
            document.getElementById('anime-embed').src = firstEpisodeURL;
            // Highlight episode pertama
            document.querySelector('.episode-item')?.classList.add('active');
        } else {
            console.warn('URL pertama tidak terpercaya:', firstEpisodeURL);
        }
    }
}

// Jalankan hanya jika elemen anime-title ada (mencegah error di halaman lain)
if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}
