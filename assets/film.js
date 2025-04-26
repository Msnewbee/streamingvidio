import { films } from './assets/film-list.js'; // pastikan path-nya benar

// Ambil parameter dari URL
const urlParams = new URLSearchParams(window.location.search);
const videoTitle = urlParams.get('title');

const container = document.getElementById('video-container');

// Cari film berdasarkan title
const selectedFilm = films.find(film => film.title === decodeURIComponent(videoTitle));

if (selectedFilm) {
  // Menampilkan video jika film ditemukan
  container.innerHTML = `
    <h2>${decodeURIComponent(selectedFilm.title)}</h2>
    <video width="100%" height="auto" controls autoplay>
      <source src="${decodeURIComponent(selectedFilm.videoUrl)}" type="video/mp4">
      Browser Anda tidak mendukung video.
    </video>
  `;
} else {
  // Menampilkan pesan jika film tidak ditemukan
  container.innerHTML = `<p>Video tidak ditemukan.</p>`;
}

