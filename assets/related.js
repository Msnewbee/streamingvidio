// related.js
// Setelah di-rename dari relat.js, simpan sebagai assets/related.js
document.addEventListener("DOMContentLoaded", async () => {
  // Ambil parameter file dari URL, misal: file=One_piece.json
  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');
  if (!file) {
      console.error('Parameter "file" tidak ditemukan.');
      document.getElementById('anime-list').textContent = 'Data tidak tersedia.';
      return;
  }

  // Fetch JSON
  let animeData = [];
  try {
      const res = await fetch(`./Anime/${file}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      animeData = await res.json();
  } catch (err) {
      console.error('Gagal memuat:', err);
      document.getElementById('anime-list').textContent = 'Gagal memuat data.';
      return;
  }

  // Render semua entri di JSON
  const container = document.getElementById('anime-list');
  container.innerHTML = '';
  animeData.forEach(item => {
      const div = document.createElement('div');
      div.className = 'anime-item';
      div.innerHTML = `
          <h3>${item.title || '–'}</h3>
          ${item.image ? `<img src="public/${item.image}" alt="${item.title}" width="150">` : ''}
          ${item.description ? `<p>${item.description}</p>` : ''}
      `;
      container.appendChild(div);
  });
});

  
    
    