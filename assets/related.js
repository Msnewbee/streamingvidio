// assets/related.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const folder = params.get('folder');  // misal "one_piece"
  const container = document.getElementById('anime-list');

  if (!folder) {
    container.textContent = 'Data serial serupa tidak tersedia.';
    return;
  }

  // Gunakan path absolut agar pasti ke root
  const jsonPath = `/Anime/${folder}.json`;
  console.log("Mencoba load:", jsonPath);

  let data;
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // kalau bukan JSON valid, akan throw
    data = await res.json();
  } catch (err) {
    console.error("Gagal memuat JSON:", err);
    container.textContent = 'Gagal memuat data serial serupa.';
    return;
  }

  // Render array dari JSON
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
    `;
    container.appendChild(card);
  });
});

