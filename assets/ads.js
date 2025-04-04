document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi dasar AdSense (opsional: kirim parameter tambahan)
    if (window.adsbygoogle) {
      (adsbygoogle = window.adsbygoogle || []).push({
        params: {
          ua_platform: navigator.userAgentData?.platform,
          ua_mobile: navigator.userAgentData?.mobile
        }
      });
    }
    
    // Handler untuk tombol tutup pada Sticky Ads
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
    
    // Cek preferensi pengguna untuk menyembunyikan Sticky Ads
    if (localStorage.getItem('hideAds') === 'true') {
      const stickyAds = document.getElementById('stickyAds');
      if (stickyAds) stickyAds.style.display = 'none';
    }
    
    // Inisialisasi iklan Multipleks (pastikan push hanya dipanggil sekali)
    const multiplexAd = document.getElementById('ad-multiplex');
    if (multiplexAd && !multiplexAd.getAttribute("data-ads-loaded")) {
      (adsbygoogle = window.adsbygoogle || []).push({});
      multiplexAd.setAttribute("data-ads-loaded", "true");
    }
    
    // Tampilkan Iklan Vinyet (Interstitial) setelah delay (misalnya 5 detik)
    setTimeout(() => {
      const vinyetAd = document.getElementById('ad-vinyet');
      if (vinyetAd) {
        // Ganti visibility menjadi visible agar container memiliki lebar non-0
        vinyetAd.style.visibility = 'visible';
        if (!vinyetAd.getAttribute("data-ads-loaded")) {
          (adsbygoogle = window.adsbygoogle || []).push({});
          vinyetAd.setAttribute("data-ads-loaded", "true");
        }
      }
    }, 5000);
    
    // Inisialisasi Sticky Ads jika masih ditampilkan dan belum diinisialisasi
    const stickyAds = document.getElementById('stickyAds');
    if (stickyAds && stickyAds.style.display !== 'none' && !stickyAds.getAttribute("data-ads-loaded")) {
      (adsbygoogle = window.adsbygoogle || []).push({});
      stickyAds.setAttribute("data-ads-loaded", "true");
    }
  });
  
  // Error handling untuk AdSense
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('adsbygoogle')) {
      console.warn('Ad error:', e.message);
      // Sembunyikan semua elemen iklan jika terjadi error
      document.querySelectorAll('.adsbygoogle').forEach(ad => {
        ad.style.display = 'none';
      });
    }
  }, true);
   