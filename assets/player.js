// player.js (update)
import { fetchAnimeList } from './anime.js';

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    const episodeParam = urlParams.get('episode');  // gunakan langsung string

    // Validasi dasar: id dan episode harus ada
    if (!animeId || !episodeParam) {
        alert("ID anime atau parameter episode tidak valid.");
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

    // Cari episode berdasarkan string match
    const currentEpisode = anime.episodes.find(ep => String(ep.episode) === episodeParam);

    if (!currentEpisode) {
        alert("Episode tidak ditemukan.");
        return;
    }

    // Set judul
    const titleElement = document.getElementById("anime-title");
    if (titleElement) {
        titleElement.textContent = `${anime.title} - Episode ${episodeParam}`;
    }

    // Tombol kembali
    const backToDetail = document.getElementById("back-to-detail");
    if (backToDetail) {
        backToDetail.href = `anime.html?id=${animeId}`;
    }

    // Pasang video
    const iframe = document.getElementById("anime-embed");
    if (iframe) {
        iframe.src = currentEpisode.url;
    }

    // Index dalam array untuk navigasi
    const episodeIndex = anime.episodes.findIndex(ep => String(ep.episode) === episodeParam);

    // Tombol prev/next
    const prevBtn = document.getElementById("prev-episode");
    const nextBtn = document.getElementById("next-episode");

    if (prevBtn) {
        prevBtn.disabled = episodeIndex <= 0;
        prevBtn.addEventListener("click", () => {
            if (episodeIndex > 0) {
                const prevEp = anime.episodes[episodeIndex - 1];
                window.location.href = `player.html?id=${animeId}&episode=${prevEp.episode}`;
            }
        });
    }

    if (nextBtn) {
        if (episodeIndex < anime.episodes.length - 1) {
            nextBtn.textContent = "Episode Selanjutnya";
            nextBtn.addEventListener("click", () => {
                const nextEp = anime.episodes[episodeIndex + 1];
                window.location.href = `player.html?id=${animeId}&episode=${nextEp.episode}`;
            });
        } else {
            nextBtn.textContent = "Cek Serial Serupa";
            nextBtn.addEventListener("click", () => {
                window.location.href = `related.html?id=${animeId}`;
              });
        }
    }
    

    // Jika ada mirrors array, tombol switch-server tetap bekerja
    const serverBtn = document.getElementById("switch-server");
    if (serverBtn && Array.isArray(currentEpisode.mirrors) && currentEpisode.mirrors.length > 0) {
        let currentMirrorIndex = 0;
        serverBtn.style.display = "inline-block";
        serverBtn.addEventListener("click", () => {
            currentMirrorIndex = (currentMirrorIndex + 1) % currentEpisode.mirrors.length;
            iframe.src = currentEpisode.mirrors[currentMirrorIndex];
        });
    }

    // Render ulang daftar episode dengan highlight yang aktif
    const episodeListDiv = document.getElementById("player-episode-list");
    if (episodeListDiv) {
        episodeListDiv.innerHTML = '';
        anime.episodes.forEach(ep => {
            const row = document.createElement("div");
            row.classList.add("player-episode-card");

            const label = document.createElement("div");
            label.classList.add("player-episode-label");
            label.textContent = `Episode ${ep.episode}`;

            const btn = document.createElement("a");
            btn.classList.add("player-watch-button");
            btn.href = `player.html?id=${animeId}&episode=${ep.episode}`;
            btn.textContent = "Tonton";
            btn.setAttribute("tabindex", "0");

            if (String(ep.episode) === episodeParam) {
                btn.classList.add("active");
                setTimeout(() => {
                    // scroll episode list & video
                    const container = episodeListDiv;
                    container.scrollTo({ top: btn.offsetTop - 10, behavior: 'smooth' });
                    iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }

            row.append(label, btn);
            episodeListDiv.appendChild(row);
        });
    }
});



