// Konfigurasi
const CONFIG = {
    DEFAULT_POSTER: 'default-poster.jpg',
    FALLBACK_ANIME: {
        id: 'fallback',
        title: 'Anime Tidak Ditemukan',
        image: 'default-poster.jpg',
        episodes: []
    },
    TIMEOUT: 8000 // 8 detik timeout untuk fetch
};

// Fungsi utama untuk mengambil data anime dengan error handling yang lebih baik
export async function fetchAnimeList() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const response = await fetch('./anime-list.json', {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validasi struktur data
        if (!Array.isArray(data)) {
            throw new Error('Data tidak valid: format JSON bukan array');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching anime list:', error);
        
        // Fallback untuk offline mode atau error
        const fallbackData = localStorage.getItem('anime-fallback');
        if (fallbackData) {
            try {
                return JSON.parse(fallbackData);
            } catch (e) {
                console.error('Error parsing fallback data:', e);
            }
        }
        
        return [CONFIG.FALLBACK_ANIME];
    }
}

// Fungsi untuk memuat detail anime dengan optimasi
export async function loadAnimeDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const animeId = urlParams.get('id');
        const episodeParam = urlParams.get('episode');
        
        if (!animeId) {
            window.location.href = 'index.html';
            return;
        }

        const animeList = await fetchAnimeList();
        const anime = animeList.find(a => a.id === animeId) || CONFIG.FALLBACK_ANIME;

        // Simpan data terakhir untuk offline mode
        localStorage.setItem('anime-fallback', JSON.stringify(animeList));

        updateAnimeDetails(anime);
        populateEpisodeList(anime);

        // Auto-play episode pertama jika tidak ada episode yang dipilih
        if (anime.episodes.length > 0) {
            const targetEpisode = episodeParam 
                ? anime.episodes.find(ep => ep.episode == episodeParam)
                : anime.episodes[0];
                
            if (targetEpisode) {
                playEpisode(
                    targetEpisode.url, 
                    targetEpisode.episode, 
                    anime.id, 
                    targetEpisode.mirrors || []
                );
            }
        }
    } catch (error) {
        console.error('Error loading anime detail:', error);
        document.getElementById('anime-container').innerHTML = `
            <div class="error-message">
                <h3>Gagal memuat data anime</h3>
                <p>Silakan coba lagi atau kembali ke <a href="index.html">halaman utama</a></p>
            </div>
        `;
    }
}

// Fungsi untuk memperbarui tampilan detail anime dengan sanitasi
function updateAnimeDetails(anime) {
    const setElementContent = (id, content) => {
        const element = document.getElementById(id);
        if (element) element.textContent = content || '-';
    };

    setElementContent('anime-title', anime.title);
    setElementContent('anime-jtitle', anime.japanese_title);
    setElementContent('anime-score', anime.score);
    setElementContent('anime-producers', anime.producers);
    setElementContent('anime-studio', anime.studio);
    setElementContent('anime-type', anime.type);
    setElementContent('anime-status', anime.status);
    setElementContent('anime-duration', anime.duration);
    setElementContent('anime-release', anime.release_date);
    setElementContent('anime-genre', anime.genre?.join(', '));

    const poster = document.getElementById('anime-poster');
    if (poster) {
        poster.src = anime.image ? `public/${anime.image}` : CONFIG.DEFAULT_POSTER;
        poster.alt = `Poster ${anime.title}`;
        poster.onerror = () => {
            poster.src = CONFIG.DEFAULT_POSTER;
        };
    }
}

// Fungsi untuk menampilkan daftar episode dengan virtual scroll
function populateEpisodeList(anime) {
    const episodeList = document.getElementById('episode-list');
    if (!episodeList) return;

    episodeList.innerHTML = '';

    if (!anime.episodes || anime.episodes.length === 0) {
        episodeList.innerHTML = '<p class="no-episodes">Belum ada episode tersedia.</p>';
        return;
    }

    // Urutkan episode dari terbaru ke terlama
    const sortedEpisodes = [...anime.episodes].sort((a, b) => b.episode - a.episode);

    // Batasi render awal untuk performa
    const initialRenderCount = Math.min(20, sortedEpisodes.length);
    
    for (let i = 0; i < initialRenderCount; i++) {
        const ep = sortedEpisodes[i];
        createEpisodeButton(ep, anime.id, episodeList);
    }

    // Lazy load untuk episode selanjutnya
    if (sortedEpisodes.length > initialRenderCount) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    for (let i = initialRenderCount; i < sortedEpisodes.length; i++) {
                        const ep = sortedEpisodes[i];
                        createEpisodeButton(ep, anime.id, episodeList);
                    }
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(episodeList.lastElementChild);
    }
}

// Helper function untuk membuat tombol episode
function createEpisodeButton(episode, animeId, container) {
    const episodeButton = document.createElement('button');
    episodeButton.className = 'episode-item';
    episodeButton.innerHTML = `
        <span>Episode ${episode.episode}</span>
        ${episode.title ? `<small>${episode.title}</small>` : ''}
    `;
    episodeButton.dataset.episode = episode.episode;
    episodeButton.ariaLabel = `Putar episode ${episode.episode}`;

    episodeButton.addEventListener('click', (e) => {
        e.preventDefault();
        playEpisode(episode.url, episode.episode, animeId, episode.mirrors || []);
        updateUrlWithEpisode(animeId, episode.episode);
    });

    container.appendChild(episodeButton);
}

// Fungsi navigasi episode yang dioptimasi
async function navigateEpisode(direction) {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    const currentEpisode = parseInt(urlParams.get('episode')) || 1;

    try {
        const animeList = await fetchAnimeList();
        const anime = animeList.find(a => a.id === animeId);
        if (!anime || !anime.episodes) return;

        const currentIndex = anime.episodes.findIndex(ep => ep.episode == currentEpisode);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < anime.episodes.length) {
            const newEpisode = anime.episodes[newIndex];
            playEpisode(
                newEpisode.url, 
                newEpisode.episode, 
                animeId, 
                newEpisode.mirrors || []
            );
        }
    } catch (error) {
        console.error('Error navigating episode:', error);
    }
}

// Fungsi pemutaran episode dengan fallback mirror
function playEpisode(url, episode, animeId, mirrors = []) {
    const iframePlayer = document.getElementById('anime-embed');
    const downloadLink = document.getElementById('download-link');
    const mirrorList = document.getElementById('mirror-list');

    if (!iframePlayer) return;

    // Coba sumber utama terlebih dahulu
    iframePlayer.src = url;
    iframePlayer.onerror = () => {
        // Fallback ke mirror jika ada
        if (mirrors.length > 0) {
            iframePlayer.src = mirrors[0].url;
        }
    };

    // Update download link
    if (downloadLink) {
        downloadLink.href = url;
        downloadLink.textContent = `Download Episode ${episode}`;
        downloadLink.download = `${animeId}_episode_${episode}.mp4`;
    }

    // Update mirror list
    if (mirrorList && mirrors.length > 0) {
        mirrorList.innerHTML = mirrors.map(mirror => `
            <li>
                <button onclick="document.getElementById('anime-embed').src='${mirror.url}'">
                    ${mirror.name || 'Mirror'} (${mirror.quality || 'HD'})
                </button>
            </li>
        `).join('');
    }

    // Update URL dan UI
    updateUrlWithEpisode(animeId, episode);
    highlightCurrentEpisode(episode);
}

// Fungsi untuk menyoroti episode yang sedang diputar
function highlightCurrentEpisode(episode) {
    document.querySelectorAll('.episode-item').forEach(btn => {
        const isCurrent = parseInt(btn.dataset.episode) === episode;
        btn.classList.toggle('active', isCurrent);
        btn.ariaCurrent = isCurrent ? 'true' : 'false';
    });
}

// Fungsi untuk memperbarui URL dengan history API
function updateUrlWithEpisode(animeId, episode) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('episode', episode);
    
    // Simpan scroll position sebelum navigasi
    const scrollY = window.scrollY;
    
    window.history.replaceState(
        { animeId, episode, scrollY },
        '',
        newUrl.toString()
    );
}

// Event listener dengan delegasi event
function setupEventListeners() {
    // Delegasi event untuk navigasi episode
    document.addEventListener('click', (e) => {
        if (e.target.matches('#prev-episode')) {
            e.preventDefault();
            navigateEpisode(-1);
        } else if (e.target.matches('#next-episode')) {
            e.preventDefault();
            navigateEpisode(1);
        }
    });

    // Restore scroll position saat navigasi history
    window.addEventListener('popstate', (e) => {
        if (e.state?.scrollY) {
            window.scrollTo(0, e.state.scrollY);
        }
    });
}

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    
    if (document.getElementById('anime-title')) {
        loadAnimeDetail();
    }
});

// Ekspos fungsi tertentu ke global scope untuk kebutuhan khusus
window.playEpisode = playEpisode;
