import { fetchAnimeList } from './anime.js';

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const animeListContainer = document.getElementById("anime-list");

  let animeData = [];

  // Mengambil data anime melalui fungsi yang sudah disediakan di anime.js
  fetchAnimeList()
    .then(data => {
      animeData = data;
      displayAnime(animeData);
    })
    .catch(error => console.error("Error fetching data:", error));

  // Fungsi untuk menampilkan daftar anime dalam bentuk card
  function displayAnime(animes) {
    animeListContainer.innerHTML = "";
    animes.forEach(anime => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("anime-card");

      animeCard.innerHTML = `
        <img src="public/${anime.image}" alt="${anime.title}" />
        <div class="card-content">
          <h3>${anime.title}</h3>
          <p>Score: ${anime.score}</p>
          <p>Tanggal Rilis: ${anime.release_date}</p>
        </div>
      `;

      const title = document.createElement('h2');
            title.textContent = anime.title;

            card.appendChild(img);
            card.appendChild(title);

            card.addEventListener('click', () => {
                window.location.href = `anime.html?id=${anime.id}`;
            });

            container.appendChild(card);
        })

  // Event listener untuk pencarian
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    const filteredAnime = animeData.filter(anime =>
      anime.title.toLowerCase().includes(query)
    );
    displayAnime(filteredAnime);
  });

  // Event listener untuk pengurutan
  sortSelect.addEventListener("change", function () {
    const sortBy = sortSelect.value;
    let sortedAnime = [...animeData];

    if (sortBy === "score") {
      // Urutkan descending berdasarkan score
      sortedAnime.sort((a, b) => b.score - a.score);
    } else if (sortBy === "release_date") {
      // Urutkan descending berdasarkan tanggal rilis
      sortedAnime.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    }
    displayAnime(sortedAnime);
  });
});
