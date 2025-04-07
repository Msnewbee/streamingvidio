import { fetchAnimeList } from "./anime.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");
  const newAnimeContainer = document.getElementById("new-anime-list");

  let animeData = [];
  let previousAnimeIds = JSON.parse(localStorage.getItem("previousAnimeIds")) || [];
  let previousUpdateTimes = JSON.parse(localStorage.getItem("animeUpdateTimes")) || {};

  fetchAnimeList()
    .then(async (data) => {
      animeData = data;

      const newAnimeIds = animeData.map(anime => anime.id);
      const isAnimeListUpdated = JSON.stringify(previousAnimeIds) !== JSON.stringify(newAnimeIds);

      let isContentUpdated = false;
      let currentUpdateTimes = {};

      animeData.forEach(anime => {
        currentUpdateTimes[anime.id] = anime.last_updated || "";

        if (previousUpdateTimes[anime.id] !== anime.last_updated) {
          isContentUpdated = true;
        }
      });

      // Reset kalau ada anime baru atau episode baru
      if (isAnimeListUpdated || isContentUpdated) {
        console.log("📢 Terjadi perubahan data anime, mereset watch count...");
        localStorage.setItem("previousAnimeIds", JSON.stringify(newAnimeIds));
        localStorage.setItem("animeUpdateTimes", JSON.stringify(currentUpdateTimes));
        resetWatchCounts();
      }

      await loadServerWatchCounts();
      populateGenreOptions(animeData);
      displayAnime(animeData);
      displayNewlyAddedAnime(animeData);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function displayAnime(animes) {
    animeListContainer.innerHTML = "";
    animes.forEach((anime) => {
      const animeCard = createAnimeCard(anime);
      animeListContainer.appendChild(animeCard);
    });
  }

  function displayNewlyAddedAnime(animes) {
    if (!newAnimeContainer) {
      console.error("Element with ID 'new-anime-list' not found.");
      return;
    }

    newAnimeContainer.innerHTML = "<p>Loading...</p>";

    const searchInput = document.getElementById("search-anime");
    const sortSelect = document.getElementById("sort-anime");
    const genreSelect = document.getElementById("genre-anime");

    setTimeout(() => {
      if (searchInput.value || sortSelect.value || genreSelect.value) {
        newAnimeContainer.innerHTML = "";
        return;
      }

      newAnimeContainer.innerHTML = "";

      const latestAnimes = animes
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        .slice(0, 12);

      latestAnimes.forEach((anime) => {
        const animeCard = createAnimeCard(anime);
        newAnimeContainer.appendChild(animeCard);
      });
    }, 500);
  }

  function createAnimeCard(anime) {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");
    animeCard.innerHTML = `
      <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}" alt="${anime.title}" />
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Tanggal Rilis: ${anime.release_date}</p>
        <p>Genre: ${anime.genre.join(', ')}</p>
      </div>
    `;

    animeCard.addEventListener("click", () => {
      increaseWatchCount(anime.id);
      window.location.href = `anime.html?id=${anime.id}`;
    });
    return animeCard;
  }

  async function loadServerWatchCounts() {
    for (let anime of animeData) {
      try {
        const count = await getWatchCount(anime.id);
        anime.watchCount = count;
      } catch (err) {
        console.error(`Gagal mengambil watch count untuk ${anime.id}:`, err);
        anime.watchCount = 0;
      }
    }

    animeData.sort((a, b) => b.watchCount - a.watchCount);
  }

  async function getWatchCount(id) {
    try {
      const response = await fetch(`https://lingering-union-0acf.bilariko2.workers.dev/api/get-watch?id=${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Gagal mengambil watch count untuk ${id}:`, error);
    }
  }

  function increaseWatchCount(animeId) {
    fetch("https://lingering-union-0acf.bilariko2.workers.dev/api/increase-watch", {
      method: "POST",
      body: JSON.stringify({ animeId }),
    });
  }

  function resetWatchCounts() {
    fetch("https://lingering-union-0acf.bilariko2.workers.dev/api/reset-watch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("✅ Reset watch count berhasil:", data);
      })
      .catch(error => {
        console.error("❌ Gagal reset watch count:", error);
      });
  }

  function populateGenreOptions(animes) {
    const genres = new Set();
    animes.forEach((anime) => {
      anime.genre.forEach((g) => genres.add(g));
    });

    genreSelect.innerHTML = '<option value="">Pilih Genre</option>';
    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreSelect.appendChild(option);
    });
  }

  searchInput.addEventListener("input", function () {
    newAnimeContainer.innerHTML = "";
    filterAnime();
  });

  sortSelect.addEventListener("change", function () {
    newAnimeContainer.innerHTML = "";
    filterAnime();
  });

  genreSelect.addEventListener("change", function () {
    newAnimeContainer.innerHTML = "";
    filterAnime();
  });

  function filterAnime() {
    const query = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;
    const selectedGenre = genreSelect.value;

    let filteredAnime = animeData.filter((anime) =>
      anime.title.toLowerCase().includes(query) &&
      (selectedGenre === "" || anime.genre.includes(selectedGenre))
    );

    if (sortBy === "score") {
      filteredAnime.sort((a, b) => b.score - a.score);
    } else if (sortBy === "release_date") {
      filteredAnime.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    }

    displayAnime(filteredAnime);
  }
});
