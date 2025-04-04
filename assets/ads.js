document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi dasar AdSense (parameter tambahan opsional)
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
    
    // Inisialisasi iklan Multipleks (langsung ditampilkan)
    const multiplexAd = document.getElementById('ad-multiplex');
    if (multiplexAd) {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // Tampilkan Iklan Vinyet (Interstitial) setelah delay (misalnya 5 detik)
    setTimeout(() => {
      const vinyetAd = document.getElementById('ad-vinyet');
      if (vinyetAd) {
        vinyetAd.style.display = 'block';
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    }, 5000);
    
    // Inisialisasi Sticky Ads jika masih ditampilkan
    const stickyAds = document.getElementById('stickyAds');
    if (stickyAds && stickyAds.style.display !== 'none') {
      (adsbygoogle = window.adsbygoogle || []).push({});
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
  