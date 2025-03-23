document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search");
    const searchResults = document.getElementById("search-results");
    const animeListContainer = document.getElementById("anime-list");

    let animeList = [];

    // Fungsi mengambil data anime
    async function fetchAnimeList() {
        try {
            const response = await fetch("assets/anime.json"); // Sesuaikan dengan sumber data
            animeList = await response.json();
            renderAnimeList(animeList);
        } catch (error) {
            console.error("Gagal memuat daftar anime:", error);
        }
    }

    // Fungsi untuk merender daftar anime
    function renderAnimeList(list) {
        animeListContainer.innerHTML = "";
        list.forEach(anime => {
            const card = document.createElement("div");
            card.className = "anime-card";
            
            const img = document.createElement("img");
            img.src = anime.image;
            img.alt = anime.title;

            const title = document.createElement("h2");
            title.textContent = anime.title;

            card.appendChild(img);
            card.appendChild(title);
            animeListContainer.appendChild(card);
        });
    }

    // Fungsi pencarian
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        const filteredAnime = animeList.filter(anime => anime.title.toLowerCase().includes(searchText));

        if (searchText.length > 0) {
            renderAnimeList(filteredAnime);
        } else {
            renderAnimeList(animeList);
        }
    });

    // Panggil fungsi awal
    fetchAnimeList();
});
