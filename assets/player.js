import { fetchAnimeList } from './anime.js';

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    let episodeNumber = parseInt(urlParams.get('episode'));

    if (!animeId || isNaN(episodeNumber)) {
        alert("ID anime atau nomor episode tidak valid.");
        window.location.href = "index.html";
        return;
    }

    const animeList = await fetchAnimeList();
    const anime = animeList.find(a => String(a.id) === animeId);

    if (!anime) {
        alert("Anime tidak ditemukan.");
        window.location.href = "index.html";
        return;
    }

    const currentEpisode = anime.episodes.find(ep => parseInt(ep.episode) === episodeNumber);

    if (!currentEpisode) {
        alert("Episode tidak ditemukan.");
        return;
    }

    // Set judul anime
    const titleElement = document.getElementById("anime-title");
    titleElement.textContent = `${anime.title} - Episode ${episodeNumber}`;

    // Set tombol kembali ke detail anime
    const backToDetail = document.getElementById("back-to-detail");
    if (backToDetail) {
        backToDetail.href = `anime.html?id=${animeId}`;
    }

    // Pasang video ke iframe
    const iframe = document.getElementById("anime-embed");
    iframe.src = currentEpisode.url;

    // Navigasi episode
    const episodeIndex = anime.episodes.findIndex(ep => parseInt(ep.episode) === episodeNumber);

    const prevBtn = document.getElementById("prev-episode");
    const nextBtn = document.getElementById("next-episode");

    if (prevBtn) {
        prevBtn.disabled = episodeIndex <= 0;
        prevBtn.addEventListener("click", () => {
            if (episodeIndex > 0) {
                const prevEpisode = anime.episodes[episodeIndex - 1];
                window.location.href = `player.html?id=${animeId}&episode=${prevEpisode.episode}`;
            }
        });
    }

    if (nextBtn) {
        nextBtn.disabled = episodeIndex >= anime.episodes.length - 1;
        nextBtn.addEventListener("click", () => {
            if (episodeIndex < anime.episodes.length - 1) {
                const nextEpisode = anime.episodes[episodeIndex + 1];
                window.location.href = `player.html?id=${animeId}&episode=${nextEpisode.episode}`;
            }
        });
    }

    // Tombol ganti server (jika banyak mirror)
    const serverBtn = document.getElementById("switch-server");
    if (serverBtn && Array.isArray(currentEpisode.mirrors) && currentEpisode.mirrors.length > 0) {
        let currentMirrorIndex = 0;
        serverBtn.style.display = "inline-block";
        serverBtn.addEventListener("click", () => {
            currentMirrorIndex = (currentMirrorIndex + 1) % currentEpisode.mirrors.length;
            iframe.src = currentEpisode.mirrors[currentMirrorIndex];
        });
    }

    // Tampilkan daftar episode
    const episodeListDiv = document.getElementById("episode-list");
    if (episodeListDiv) {
        episodeListDiv.innerHTML = '';
        anime.episodes.forEach(ep => {
            const epLink = document.createElement('a');
            epLink.href = `player.html?id=${animeId}&episode=${ep.episode}`;
            epLink.textContent = `Episode ${ep.episode}`;
            epLink.classList.add("episode-link");
            if (parseInt(ep.episode) === episodeNumber) {
                epLink.classList.add("active");
            }
            episodeListDiv.appendChild(epLink);
        });
    }

    // Aktifkan iklan setelah beberapa detik
    setTimeout(() => {
        const ad1 = document.getElementById("ad-multiplex");
        const ad2 = document.getElementById("ad-vinyet");
        if (ad1) ad1.style.visibility = "visible";
        if (ad2) ad2.style.visibility = "visible";
        if (window.adsbygoogle) {
            window.adsbygoogle.push({});
            window.adsbygoogle.push({});
        }
    }, 3000);
});

