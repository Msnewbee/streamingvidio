import { fetchAnimeList } from "./anime.js";

const API_URL = "https://script.google.com/macros/s/AKfycbwxTH2-E5RdWIfSquKzgcgLRVkuXtLfRRTC45Q3TyoH96a3evggOexA3wMxMkDQpCgybg/exec";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");

  let animeData = [];

  // Fetch anime data
  fetchAnimeList()
    .then(async (data) => {
      animeData = data;
      await loadWatchCounts();
      populateGenreOptions(animeData);
      displayAnime(animeData);
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Function to display anime list
  function displayAnime(animes) {
    animeListContainer.innerHTML = "";
    animes.forEach((anime) => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-card");
      animeCard.dataset.id = anime.id;

      const watchCount = anime.watchCount || 0;

      animeCard.innerHTML = `
        <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}" alt="${anime.title}" />
        <div class="card-content">
          <h3>${anime.title}</h3>
          <p>Tanggal Rilis: ${anime.release_date}</p>
          <p>Genre: ${anime.genre.join(', ')}</p>
          <p>Ditonton: <span id="watch-count-${anime.id}">${watchCount}</span> kali</p>
        </div>
      `;

      animeCard.addEventListener("click", async () => {
        await increaseWatchCount(anime.id);
        window.location.href = `anime.html?id=${anime.id}`;
      });

      animeListContainer.appendChild(animeCard);
    });
  }

  // Load watch count data from Google Sheets
  async function loadWatchCounts() {
    try {
      const response = await fetch(`${API_URL}?action=getAll`);
      const data = await response.json();

      animeData.forEach(anime => {
        anime.watchCount = data[anime.id] || 0;
      });

      animeData.sort((a, b) => b.watchCount - a.watchCount);
    } catch (error) {
      console.error("Gagal mengambil watch count:", error);
    }
  }

  // Get watch count from Google Sheets
  async function getWatchCount(animeId) {
    try {
      const response = await fetch(`${API_URL}?animeId=${animeId}&action=get`);
      const data = await response.json();
      return data.watchCount || 0;
    } catch (error) {
      console.error("Gagal mengambil watch count:", error);
      return 0;
    }
  }

  // Increase watch count in Google Sheets
  async function increaseWatchCount(animeId) {
    try {
      await fetch(`${API_URL}?animeId=${animeId}&action=increase`);
      const newCount = await getWatchCount(animeId);
      document.getElementById(`watch-count-${animeId}`).textContent = newCount;
    } catch (error) {
      console.error("Gagal menambahkan watch count:", error);
    }
  }

  // Populate genre dropdown
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

  // Search functionality
  searchInput.addEventListener("input", function () {
    filterAnime();
  });

  // Sorting functionality
  sortSelect.addEventListener("change", function () {
    filterAnime();
  });

  // Genre filter functionality
  genreSelect.addEventListener("change", function () {
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
