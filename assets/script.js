import { fetchAnimeList } from "./anime.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");
  const newAnimeContainer = document.getElementById("new-anime-list");

  let animeData = [];
  let previousAnimeIds = JSON.parse(localStorage.getItem("previousAnimeIds")) || [];

  fetchAnimeList()
  .then(async (data) => {
    const newAnimeIds = data.map(anime => anime.id);
    const isUpdated = JSON.stringify(previousAnimeIds) !== JSON.stringify(newAnimeIds);
    
    animeData = data;
    if (isUpdated) {
      localStorage.setItem("previousAnimeIds", JSON.stringify(newAnimeIds));
      resetWatchCounts(); // <-- pastikan fungsi ini juga didefinisikan ya
    }

    await loadServerWatchCounts(); // <- perbaikan di sini
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
    
    // Tampilkan indikator loading saat proses berjalan
    newAnimeContainer.innerHTML = "<p>Loading...</p>";
    
    // Dapatkan elemen kontrol pencarian, sortir, dan genre
    const searchInput = document.getElementById("search-anime");
    const sortSelect = document.getElementById("sort-anime");
    const genreSelect = document.getElementById("genre-anime");
    
    // Simulasikan delay loading (misalnya 500ms)
    setTimeout(() => {
      // Jika ada pencarian, sortir, atau pemilihan genre, kosongkan daftar anime terbaru
      if (searchInput.value || sortSelect.value || genreSelect.value) {
        newAnimeContainer.innerHTML = "";
        return;
      }
      
      newAnimeContainer.innerHTML = "";
      
      // Ambil hanya 5 anime terbaru berdasarkan tanggal rilis
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

  function filterNewlyAddedAnime(animes) {
    return animes.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
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
  
    // Urutkan berdasarkan jumlah tontonan
    animeData.sort((a, b) => b.watchCount - a.watchCount);
  }
  

  async function getWatchCount(animeId) {
    const res = await fetch(`https://anime-watch-count.bilariko2.workers.dev/api/get-watch?id=${animeId}`);
    const data = await res.json();
    return data.count;
  }

  function increaseWatchCount(animeId) {
    fetch("https://anime-watch-count.bilariko2.workers.dev/api/increase-watch", {
      method: "POST",
      body: JSON.stringify({ animeId }),
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

  // Ketika terjadi perubahan pada pencarian, sortir, atau pemilihan genre,
  // pastikan kontainer newAnimeContainer dikosongkan agar daftar anime terbaru tidak muncul.
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