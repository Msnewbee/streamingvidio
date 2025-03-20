document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Kirim ke EmailJS
    try {
        await emailjs.send("service_0362yqr", "template_we325yk", {
            user_name: name,
            user_email: email,
            message: message
        });

        document.getElementById('response-message').textContent = "Pesan berhasil dikirim!";
        document.getElementById('response-message').style.color = "green";
        document.getElementById('response-message').style.display = "block";

        document.getElementById('contact-form').reset(); // Reset form
    } catch (error) {
        console.error('Gagal mengirim pesan:', error);
        document.getElementById('response-message').textContent = "Gagal mengirim pesan. Coba lagi nanti.";
        document.getElementById('response-message').style.color = "red";
        document.getElementById('response-message').style.display = "block";
    }
});
