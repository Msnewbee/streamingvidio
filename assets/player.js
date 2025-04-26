// assets/player.js
import { fetchAnimeList } from './anime.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params       = new URLSearchParams(window.location.search);
  const animeId      = params.get('id');
  const episodeParam = params.get('episode');

  // 1) Validasi dasar
  if (!animeId || !episodeParam) {
    alert("ID anime atau parameter episode tidak valid.");
    window.location.href = "index.html";
    return;
  }

  // 2) Ambil daftar anime & temukan yang dipilih
  const animeList = await fetchAnimeList();
  const anime     = animeList.find(a => String(a.id) === animeId);
  if (!anime) {
    alert("Anime tidak ditemukan.");
    window.location.href = "index.html";
    return;
  }

  // 3) Temukan episode sekarang
  const currentEpisode = anime.episodes.find(ep => String(ep.episode) === episodeParam);
  if (!currentEpisode) {
    alert("Episode tidak ditemukan.");
    return;
  }

  // 4) Update judul & tombol back
  const titleEl = document.getElementById("anime-title");
  if (titleEl) titleEl.textContent = `${anime.title} — Episode ${episodeParam}`;

  const backBtn = document.getElementById("back-to-detail");
  if (backBtn) backBtn.href = `anime.html?id=${animeId}`;

  // 5) Pasang video
  const iframe = document.getElementById("anime-embed");
  if (iframe) iframe.src = currentEpisode.url;

  // 6) Hitung index untuk navigasi
  const episodeIndex = anime.episodes.findIndex(ep => String(ep.episode) === episodeParam);

  // 7) Tombol Prev / Next
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
      // masih ada episode selanjutnya
      nextBtn.textContent = "Episode Selanjutnya";
      nextBtn.addEventListener("click", () => {
        const nextEp = anime.episodes[episodeIndex + 1];
        window.location.href = `player.html?id=${animeId}&episode=${nextEp.episode}`;
      });
    } else {
      // episode terakhir → tombol Serial Serupa
      nextBtn.textContent = "Cek Serial Serupa";
      nextBtn.addEventListener("click", () => {
        // gunakan property `source` (nama file JSON) yang sudah disisipkan di anime.js
        const file = anime.source;  // misal "Jujutsu_Kaisen.json"
        window.location.href = `related.html?file=${encodeURIComponent(file)}`;
      });
    }
  }

  // 8) Switch-server (mirrors), jika ada
  const serverBtn = document.getElementById("switch-server");
  if (serverBtn && Array.isArray(currentEpisode.mirrors) && currentEpisode.mirrors.length) {
    let idx = 0;
    serverBtn.style.display = "inline-block";
    serverBtn.addEventListener("click", () => {
      idx = (idx + 1) % currentEpisode.mirrors.length;
      iframe.src = currentEpisode.mirrors[idx];
    });
  }

  // 9) Render daftar episode dengan highlight
  const listDiv = document.getElementById("player-episode-list");
  if (listDiv) {
    listDiv.innerHTML = "";
    anime.episodes.forEach(ep => {
      const card = document.createElement("div");
      card.className = "player-episode-card";

      const lbl = document.createElement("div");
      lbl.className = "player-episode-label";
      lbl.textContent = `Episode ${ep.episode}`;

      const btn = document.createElement("a");
      btn.className = "player-watch-button";
      btn.href = `player.html?id=${animeId}&episode=${ep.episode}`;
      btn.textContent = "Tonton";
      btn.tabIndex = 0;

      if (String(ep.episode) === episodeParam) {
        btn.classList.add("active");
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }

      card.append(lbl, btn);
      listDiv.appendChild(card);
    });
  }
});





