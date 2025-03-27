import { fetchAnimeList } from "./anime.js";

// Modern Browser Feature Detection
function checkBrowserFeatures() {
    const features = {
        storage: 'localStorage' in window,
        fetch: 'fetch' in window,
        promises: 'Promise' in window,
        intersectionObserver: 'IntersectionObserver' in window
    };
    
    if (!features.storage) console.error('Browser tidak mendukung localStorage');
    if (!features.fetch) console.error('Browser tidak mendukung Fetch API');
    
    return features;
}

// Event Delegation for better performance
function setupEventDelegation() {
    document.body.addEventListener('input', function(e) {
        if (e.target.id === 'search-anime') {
            filterAnime();
        }
    });

    document.body.addEventListener('change', function(e) {
        if (e.target.id === 'sort-anime' || e.target.id === 'genre-anime') {
            filterAnime();
        }
    });
}

// Main initialization
document.addEventListener("DOMContentLoaded", async function () {
    const browserFeatures = checkBrowserFeatures();
    if (!browserFeatures.storage || !browserFeatures.fetch) {
        alert('Browser Anda tidak mendukung beberapa fitur penting. Silakan update browser.');
        return;
    }

    setupEventDelegation();

    const searchInput = document.getElementById("search-anime");
    const sortSelect = document.getElementById("sort-anime");
    const genreSelect = document.getElementById("genre-anime");
    const animeListContainer = document.getElementById("anime-list");

    let animeData = [];

    try {
        animeData = await fetchAnimeList();
        populateGenreOptions(animeData);
        loadWatchCounts();
        displayAnime(animeData);
    } catch (error) {
        console.error("Error:", error);
        animeListContainer.innerHTML = '<p class="error">Gagal memuat data anime. Silakan refresh halaman.</p>';
    }

    function displayAnime(animes) {
        animeListContainer.innerHTML = "";
        
        if (animes.length === 0) {
            animeListContainer.innerHTML = '<p class="no-results">Tidak ada anime yang ditemukan.</p>';
            return;
        }

        animes.forEach((anime) => {
            const animeCard = document.createElement("div");
            animeCard.classList.add("anime-card");
            animeCard.setAttribute("data-anime-id", anime.id);

            animeCard.innerHTML = `
                <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}" 
                     alt="${anime.title}" 
                     loading="lazy">
                <div class="card-content">
                    <h3>${anime.title}</h3>
                    <p>Tanggal Rilis: ${anime.release_date}</p>
                    <p>Genre: ${anime.genre.join(', ')}</p>
                    <p>Ditonton: ${getWatchCount(anime.id)}x</p>
                </div>
            `;

            animeListContainer.appendChild(animeCard);
        });
    }

    function loadWatchCounts() {
        animeData.forEach(anime => {
            anime.watchCount = getWatchCount(anime.id);
        });
        animeData.sort((a, b) => b.watchCount - a.watchCount);
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

    // Delegated event for anime cards
    animeListContainer.addEventListener("click", function(e) {
        const animeCard = e.target.closest('.anime-card');
        if (animeCard) {
            const animeId = animeCard.getAttribute('data-anime-id');
            increaseWatchCount(animeId);
            window.location.href = `anime.html?id=${animeId}`;
        }
    });
});

// Error handling for ads
window.addEventListener('error', function(e) {
    if (e.message.includes('adsbygoogle')) {
        console.warn('Error loading ads:', e.message);
        const stickyAds = document.getElementById('stickyAds');
        if (stickyAds) stickyAds.style.display = 'none';
    }
}, true);
