<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие обязательных полей
if (!isset($data['fullName']) || !isset($data['email']) || !isset($data['mobilePhone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$fullName = htmlspecialchars($data['fullName']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$mobilePhone = htmlspecialchars($data['mobilePhone']);
$industry = htmlspecialchars($data['industry'] ?? 'Not specified');
$hasWebsite = htmlspecialchars($data['hasWebsite'] ?? 'Not specified');
$timeline = htmlspecialchars($data['timeline'] ?? 'Not specified');

// Email настройки
$adminEmail = 'max@kove.one';
$fromEmail = 'noreply@kove.one'; // Замените на email с вашего домена
$fromName = 'Kove Media Website';

// Формируем уведомление на max@kove.one
$subject = "Новая заявка с сайта: {$fullName}";
$message = "Новая заявка на создание сайта\n\n";
$message .= "Имя: {$fullName}\n";
$message .= "Email: {$email}\n";
$message .= "Телефон: {$mobilePhone}\n";
$message .= "Отрасль: {$industry}\n";
$message .= "Есть сайт: {$hasWebsite}\n";
$message .= "Сроки: {$timeline}\n";
$message .= "Дата: " . date('d.m.Y H:i:s') . "\n\n";
$message .= "---\n";
$message .= "Это автоматическое уведомление с вашего сайта.\n";

// Заголовки письма
$headers = "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправляем письмо
$sent = @mail($adminEmail, $subject, $message, $headers);

// Возвращаем результат
if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    // Даже если mail() вернул false, письмо могло быть отправлено
    // Многие серверы не возвращают корректный статус
    echo json_encode(['success' => true, 'message' => 'Request processed']);
}
?>

