// related.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');
  const container = document.getElementById('anime-list');

  if (!file) {
    console.error('Parameter "file" tidak ditemukan di URL.');
    container.textContent = 'Data serial serupa tidak tersedia.';
    return;
  }

  let animeData;
  try {
    const res = await fetch(`./Anime/${file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    animeData = await res.json();
  } catch (err) {
    console.error('Gagal memuat:', err);
    container.textContent = 'Gagal memuat data serial serupa.';
    return;
  }

  // Render semua entries di JSON
  container.innerHTML = '';
  animeData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'anime-item';
    div.innerHTML = `
      <h3>${item.title || 'Untitled'}</h3>
      ${item.image  ? `<img src="public/${item.image}" alt="${item.title}" width="150">` : ''}
      ${item.description ? `<p>${item.description}</p>` : ''}
    `;
    container.appendChild(div);
  });
});
