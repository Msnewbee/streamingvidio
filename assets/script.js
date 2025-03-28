import { fetchAnimeList } from "./anime.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");
  const newAnimeContainer = document.getElementById("new-anime-list");
  const paginationContainer = document.getElementById("pagination");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const paginationInfo = document.getElementById("pagination-info");

  let animeData = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  fetchAnimeList()
    .then((data) => {
      animeData = data;
      populateGenreOptions(animeData);
      displayAnimePaginated(animeData, currentPage);
      displayNewlyAddedAnime(animeData);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function displayAnimePaginated(animes, page) {
    animeListContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedAnime = animes.slice(start, end);
    
    paginatedAnime.forEach((anime) => {
      const animeCard = createAnimeCard(anime);
      animeListContainer.appendChild(animeCard);
    });
    updatePagination(animes.length);
  }

  function displayNewlyAddedAnime(animes) {
    newAnimeContainer.innerHTML = "";
    const latestAnimes = animes.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 5);
    latestAnimes.forEach((anime) => {
      const animeCard = createAnimeCard(anime);
      newAnimeContainer.appendChild(animeCard);
    });
  }

  function createAnimeCard(anime) {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");
    animeCard.innerHTML = `
      <img src="${anime.image ? anime.image : 'default-poster.jpg'}" alt="${anime.title}" />
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Tanggal Rilis: ${anime.release_date}</p>
        <p>Genre: ${anime.genre.join(', ')}</p>
      </div>
    `;
    animeCard.addEventListener("click", () => {
      window.location.href = `anime.html?id=${anime.id}`;
    });
    return animeCard;
  }

  function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  prevPageBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayAnimePaginated(animeData, currentPage);
    }
  });

  nextPageBtn.addEventListener("click", function () {
    if (currentPage < Math.ceil(animeData.length / itemsPerPage)) {
      currentPage++;
      displayAnimePaginated(animeData, currentPage);
    }
  });

  searchInput.addEventListener("input", function () {
    filterAnime();
  });

  sortSelect.addEventListener("change", function () {
    filterAnime();
  });

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
    currentPage = 1;
    displayAnimePaginated(filteredAnime, currentPage);
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
});
