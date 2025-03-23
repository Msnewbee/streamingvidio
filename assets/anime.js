export async function fetchAnimeList() {
    try {
        const response = await fetch('./anime-list.json');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);

        // Display error message
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

    // Update page metadata
    document.getElementById('anime-title').textContent = anime.title;
    document.getElementById('anime-jtitle').textContent = anime.japanese_title || 'N/A';
    document.getElementById('anime-score').textContent = anime.score || 'N/A';
    document.getElementById('anime-studio').textContent = anime.studio || 'N/A';
    document.getElementById('anime-type').textContent = anime.type || 'N/A';
    document.getElementById('anime-status').textContent = anime.status || 'N/A';
    document.getElementById('anime-duration').textContent = anime.duration || 'N/A';
    document.getElementById('anime-release').textContent = anime.release_date || 'N/A';
    document.getElementById('anime-genre').textContent = anime.genre ? anime.genre.join(', ') : 'N/A';

    document.getElementById('anime-poster').src = anime.image ? `assets/images/${anime.image}` : 'assets/images/default-poster.jpg';

    // Trusted domains for video embedding
    const trustedDomains = ['mega.nz', 'filedon.co', 'acefile.co', 'another-trusted.com'];

    function isTrustedURL(url) {
        try {
            const parsedURL = new URL(url);
            return trustedDomains.includes(parsedURL.hostname);
        } catch (e) {
            return false; // Invalid URL
        }
    }

    // Load episode list
    const episodeList = document.getElementById('episode-list');
    episodeList.innerHTML = '';

    if (!anime.episodes || anime.episodes.length === 0) {
        episodeList.innerHTML = '<p>Belum ada episode tersedia.</p>';
    } else {
        anime.episodes.forEach((ep, index) => {
            const episodeLink = document.createElement('a');
            episodeLink.href = "#";
            episodeLink.textContent = `Episode ${ep.episode}`;
            episodeLink.classList.add("episode-item");
            episodeLink.dataset.url = ep.url;

            episodeList.appendChild(episodeLink);
        });
    }

    // Use event delegation for episode selection
    episodeList.addEventListener("click", (event) => {
        if (event.target.classList.contains("episode-item")) {
            event.preventDefault();
            const episodeURL = event.target.dataset.url;

            if (isTrustedURL(episodeURL)) {
                document.getElementById('anime-embed').src = episodeURL;

                // Highlight selected episode
                document.querySelectorAll('.episode-item').forEach(e => e.classList.remove('active'));
                event.target.classList.add('active');
            } else {
                console.warn('URL episode tidak terpercaya:', episodeURL);
            }
        }
    });

    // Auto-load first episode if available and trusted
    if (anime.episodes && anime.episodes.length > 0) {
        const firstEpisodeURL = anime.episodes[0].url;
        if (isTrustedURL(firstEpisodeURL)) {
            document.getElementById('anime-embed').src = firstEpisodeURL;
            document.querySelector('.episode-item')?.classList.add('active');
        } else {
            console.warn('URL pertama tidak terpercaya:', firstEpisodeURL);
        }
    }
}

// Run only if anime-title exists (prevents errors on other pages)
if (document.getElementById('anime-title')) {
    loadAnimeDetail();
}
