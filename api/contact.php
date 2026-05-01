<?php
// Telegram credentials — move to env or config outside webroot for extra security
define('TG_TOKEN',   '8744500239:AAEuLaUrZ493kOycWZU_N_VsytkcMvtsMV4');
define('TG_CHAT_ID', '8366040164');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Sanitize
$name    = mb_substr(trim($data['name']    ?? ''), 0, 100);
$phone   = mb_substr(trim($data['phone']   ?? ''), 0, 30);
$city    = mb_substr(trim($data['city']    ?? ''), 0, 50);
$message = mb_substr(trim($data['message'] ?? ''), 0, 500);

// Validate required fields
$errors = [];
if (mb_strlen($name) < 2)   $errors[] = 'name';
if (mb_strlen($phone) < 10) $errors[] = 'phone';
if (mb_strlen($city) < 2)   $errors[] = 'city';

if ($errors) {
    http_response_code(422);
    echo json_encode(['error' => 'Validation failed', 'fields' => $errors]);
    exit;
}

// Build Telegram message
$tz   = new DateTimeZone('Europe/Kiev');
$time = (new DateTime('now', $tz))->format('d.m.Y H:i');

$text = "🔔 *Нова заявка з сайту Фенікс*\n\n"
      . "👤 *Ім'я:* " . $name . "\n"
      . "📞 *Телефон:* " . $phone . "\n"
      . "📍 *Місто / відділення:* " . $city . "\n"
      . ($message ? "💬 *Повідомлення:* " . $message . "\n" : '')
      . "\n🕐 *Час:* " . $time;

$payload = [
    'chat_id'    => TG_CHAT_ID,
    'text'       => $text,
    'parse_mode' => 'Markdown',
];

$ch = curl_init('https://api.telegram.org/bot' . TG_TOKEN . '/sendMessage');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
]);

$resp     = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    error_log('Telegram curl error: ' . $curlErr);
    http_response_code(502);
    echo json_encode(['error' => 'Gateway error']);
    exit;
}

$tgResp = json_decode($resp, true);

if (!$tgResp || !$tgResp['ok']) {
    error_log('Telegram API error: ' . $resp);
    http_response_code(502);
    echo json_encode(['error' => 'Telegram error']);
    exit;
}

http_response_code(200);
echo json_encode(['ok' => true]);
