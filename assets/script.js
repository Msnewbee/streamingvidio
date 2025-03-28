import { fetchAnimeList } from "./anime.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");
  const paginationInfo = document.getElementById("pagination-info");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

  let animeData = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  let previousAnimeIds = JSON.parse(localStorage.getItem("previousAnimeIds")) || [];

  fetchAnimeList()
    .then((data) => {
      if (!data || data.length === 0) {
        animeListContainer.innerHTML = "<p>Anime tidak ditemukan.</p>";
        return;
      }

      const newAnimeIds = data.map(anime => anime.id);
      const isUpdated = JSON.stringify(previousAnimeIds) !== JSON.stringify(newAnimeIds);

      animeData = data;

      if (isUpdated) {
        localStorage.setItem("previousAnimeIds", JSON.stringify(newAnimeIds));
        resetWatchCounts();
      }

      loadWatchCounts();
      populateGenreOptions(animeData);
      displayAnimePaginated(animeData, currentPage);
    })
    .catch(() => {
      animeListContainer.innerHTML = "<p>Gagal memuat data. Periksa koneksi internet Anda.</p>";
    });

  function displayAnimePaginated(animes, page) {
    animeListContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedAnime = animes.slice(start, end);

    paginatedAnime.forEach((anime) => {
      const animeCard = createAnimeCard(anime);
      animeListContainer.appendChild(animeCard);
    });

    paginationInfo.textContent = `Halaman ${page} dari ${Math.ceil(animes.length / itemsPerPage)}`;
    updatePaginationButtons(animes.length);
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

  function updatePaginationButtons(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
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
    const totalPages = Math.ceil(animeData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayAnimePaginated(animeData, currentPage);
    }
  });

  searchInput.addEventListener("input", filterAnime);
  sortSelect.addEventListener("change", filterAnime);
  genreSelect.addEventListener("change", filterAnime);

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

  function loadWatchCounts() {
    animeData.forEach(anime => {
      anime.watchCount = getWatchCount(anime.id);
    });

    animeData.sort((a, b) => b.watchCount - a.watchCount);
  }

  function resetWatchCounts() {
    animeData.forEach(anime => {
      localStorage.removeItem(`watchCount_${anime.id}`);
    });
  }

  function getWatchCount(animeId) {
    return parseInt(localStorage.getItem(`watchCount_${animeId}`)) || 0;
  }

  function increaseWatchCount(animeId) {
    const currentCount = getWatchCount(animeId);
    const newCount = currentCount + 1;
    localStorage.setItem(`watchCount_${animeId}`, newCount);

    const watchCountElement = document.getElementById(`watch-count-${animeId}`);
    if (watchCountElement) {
      watchCountElement.textContent = newCount;
    }
  }
});
