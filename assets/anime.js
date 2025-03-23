export async function fetchAnimeList() {
    try {
        const response = await fetch('./anime-list.json');
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error('Error fetching anime list:', error);

        // Menampilkan pesan error di halaman jika elemen tersedia
        document.getElementById('episode-list')?.innerHTML = 
            `<p style="color: red;">Gagal memuat daftar anime. Silakan coba lagi nanti.</p>`;
        
        return null; // Mengembalikan null untuk ditangani di loadAnimeDetail()
    }
}

export async function loadAnimeDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        alert("Anime ID tidak ditemukan!");
        window.location.href = 'index.html';
        return;
    }

    const animeList = await fetchAnimeList();
    if (!animeList) {
        alert("Gagal memuat data anime.");
        return;
    }

    const anime = animeList.find(a => a.id == animeId);
    if (!anime) {
        alert("Anime tidak ditemukan.");
        window.location.href = 'index.html';
        return;
    }

    // Update metadata di halaman
    document.getElementById('anime-title')?.textContent = anime.title ?? 'Tidak tersedia';
    document.getElementById('anime-jtitle')?.textContent = anime.japanese_title ?? 'Tidak tersedia';
    document.getElementById('anime-score')?.textContent = anime.score ?? 'N/A';
    document.getElementById('anime-studio')?.textContent = anime.studio ?? 'Tidak diketahui';
    document.getElementById('anime-type')?.textContent = anime.type ?? 'Tidak diketahui';
    document.getElementById('anime-status')?.textContent = anime.status ?? 'Tidak diketahui';
    document.getElementById('anime-duration')?.textContent = anime.duration ?? 'Tidak tersedia';
    document.getElementById('anime-release')?.textContent = anime.release_date ?? 'Tidak diketahui';
    document.getElementById('anime-genre')?.textContent = anime.genre?.join(', ') ?? 'Tidak ada genre';
    document.getElementById('anime-poster')?.src = anime.image ? `public/${anime.image}` : 'default-poster.jpg';

    // Daftar domain terpercaya
    const trustedDomains = [
        'https://mega.nz/', 
        'https://filedon.co/', 
        'https://acefile.co/', 
        'https://another-trusted.com/'
    ];

    function isTrustedURL(url) {
        try {
            return trustedDomains.some(domain => url.startsWith(domain));
        } catch (e) {
            return false;
        }
    }

    // Muat daftar episode
    const episodeList = document.getElementById('episode-list');
    episodeList.textContent = ''; // Bersihkan daftar sebelumnya

    if (!anime.episodes || anime.episodes.length === 0) {
        episodeList.textContent = 'Belum ada episode tersedia.';
    } else {
        anime.episodes.forEach((ep) => {
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
                    alert('URL episode ini tidak aman dan tidak akan diputar.');
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
