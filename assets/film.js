window.verifyAge = function () {
    const dob = document.getElementById('dob').value;
    if (!dob) {
        alert('Silakan masukkan tanggal lahir Anda.');
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age >= 18) {
        document.getElementById('age-verification').style.display = 'none';
        document.getElementById('restricted-content').style.display = 'block';
        loadFilms();
    } else {
        alert('Maaf, Anda harus berusia minimal 18 tahun untuk mengakses konten ini.');
        window.location.href = 'index.html';
    }
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
