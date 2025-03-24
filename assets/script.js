import { fetchAnimeList } from "./anime.js";

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
      await loadWatchCounts();  // 🔹 Ambil watch count dari server
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

      const watchCount = anime.watchCount || 0; // 🔹 Ambil dari server

      animeCard.innerHTML = `
        <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}" alt="${anime.title}" />
        <div class="card-content">
          <h3>${anime.title}</h3>
          <p>Tanggal Rilis: ${anime.release_date}</p>
          <p>Genre: ${anime.genre.join(', ')}</p>
          <p>Ditonton: ${watchCount} kali</p>
        </div>
      `;

      animeCard.addEventListener("click", async () => {
        await increaseWatchCount(anime.id); // 🔹 Perbarui watch count di server
        window.location.href = `anime.html?id=${anime.id}`;
      });

      animeListContainer.appendChild(animeCard);
    });
  }

  // 🔹 Load watch count dari Cloudflare KV
  async function loadWatchCounts() {
    const requests = animeData.map(async (anime) => {
      const count = await getWatchCount(anime.id);
      anime.watchCount = count;
    });

    await Promise.all(requests); // Tunggu semua request selesai
    animeData.sort((a, b) => b.watchCount - a.watchCount);
  }

  // 🔹 Ambil watch count dari server
  async function getWatchCount(animeId) {
    try {
      const response = await fetch(`/watch/${animeId}`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error("Gagal mengambil watch count:", error);
      return 0;
    }
  }

  // 🔹 Perbarui watch count di server
  async function increaseWatchCount(animeId) {
    try {
      await fetch(`/watch/${animeId}`, { method: "POST" });
    } catch (error) {
      console.error("Gagal memperbarui watch count:", error);
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
