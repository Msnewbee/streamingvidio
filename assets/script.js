document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search");
    const animeListContainer = document.getElementById("anime-list");

    let animeList = [];

    // Fetch anime data
    async function fetchAnimeList() {
        try {
            const response = await fetch("/anime-list.json"); // Ensure the correct path
            if (!response.ok) throw new Error("Gagal memuat daftar anime");
            
            animeList = await response.json();
            renderAnimeList(animeList);
        } catch (error) {
            console.error("Gagal memuat daftar anime:", error);
        }
    }

    // Render anime list
    function renderAnimeList(list) {
        animeListContainer.innerHTML = list.map(anime => `
            <div class="anime-card">
                <img src="${anime.image}" alt="${anime.title}">
                <h2>${anime.title}</h2>
            </div>
        `).join('');
    }

    // Search functionality
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        const filteredAnime = animeList.filter(anime => anime.title.toLowerCase().includes(searchText));
        renderAnimeList(filteredAnime);
    });

    // Initial data fetch
    fetchAnimeList();
});
