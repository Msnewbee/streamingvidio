import { fetchAnimeList } from "./anime.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");

  let animeData = [];

  // Fungsi untuk berinteraksi dengan D1 database
  async function queryD1(sql, params = []) {
    try {
      const response = await fetch('/api/d1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error querying D1:', error);
      return { error };
    }
  }

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

      animeCard.innerHTML = `
        <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}" alt="${anime.title}" />
        <div class="card-content">
          <h3>${anime.title}</h3>
          <p>Tanggal Rilis: ${anime.release_date}</p>
          <p>Genre: ${anime.genre.join(', ')}</p>
          <p>Ditonton: ${anime.watchCount || 0} kali</p>
        </div>
      `;

      animeCard.addEventListener("click", async () => {
        await increaseWatchCount(anime.id);
        window.location.href = `anime.html?id=${anime.id}`;
      });

      animeListContainer.appendChild(animeCard);
    });
  }

  // Load watch count data from D1
  async function loadWatchCounts() {
    try {
      // Ambil semua watch count sekaligus untuk optimasi
      const result = await queryD1("SELECT * FROM anime_watch_counts");
      
      if (result.error) throw result.error;
      
      // Buat mapping untuk akses cepat
      const watchCountMap = new Map();
      result.forEach(row => {
        watchCountMap.set(row.anime_id, row.count);
      });
      
      // Update animeData dengan watch count
      animeData.forEach(anime => {
        anime.watchCount = watchCountMap.get(anime.id) || 0;
      });
      
      // Urutkan berdasarkan watch count
      animeData.sort((a, b) => b.watchCount - a.watchCount);
    } catch (error) {
      console.error("Error loading watch counts:", error);
    }
  }

  // Increase watch count in D1
  async function increaseWatchCount(animeId) {
    try {
      // Gunakan UPSERT untuk menambah atau membuat record baru
      await queryD1(
        `INSERT INTO anime_watch_counts (anime_id, count) 
         VALUES (?, 1)
         ON CONFLICT(anime_id) DO UPDATE SET count = count + 1`,
        [animeId]
      );
    } catch (error) {
      console.error("Error increasing watch count:", error);
    }
  }

  // Populate genre dropdown (sama seperti sebelumnya)
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

  // Search functionality (sama seperti sebelumnya)
  searchInput.addEventListener("input", function () {
    filterAnime();
  });

  // Sorting functionality (sama seperti sebelumnya)
  sortSelect.addEventListener("change", function () {
    filterAnime();
  });

  // Genre filter functionality (sama seperti sebelumnya)
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
