import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('anime-list');
    container.innerHTML = '<p>Memuat daftar anime...</p>'; // Placeholder loading

    try {
        const animeList = await fetchAnimeList();

        // Hapus placeholder setelah data dimuat
        container.innerHTML = '';

        // Jika data kosong, tampilkan pesan
        if (!animeList || animeList.length === 0) {
            container.innerHTML = '<p>Tidak ada anime yang tersedia.</p>';
            return;
        }

        animeList.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';

            const img = document.createElement('img');
            img.src = `public/${anime.image}`;
            img.alt = anime.title;
            img.onerror = () => img.src = 'default-poster.jpg'; // Gambar default jika tidak tersedia

            const title = document.createElement('h2');
            title.textContent = anime.title;

            card.appendChild(img);
            card.appendChild(title);

            card.addEventListener('click', () => {
                window.location.href = `anime.html?id=${anime.id}`;
            });

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Gagal memuat daftar anime:', error);
        container.innerHTML = '<p>Gagal memuat daftar anime. Silakan coba lagi nanti.</p>';
    }
});
