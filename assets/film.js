document.addEventListener("DOMContentLoaded", function () {
    const verifyButton = document.getElementById("verify-button");
    const ageVerification = document.getElementById("age-verification");
    const restrictedContent = document.getElementById("restricted-content");

    // Cek jika pengguna sudah diverifikasi sebelumnya
    if (sessionStorage.getItem("verified") === "true") {
        ageVerification.style.display = "none";
        restrictedContent.style.display = "block";
        loadFilms();
    }

    if (verifyButton) {
        verifyButton.addEventListener("click", verifyAge);
    } else {
        console.error("Tombol verifikasi tidak ditemukan!");
    }

    // Nonaktifkan event sensor (menghindari error devicemotion)
    window.removeEventListener("devicemotion", () => {});
    window.removeEventListener("deviceorientation", () => {});
});

function verifyAge() {
    // Simpan status verifikasi
    sessionStorage.setItem("verified", "true");

    // Sembunyikan form verifikasi dan tampilkan konten
    document.getElementById('age-verification').style.display = 'none';
    document.getElementById('restricted-content').style.display = 'block';

    loadFilms();
}

function loadFilms() {
    const films = [
        {
            title: "Film 1",
            embed: "https://terabox.com/sharing/embed?surl=oEY8jxE4Tv0pJaz6d_2oYQ&resolution=1080&autoplay=true&mute=false&uk=81366251617206&fid=843976327435458&slid="
        },
        {
            title: "Film 2",
            embed: "https://terabox.com/sharing/embed?surl=8eNwlybnhiOoLzAC__1MGw&resolution=1080&autoplay=true&mute=false&uk=81366251617206&fid=1017568112374262&slid="
        }
    ];

    const filmList = document.getElementById('film-list');
    filmList.innerHTML = ""; // Bersihkan daftar sebelumnya

    films.forEach(film => {
        const filmContainer = document.createElement('div');
        filmContainer.classList.add('film-item');
        filmContainer.innerHTML = `
            <h3>${film.title}</h3>
            <iframe width="100%" height="400px" src="${film.embed}" frameborder="0" allowfullscreen></iframe>
        `;
        filmList.appendChild(filmContainer);
    });
}
