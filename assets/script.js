document.addEventListener("DOMContentLoaded", function () {
    fetch("anime-list.json")
        .then(response => response.json())
        .then(data => {
            const animeListContainer = document.getElementById("anime-list");
            animeListContainer.innerHTML = ""; 
            
            data.forEach(anime => {
                const animeCard = document.createElement("div");
                animeCard.classList.add("anime-card");
                animeCard.innerHTML = `
                    <div class="anime-card-content" onclick="location.href='anime.html?id=${anime.id}'">
                        <img src="${anime.image}" alt="${anime.title}" class="anime-image">
                        <h3>${anime.title}</h3>
                    </div>
                `;
                animeListContainer.appendChild(animeCard);
            });
        })
        .catch(error => console.error("Error fetching anime list:", error));
});
