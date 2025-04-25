// relat.js

// Fungsi untuk mengambil anime dari satu file JSON berdasarkan parameter "folder"
async function fetchAnimeByFolder() {
    const urlParams = new URLSearchParams(window.location.search);
    const folder = urlParams.get('folder');
  
    if (!folder) {
      console.error('Folder parameter tidak ditemukan di URL.');
      return [];
    }
  
    const path = `./Anime/${folder}.json`;
  
    try {
      const res = await fetch(path);
      if (!res.ok) {
        const text = await res.text();
        console.error(`Gagal mengambil ${path}:`, text);
        throw new Error(`Gagal mengambil data dari ${path}`);
      }
  
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error(`Respons dari ${path} bukan JSON:\n`, text);
        throw new SyntaxError(`Respons dari ${path} bukan JSON`);
      }
  
      const animeList = await res.json();
      return animeList;
    } catch (error) {
      console.error('Error fetching anime by folder:', error);
      return [];
    }
  }
  
  // Setelah halaman relat.html dibuka, jalankan
  document.addEventListener("DOMContentLoaded", async () => {
    const animeList = await fetchAnimeByFolder();
  
    if (animeList.length === 0) {
      console.log("Tidak ada anime ditemukan.");
      return;
    }
  
    const container = document.getElementById('anime-list');
    if (!container) {
      console.error('Elemen #anime-list tidak ditemukan di halaman.');
      return;
    }
  
    container.innerHTML = '';
  
    animeList.forEach(anime => {
      const div = document.createElement('div');
      div.className = 'anime-item';
      div.innerHTML = `
        <h3>${anime.title}</h3>
        <img src="public/${anime.image}" alt="${anime.title}" width="150">
      `;
      container.appendChild(div);
    });
  });
  
    
    