<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        echo "Invalid CSRF token.";
        exit;
    }

    // Validate and sanitize inputs
    $name = strip_tags(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');

    // Validate name
    if (empty($name) || strlen($name) < 2 || strlen($name) > 50) {
        header("Location: index.html?error=invalid_name");
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?error=invalid_email");
        exit;
    }

    // Validate message
    if (empty($message) || strlen($message) < 5 || strlen($message) > 1000) {
        header("Location: index.html?error=invalid_message");
        exit;
    }

    // Prepare email
    $to = "bilariko2@gmail.com";
    $subject = "Message from " . $name;
    $headers = [
        "From" => "noreply@example.com",
        "Reply-To" => $email,
        "X-Mailer" => "PHP/" . phpversion()
    ];

    // Send email
    if (mail($to, $subject, $message, $headers)) {
        header("Location: index.html?success=1");
    } else {
        header("Location: index.html?error=email_failed");
    }
    exit;
}

// Generate a new CSRF token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
?>
?>
