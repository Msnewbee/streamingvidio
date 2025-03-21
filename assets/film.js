document.addEventListener("DOMContentLoaded", function () {
    const verifyButton = document.getElementById("verify-button");
    const ageVerification = document.getElementById("age-verification");
    const restrictedContent = document.getElementById("restricted-content");

    // Check if user is already verified
    if (sessionStorage.getItem("verified") === "true") {
        ageVerification.style.display = "none";
        restrictedContent.style.display = "block";
        loadFilms();
    }

    if (verifyButton) {
        verifyButton.addEventListener("click", verifyAge);
    } else {
        console.error("Verification button not found!");
    }
});

function verifyAge() {
    sessionStorage.setItem("verified", "true");

    document.getElementById('age-verification').style.display = 'none';
    document.getElementById('restricted-content').style.display = 'block';

    loadFilms();
}

function loadFilms() {
    const films = [
        {
            title: "Langkah kaka membantu adik nya cum",
            embed: "https://terabox.com/sharing/embed?surl=oEY8jxE4Tv0pJaz6d_2oYQ&resolution=1080&autoplay=true&mute=false&uk=81366251617206&fid=843976327435458&slid="
        },
        {
            title: "Cewe cantik Ini bermain sendirian di kamar mandi",
            embed: "https://terabox.com/sharing/embed?surl=8eNwlybnhiOoLzAC__1MGw&resolution=1080&autoplay=true&mute=false&uk=81366251617206&fid=1017568112374262&slid="
        },
        {
            title: "Dinda bermain dengan bantal",
            embed: "https://terabox.com/sharing/embed?surl=355FHPJlwRhisnF8keIbjg&resolution=360&autoplay=true&mute=false&uk=81366251617206&fid=65017207422990&slid="
        },
        {
            title: "Mengintip kaka nya bermain di kamar mandi",
            embed: "https://terabox.com/sharing/embed?surl=OcKoQEy8pG5vTiLMr2WCMg&resolution=1080&autoplay=true&mute=false&uk=81366251617206&fid=732675653952914&slid="
        }
    ];

    const filmList = document.getElementById('film-list');
    if (!filmList) {
        console.error("Element #film-list not found!");
        return;
    }
    filmList.innerHTML = ""; 

    films.forEach((film, index) => {
        const filmContainer = document.createElement('div');

        const titleElement = document.createElement("p");
        titleElement.classList.add("film-item");
        titleElement.textContent = film.title;
        titleElement.dataset.index = index;

        const videoContainer = document.createElement('div');
        videoContainer.classList.add("video-container");
        videoContainer.id = `video-${index}`;

        filmContainer.appendChild(titleElement);
        filmContainer.appendChild(videoContainer);
        filmList.appendChild(filmContainer);

        titleElement.addEventListener("click", function () {
            showVideo(index, film.embed);
        });
    });
}

function showVideo(index, embedUrl) {
    const videoContainer = document.getElementById(`video-${index}`);
    
    if (videoContainer.innerHTML === "") {
        const iframe = document.createElement("iframe");
        iframe.width = "100%";
        iframe.height = "400px";
        iframe.src = embedUrl;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;

        videoContainer.appendChild(iframe);
        videoContainer.style.display = "block";
    } else {
        videoContainer.innerHTML = "";
        videoContainer.style.display = "none";
    }
}
