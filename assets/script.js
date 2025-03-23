import { fetchAnimeList } from './anime.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('anime-list');
    const searchInput = document.getElementById('search');
    
    container.innerHTML = '<p>Memuat daftar anime...</p>'; // Placeholder loading

    try {
        const animeList = await fetchAnimeList();

        // Hapus placeholder setelah data dimuat
        container.innerHTML = '';

        if (!animeList || animeList.length === 0) {
            container.innerHTML = '<p>Tidak ada anime yang tersedia.</p>';
            return;
        }

        // Menyimpan daftar anime asli untuk pencarian
        let originalAnimeList = animeList;

        // Fungsi render anime list
        function renderAnimeList(filteredList) {
            container.innerHTML = ''; // Bersihkan daftar sebelum menampilkan hasil pencarian

            filteredList.forEach(anime => {
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
        }

        // Tampilkan daftar anime pertama kali
        renderAnimeList(originalAnimeList);

        // Event listener untuk pencarian
        searchInput.addEventListener("input", function () {
            const searchText = searchInput.value.toLowerCase();
            const filteredAnime = originalAnimeList.filter(anime =>
                anime.title.toLowerCase().includes(searchText)
            );
            renderAnimeList(filteredAnime);
        });

    } catch (error) {
        console.error('Gagal memuat daftar anime:', error);
        container.innerHTML = '<p>Gagal memuat daftar anime. Silakan coba lagi nanti.</p>';
    }
});
