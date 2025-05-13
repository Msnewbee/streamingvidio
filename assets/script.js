import { fetchAnimeList } from "./anime.js";

function loadAd(domain, id) {
  const s = document.createElement("script");
  s.src = `https://${domain}/400/${id}`;
  (document.body || document.documentElement).appendChild(s);
}

document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("search-anime");
  const sortSelect = document.getElementById("sort-anime");
  const genreSelect = document.getElementById("genre-anime");
  const animeListContainer = document.getElementById("anime-list");
  const newAnimeContainer = document.getElementById("new-anime-list");
  const paginationContainer = document.getElementById("pagination");
  const paginationNewContainer = document.getElementById("pagination-new");

  let animeData = [];
  let previousAnimeIds = JSON.parse(localStorage.getItem("previousAnimeIds")) || [];
  let currentPage = 1;
  let currentNewPage = 1;
  const itemsPerPage = 12;

  animeListContainer.innerHTML = "<p>Memuat daftar anime...</p>";

  fetchAnimeList()
    .then(async (data) => {
      animeData = data;

      const newAnimeIds = animeData.map((anime) => anime.id);
      const isAnimeListUpdated = JSON.stringify(previousAnimeIds) !== JSON.stringify(newAnimeIds);
      if (isAnimeListUpdated) {
        localStorage.setItem("previousAnimeIds", JSON.stringify(newAnimeIds));
        console.log("📢 Daftar anime berubah.");
      }

      await loadServerWatchCounts();

      const sortedByWatch = [...animeData].sort((a, b) => b.watchCount - a.watchCount);
      displayAnime(sortedByWatch);

      displayNewlyAddedAnimeWithPagination(animeData);
      populateGenreOptions(animeData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      animeListContainer.innerHTML = "<p>Gagal memuat data anime.</p>";
    });

  loadAd("vemtoutcheeg.com", 9264100);
  loadAd("vemtoutcheeg.com", 9264105);

  function displayAnime(animes) {
    animeListContainer.innerHTML = "";

    const totalPages = Math.ceil(animes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAnimes = animes.slice(startIndex, endIndex);

    paginatedAnimes.forEach((anime) => {
      const animeCard = createAnimeCard(anime);
      animeListContainer.appendChild(animeCard);
    });

    renderPaginationControls(totalPages, animes);
  }

  function renderPaginationControls(totalPages, animes) {
    paginationContainer.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Sebelumnya";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      currentPage--;
      displayAnime(animes);
    });

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Berikutnya";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      currentPage++;
      displayAnime(animes);
    });

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;

    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextBtn);
  }

  function displayNewlyAddedAnimeWithPagination(animes) {
    if (!newAnimeContainer) {
      console.error("Element dengan ID 'new-anime-list' tidak ditemukan.");
      return;
    }

    newAnimeContainer.innerHTML = "";

    const airingAnimes = animes.filter((anime) => {
      const status = anime.status?.toLowerCase();
      return status !== "selesai" && status !== "completed";
    });

    const totalPages = Math.ceil(airingAnimes.length / itemsPerPage);
    const startIndex = (currentNewPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAnimes = airingAnimes.slice(startIndex, endIndex);

    paginatedAnimes.forEach((anime) => {
      const animeCard = createAnimeCard(anime);
      newAnimeContainer.appendChild(animeCard);
    });

    renderPaginationNewControls(totalPages, airingAnimes);
  }

  function renderPaginationNewControls(totalPages, animes) {
    paginationNewContainer.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Sebelumnya";
    prevBtn.disabled = currentNewPage === 1;
    prevBtn.addEventListener("click", () => {
      currentNewPage--;
      displayNewlyAddedAnimeWithPagination(animes);
    });

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Berikutnya";
    nextBtn.disabled = currentNewPage === totalPages;
    nextBtn.addEventListener("click", () => {
      currentNewPage++;
      displayNewlyAddedAnimeWithPagination(animes);
    });

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Halaman ${currentNewPage} dari ${totalPages}`;

    paginationNewContainer.appendChild(prevBtn);
    paginationNewContainer.appendChild(pageInfo);
    paginationNewContainer.appendChild(nextBtn);
  }

  function createAnimeCard(anime) {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");

    const type = anime.type?.toUpperCase() || "TV";
    let labelColor = "#3498db";
    if (type === "OVA") labelColor = "#e74c3c";
    else if (type === "MOVIE") labelColor = "#f1c40f";
    else if (type === "SPECIAL") labelColor = "#9b59b6";
    else if (type === "ONA") labelColor = "#2ecc71";

    const genreText = Array.isArray(anime.genre) ? anime.genre.join(", ") : "-";

    animeCard.innerHTML = `
      <div class="image-container">
        <img src="${anime.image ? `public/${anime.image}` : "default-poster.jpg"}" alt="${anime.title}" loading="lazy" />
        <div class="type-label" style="background-color: ${labelColor}">${type}</div>
      </div>
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Tanggal Rilis: ${anime.release_date || "-"}</p>
        <p>Genre: ${genreText}</p>
        <p>Ditonton: ${anime.watchCount || 0}x</p>
      </div>
    `;

    animeCard.addEventListener("click", async () => {
      anime.watchCount = (anime.watchCount || 0) + 1;
      await increaseWatchCount(anime.id);
      localStorage.setItem("lastWatchedAnimeId", anime.id);
      window.location.href = `anime.html?id=${anime.id}`;
    });

    return animeCard;
  }

  async function loadServerWatchCounts() {
    await Promise.all(
      animeData.map(async (anime) => {
        try {
          const count = await getWatchCount(anime.id);
          anime.watchCount = count;
        } catch (err) {
          console.error(`Gagal mengambil watch count untuk ${anime.id}:`, err);
          anime.watchCount = 0;
        }
      })
    );
  }

  async function getWatchCount(id) {
    try {
      const response = await fetch(`https://lingering-union-0acf.bilariko2.workers.dev/api/get-watch?id=${id}`);
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      return 0;
    }
  }

  function increaseWatchCount(animeId) {
    return fetch("https://lingering-union-0acf.bilariko2.workers.dev/api/increase-watch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId }),
    });
  }

  function populateGenreOptions(animes) {
    const genres = new Set();
    animes.forEach((anime) => {
      if (Array.isArray(anime.genre)) {
        anime.genre.forEach((g) => genres.add(g));
      }
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
    currentPage = 1;
    const query = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;
    const selectedGenre = genreSelect.value;

    let filteredAnime = animeData.filter(
      (anime) =>
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


