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
            title: "vidio di kamar mandi untuk sang pacar",
            embed: "https://cdn77-vid-mp4.others-cdn.com/mbByhg3qM83GdpyiiCZ4XQ==,1745706347/videos/mp4/8/2/7/xvideos.com_82774043ff261f43dde351cd1620e10e.mp4?ui=MTY0LjY4LjEyNC4xNDktLS9odG1sNXBsYXllci9nZXR2aWRlby9vaGtha2ZoNQ=="
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
