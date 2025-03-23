window.verifyAge = function () {
    const dob = document.getElementById('dob').value;
    if (!dob) {
        alert('Silakan masukkan tanggal lahir Anda.');
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

    if (age < 18) {
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    document.getElementById('age-verification').style.display = 'none';
    document.getElementById('restricted-content').style.display = 'block';
    loadFilms();
};

window.loadFilms = function () {
    const films = [
        {
            title: "Langkah kaka membantu adiknya",
            embed: "https://terabox.com/sharing/embed?surl=oEY8jxE4Tv0pJaz6d_2oYQ&resolution=1080&autoplay=true&mute=false"
        },
        {
            title: "Mengintip kaka bermain di kamar mandi",
            embed: "https://terabox.com/sharing/embed?surl=8eNwlybnhiOoLzAC__1MGw&resolution=1080&autoplay=true&mute=false"
        },
        {
            title: "Dinda bermain dengan bantal",
            embed: "https://terabox.com/sharing/embed?surl=355FHPJlwRhisnF8keIbjg&resolution=360&autoplay=true&mute=false"
        },
        {
            title: "Ibu Rere bermain dengan botol besar",
            embed: "https://terabox.com/sharing/embed?surl=OcKoQEy8pG5vTiLMr2WCMg&resolution=1080&autoplay=true&mute=false"
        }
    ];

    const filmList = document.getElementById('film-list');
    filmList.innerHTML = ''; // Prevent duplication on reload

    films.forEach(film => {
        const filmContainer = document.createElement('div');
        filmContainer.classList.add('film-item');
        filmContainer.innerHTML = `
            <h3>${film.title}</h3>
            <iframe width="100%" height="400px" src="${film.embed}" frameborder="0" allowfullscreen></iframe>
        `;
        filmList.appendChild(filmContainer);
    });
};

// Attach event listener to button
document.getElementById('verify-button').addEventListener('click', window.verifyAge);
