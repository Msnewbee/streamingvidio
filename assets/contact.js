document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const responseMessage = document.getElementById('response-message');
    const submitButton = document.querySelector("#contact-form button[type='submit']");

    // Reset previous messages
    responseMessage.style.display = "none";

    // Basic validation
    if (!name || !email || !message) {
        showMessage("Semua kolom harus diisi!", "red");
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        showMessage("Format email tidak valid!", "red");
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Mengirim...";

    try {
        // Send data to EmailJS
        await emailjs.send("service_0362yqr", "template_we325yk", {
            user_name: name,
            user_email: email,
            message: message
        });

        showMessage("Pesan berhasil dikirim!", "green");
        document.getElementById('contact-form').reset(); // Reset form
    } catch (error) {
        console.error('Gagal mengirim pesan:', error);
        showMessage("Gagal mengirim pesan. Coba lagi nanti.", "red");
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = "Kirim Pesan";
    }
});

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show response messages
function showMessage(text, color) {
    const responseMessage = document.getElementById('response-message');
    responseMessage.textContent = text;
    responseMessage.style.color = color;
    responseMessage.style.display = "block";
}
