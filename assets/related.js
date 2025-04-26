// assets/related.js
document.addEventListener("DOMContentLoaded", async () => {
  // Baca parameter ?file=One_piece.json, dsb.
  const params    = new URLSearchParams(window.location.search);
  const file      = params.get('file');
  const container = document.getElementById('anime-list');

  if (!file) {
    container.textContent = 'Data serial serupa tidak tersedia.';
    return;
  }

  // Path ke JSON—gunakan encodeURIComponent agar aman
  const jsonPath = `/Anime/${encodeURIComponent(file)}`;
  console.log("Loading related JSON:", jsonPath);

  let data;
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();  // JSON harus array
  } catch (err) {
    console.error("Gagal memuat JSON:", err);
    container.textContent = 'Gagal memuat data serial serupa.';
    return;
  }

  // Kosongkan container dan render setiap item
  container.innerHTML = '';
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'anime-item';
    card.innerHTML = `
      <h3>${item.title || 'Untitled'}</h3>
      ${ item.image
         ? `<img src="public/${item.image}" alt="${item.title}" width="150">`
         : ''
      }
      ${ item.synopsis
         ? `<p>${item.synopsis.substring(0, 100)}…</p>`
         : ''
      }
      <a href="anime.html?id=${item.id}" class="btn-detail">Lihat Detail</a>
    `;
    container.appendChild(card);
  });
});
