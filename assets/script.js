import { fetchAnimeList } from "./anime.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const animeListContainer = document.getElementById("anime-list");

  let animeData = [];

  // Fetch anime data
  fetchAnimeList()
    .then((data) => {
      animeData = data;
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
        <img src="${anime.image.startsWith('http') ? anime.image : 'public/' + anime.image}" alt="${anime.title}" />
        <div class="card-content">
          <h3>${anime.title}</h3>
          <p>Score: ${anime.score}</p>
          <p>Tanggal Rilis: ${anime.release_date}</p>
        </div>
      `;

      animeCard.addEventListener("click", () => {
        window.location.href = `anime.html?id=${anime.id}`;
      });

      animeListContainer.appendChild(animeCard);
    });
  }

  // Search functionality
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const filteredAnime = animeData.filter((anime) =>
      anime.title.toLowerCase().includes(query)
    );
    displayAnime(filteredAnime);
  });

  // Sorting functionality
  sortSelect.addEventListener("change", function () {
    const sortBy = sortSelect.value;
    let sortedAnime = [...animeData];

    if (sortBy === "score") {
      sortedAnime.sort((a, b) => b.score - a.score);
    } else if (sortBy === "release_date") {
      sortedAnime.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    }
    displayAnime(sortedAnime);
  });
});
