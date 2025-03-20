ddocument.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const folder = urlParams.get("folder");
    const loader = document.getElementById("loader");
    const animeInfo = document.getElementById("anime-info");
    const animeImage = document.getElementById("anime-image");
    const animeTitle = document.getElementById("anime-title");
    const animeDescription = document.getElementById("anime-description");
    const animeEpisodes = document.getElementById("anime-episodes");

    fetch("anime-list.json")
        .then(response => response.json())
        .then(data => {
            const anime = data.find(a => a.folder === folder);
            if (anime) {
                animeImage.src = anime.image;
                animeTitle.textContent = anime.title;
                animeDescription.innerHTML = `
                    <p><strong>Japanese Title:</strong> ${anime.japanese_title}</p>
                    <p><strong>Score:</strong> ${anime.score}</p>
                    <p><strong>Producers:</strong> ${anime.producers.join(", ")}</p>
                    <p><strong>Type:</strong> ${anime.type}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                    <p><strong>Total Episodes:</strong> ${anime.total_episodes}</p>
                    <p><strong>Duration:</strong> ${anime.duration}</p>
                    <p><strong>Release Date:</strong> ${anime.release_date}</p>
                    <p><strong>Studio:</strong> ${anime.studio}</p>
                    <p><strong>Genre:</strong> ${anime.genre.join(", ")}</p>
                `;
                
                animeEpisodes.innerHTML = "<h3>Episodes:</h3>";
                anime.episodes.forEach(ep => {
                    const episodeLink = document.createElement("a");
                    episodeLink.href = ep.url;
                    episodeLink.target = "_blank";
                    episodeLink.textContent = `Episode ${ep.episode}`;
                    episodeLink.classList.add("episode-link");
                    animeEpisodes.appendChild(episodeLink);
                });
                
                animeInfo.style.display = "block";
            } else {
                animeInfo.innerHTML = "<p>Anime tidak ditemukan.</p>";
            }
            loader.style.display = "none";
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
            animeInfo.innerHTML = "<p>Gagal memuat data anime.</p>";
            loader.style.display = "none";
        });
});
