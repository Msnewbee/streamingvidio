document.addEventListener("DOMContentLoaded", function () {
    // Pastikan elemen HTML ada sebelum menjalankan kode
    const verifyButton = document.getElementById("verify-button");
    
    if (verifyButton) {
        verifyButton.addEventListener("click", verifyAge);
    } else {
        console.error("Tombol verifikasi tidak ditemukan!");
    }
});

function verifyAge() {
    const dob = document.getElementById('dob').value;
    if (!dob) {
        alert('Silakan masukkan tanggal lahir Anda.');
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

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
}

function loadFilms() {
    const films = [
        {
            title: "Film Dewasa 1",
            embed: "https://terabox.com/sharing/embed?surl=oEY8jxE4Tv0pJaz6d_2oYQ&resolution=1080&autoplay=true&mute=false&uk=81366251617206&fid=843976327435458&slid="
        },
        {
            title: "Film Dewasa 2",
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
