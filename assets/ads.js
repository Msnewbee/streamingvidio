// Inisialisasi iklan dan event handlers setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi AdSense (pastikan window.adsbygoogle ada)
    if (window.adsbygoogle) {
        (adsbygoogle = window.adsbygoogle || []).push({
            params: {
                ua_platform: navigator.userAgentData?.platform,
                ua_mobile: navigator.userAgentData?.mobile
            }
        });
    }

    // Handler untuk tombol tutup iklan
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

    // Cek preferensi pengguna untuk menyembunyikan iklan
    if (localStorage.getItem('hideAds') === 'true') {
        const stickyAds = document.getElementById('stickyAds');
        if (stickyAds) stickyAds.style.display = 'none';
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
