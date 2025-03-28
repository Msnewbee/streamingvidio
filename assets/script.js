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
    .then((data) => {
      const newAnimeIds = data.map(anime => anime.id);
      const isUpdated = JSON.stringify(previousAnimeIds) !== JSON.stringify(newAnimeIds);
      
      animeData = data;
      if (isUpdated) {
        localStorage.setItem("previousAnimeIds", JSON.stringify(newAnimeIds));
        resetWatchCounts();
      }
      loadWatchCounts();
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
    newAnimeContainer.innerHTML = "";
    const latestAnimes = filterNewlyAddedAnime(animes);
    latestAnimes.forEach((anime) => {
        const animeCard = createAnimeCard(anime);
        newAnimeContainer.appendChild(animeCard);
    });
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
        <p>Terakhir Diperbarui: ${anime.last_updated}</p>
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
    localStorage.setItem(`watchCount_${animeId}`, currentCount + 1);
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

    displayAnime(filteredAnime);
  }
});
