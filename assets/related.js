// assets/related.js

document.addEventListener("DOMContentLoaded", async () => {
  const params    = new URLSearchParams(window.location.search);
  const file      = params.get('file');               // e.g. "One_piece.json"
  const container = document.getElementById('anime-list');

  if (!file) {
    container.textContent = 'Data serial serupa tidak tersedia.';
    return;
  }

  // 1) Fetch JSON
  let animeData;
  try {
    const res = await fetch(`./Anime/${encodeURIComponent(file)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    animeData = await res.json();  // seharusnya array
  } catch (err) {
    console.error("Gagal memuat JSON:", err);
    container.textContent = 'Gagal memuat data serial serupa.';
    return;
  }

  // 2) Load watch counts dari server
  await Promise.all(animeData.map(async (a) => {
    try {
      a.watchCount = await getWatchCount(a.id);
    } catch {
      a.watchCount = 0;
    }
  }));

  // 3) Render semua kartu
  container.innerHTML = '';
  animeData.forEach(anime => {
    const card = createAnimeCard(anime);
    container.appendChild(card);
  });
});

// Buat satu kartu anime persis seperti di index.html
function createAnimeCard(anime) {
  const card = document.createElement("div");
  card.classList.add("anime-card");

  const type = anime.type?.toUpperCase() || "TV";
  let labelColor = "#3498db";
  if (type === "OVA")     labelColor = "#e74c3c";
  else if (type === "MOVIE")  labelColor = "#f1c40f";
  else if (type === "SPECIAL") labelColor = "#9b59b6";

  const genreText = Array.isArray(anime.genre)
    ? anime.genre.join(', ')
    : '-';

  card.innerHTML = `
    <div class="image-container">
      <img src="${anime.image ? `public/${anime.image}` : 'default-poster.jpg'}"
           alt="${anime.title}" loading="lazy" />
      <div class="type-label" style="background-color: ${labelColor}">
        ${type}
      </div>
    </div>
    <div class="card-content">
      <h3>${anime.title}</h3>
      <p>Tanggal Rilis: ${anime.release_date || '-'}</p>
      <p>Genre: ${genreText}</p>
      <p>Ditonton: ${anime.watchCount || 0}x</p>
    </div>
  `;

  // Klik kartu: hitung + navigasi
  card.addEventListener("click", async () => {
    anime.watchCount = (anime.watchCount || 0) + 1;
    await increaseWatchCount(anime.id);
    window.location.href = `anime.html?id=${anime.id}`;
  });

  return card;
}

// Ambil watch count dari server
async function getWatchCount(id) {
  try {
    const res  = await fetch(`https://lingering-union-0acf.bilariko2.workers.dev/api/get-watch?id=${id}`);
    const json = await res.json();
    return json.count || 0;
  } catch {
    return 0;
  }
}

// Kirim increment watch count
function increaseWatchCount(animeId) {
  return fetch("https://lingering-union-0acf.bilariko2.workers.dev/api/increase-watch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ animeId })
  });
}
