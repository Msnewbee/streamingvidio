document.addEventListener("DOMContentLoaded", function () {
  fetch("anime-list.json")
    .then(response => response.json())
    .then(data => {
      let animeListDiv = document.getElementById("anime-list");
      let animeInfoDiv = document.getElementById("anime-info");
      let animeTitle = document.getElementById("anime-title");
      let animeImage = document.getElementById("anime-image");
      let animeJapanese = document.getElementById("anime-japanese");
      let animeScore = document.getElementById("anime-score");
      let animeProducers = document.getElementById("anime-producers");
      let animeType = document.getElementById("anime-type");
      let animeStatus = document.getElementById("anime-status");
      let animeTotalEpisodes = document.getElementById("anime-total-episodes");
      let animeDuration = document.getElementById("anime-duration");
      let animeReleaseDate = document.getElementById("anime-release-date");
      let animeStudio = document.getElementById("anime-studio");
      let animeGenre = document.getElementById("anime-genre");
      let episodeListDiv = document.getElementById("episode-list");

      data.forEach(anime => {
        let animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.innerHTML = `
          <img src="public/${anime.folder}/${anime.image}" alt="${anime.title}">
          <h3>${anime.title}</h3>
        `;

        animeCard.addEventListener("click", () => {
          animeInfoDiv.classList.remove("hidden");
          animeTitle.textContent = anime.title;
          animeImage.src = `Anime/${anime.folder}/${anime.image}`;
          animeJapanese.textContent = anime.japanese_title;
          animeScore.textContent = anime.score;
          animeProducers.textContent = anime.producers.join(", ");
          animeType.textContent = anime.type;
          animeStatus.textContent = anime.status;
          animeTotalEpisodes.textContent = anime.total_episodes;
          animeDuration.textContent = anime.duration;
          animeReleaseDate.textContent = anime.release_date;
          animeStudio.textContent = anime.studio;
          animeGenre.textContent = anime.genre.join(", ");

          episodeListDiv.innerHTML = "";
          anime.episodes.forEach(ep => {
            let episodeItem = document.createElement("a");
            episodeItem.href = ep.url;
            episodeItem.target = "_blank";
            episodeItem.classList.add("episode-link");
            episodeItem.textContent = `Episode ${ep.episode}`;
            episodeListDiv.appendChild(episodeItem);
          });
        });

        animeListDiv.appendChild(animeCard);
      });
    })
    .catch(error => console.error("Gagal memuat data:", error));
});
