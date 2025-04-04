document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi dasar AdSense
    if (window.adsbygoogle) {
      (adsbygoogle = window.adsbygoogle || []).push({
        params: {
          ua_platform: navigator.userAgentData?.platform,
          ua_mobile: navigator.userAgentData?.mobile
        }
      });
    }
    
    // Handler untuk tombol tutup iklan sticky
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
    
    // Cek preferensi pengguna untuk menyembunyikan iklan sticky
    if (localStorage.getItem('hideAds') === 'true') {
      const stickyAds = document.getElementById('stickyAds');
      if (stickyAds) stickyAds.style.display = 'none';
    }
    
    // Tampilkan iklan vinyet (interstitial) setelah 5 detik (sesuaikan sesuai kebutuhan)
    setTimeout(() => {
      const vinyetAd = document.getElementById('ad-vinyet');
      if (vinyetAd) {
        vinyetAd.style.display = 'block';
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    }, 5000);
    
    // Inisialisasi iklan multipleks (ditampilkan langsung)
    const multiplexAd = document.getElementById('ad-multiplex');
    if (multiplexAd) {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
  
  // Error handling untuk AdSense
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('adsbygoogle')) {
      console.warn('Ad error:', e.message);
      document.querySelectorAll('.adsbygoogle').forEach(ad => {
        ad.style.display = 'none';
      });
    }
  }, true);
  