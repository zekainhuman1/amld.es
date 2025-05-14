<?php
// Виводити помилки в процесі розробки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Увімкнути логування помилок у файл
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

// Cloudflare Turnstile секретний ключ
$turnstileSecret = 'REMOVED'; // ← заміни на свій реальний секретний ключ

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 1. Перевірка наявності токена
    $token = $_POST['cf-turnstile-response'] ?? '';
    if (!$token) {
        error_log("Turnstile token is missing.");
        echo json_encode(["success" => false, "error" => "Verification failed. Please try again."]);
        exit;
    }

    // 2. Перевірка токена через Cloudflare API
    $verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $verifyData = http_build_query([
        'secret'   => $turnstileSecret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ]);

    $verifyOptions = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-type: application/x-www-form-urlencoded",
            'content' => $verifyData
        ]
    ];

    $verifyContext = stream_context_create($verifyOptions);
    $verifyResponse = file_get_contents($verifyUrl, false, $verifyContext);
    $verificationResult = json_decode($verifyResponse, true);

    if (!isset($verificationResult['success']) || !$verificationResult['success']) {
        error_log("Turnstile verification failed: " . json_encode($verificationResult));
        echo json_encode(["success" => false, "error" => "Bot verification failed."]);
        exit;
    }

    // 3. Отримання даних з форми
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $messageText = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Проста перевірка обов'язкових полів
    if ($name === '' || ($email === '' && $phone === '')) {
        error_log("Missing required fields: name=[$name], email=[$email], phone=[$phone]");
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    // Honeypot перевірка
    if (!empty($_POST['website'])) {
        echo json_encode(['success' => false, 'error' => 'Spam detected.']);
        exit;
    }

    // 4. Надсилання email
    $to = "info@amld.es";  // ← заміни на свою пошту
    $subject = "New Contact Form Submission";
    $message = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$messageText";
    $headers = "From: noreply@amld.es\r\n";
    if ($email !== '') {
        $headers .= "Reply-To: $email\r\n";
    }

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["success" => true]);
    } else {
        error_log("Mail function failed. To: $to | Subject: $subject | Message: $message");
        echo json_encode(["success" => false, "error" => "Mail function failed"]);
    }
} else {
    error_log("Invalid request method: " . $_SERVER["REQUEST_METHOD"]);
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
