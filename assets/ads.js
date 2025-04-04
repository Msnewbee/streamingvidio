// Fungsi untuk load iklan hanya ketika container sudah memiliki lebar > 0
function loadAdWhenVisible(containerId) {
    const container = document.getElementById(containerId);
    if (!container || container.getAttribute("data-ads-loaded")) return;
  
    const checkWidth = setInterval(() => {
      const width = container.offsetWidth;
      if (width && width > 0) {
        clearInterval(checkWidth);
        container.style.visibility = "visible";
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
          container.setAttribute("data-ads-loaded", "true");
        } catch (err) {
          console.warn("AdSense error:", err.message);
        }
      }
    }, 300);
  }
  
  // Jalankan setelah DOM selesai dimuat
  document.addEventListener('DOMContentLoaded', () => {
    // Load iklan sesuai ID container
    loadAdWhenVisible("ad-vinyet");
    loadAdWhenVisible("ad-multiplex");
    loadAdWhenVisible("stickyAds");
  
    // Cek jika iklan sticky sebelumnya ditutup
    if (localStorage.getItem('hideAds') === 'true') {
      const stickyAds = document.getElementById('stickyAds');
      if (stickyAds) stickyAds.style.display = 'none';
    }
  
    // Tombol untuk menutup iklan sticky
    const closeBtn = document.getElementById('closeAdsBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const stickyAds = document.getElementById('stickyAds');
        if (stickyAds) {
          stickyAds.style.display = 'none';
          localStorage.setItem('hideAds', 'true');
        }
      });
    }
  });
  
  // Tangkap semua error adsbygoogle agar tidak error di console
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('adsbygoogle')) {
      console.warn('AdSense error caught:', e.message);
    }
  }, true);
   