document.addEventListener("DOMContentLoaded", function () {
    const verifyButton = document.getElementById("verify-button");
    const ageVerification = document.getElementById("age-verification");
    const restrictedContent = document.getElementById("restricted-content");
    const verificationStatus = document.getElementById("verification-status");

    // Check if user is already verified
    if (localStorage.getItem("verified") === "true") {
        ageVerification.style.display = "none";
        restrictedContent.style.display = "block";
        loadFilms();
    }

    if (verifyButton) {
        verifyButton.addEventListener("click", function () {
            verificationStatus.style.display = "block";
            setTimeout(verifyAge, 2000); // Simulate verification delay
        });
    } else {
        console.error("Verification button not found!");
    }
});

function verifyAge() {
    localStorage.setItem("verified", "true");

    document.getElementById('age-verification').style.display = 'none';
    document.getElementById('restricted-content').style.display = 'block';

    loadFilms();
}

function loadFilms() {
    const films = [
        {
            title: "Film Dewasa 1",
            embed: "https://trusted-video-host.com/embed/video1"
        },
        {
            title: "Film Dewasa 2",
            embed: "https://trusted-video-host.com/embed/video2"
        },
        {
            title: "Film Dewasa 3",
            embed: "https://trusted-video-host.com/embed/video3"
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
        filmContainer.classList.add("film-container");

        const titleElement = document.createElement("h3");
        titleElement.textContent = film.title;
        titleElement.classList.add("film-title");

        const videoContainer = document.createElement('div');
        videoContainer.classList.add("video-container");
        videoContainer.id = `video-${index}`;
        videoContainer.style.display = "none";

        const playButton = document.createElement("button");
        playButton.textContent = "Tonton Video";
        playButton.classList.add("play-button");
        playButton.dataset.index = index;

        playButton.addEventListener("click", function () {
            toggleVideo(index, film.embed);
        });

        filmContainer.appendChild(titleElement);
        filmContainer.appendChild(playButton);
        filmContainer.appendChild(videoContainer);
        filmList.appendChild(filmContainer);
    });
}

function toggleVideo(index, embedUrl) {
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

// Function to close ads
function closeAds() {
    document.getElementById("stickyAds").style.display = "none";
}
