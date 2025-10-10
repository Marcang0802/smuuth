<?php
require_once '../lib/db.php';
session_start();

if ($_SESSION['role '] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$required = ['title', 'start_datetime', 'required_pax'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "$field is required"]);
        exit;
    }
}

$stmt = $pdo->prepare("
    INSERT INTO events (
    title, description, organiser_user_id, location_name, lat, lng, address,
    start_datetime, end_datetime, required_pax, reward_amount, requirement_tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $data['title'],
    $data['description'] ?? '',
    $_SESSION['user_id'],
    $data['location_name'] ?? '',
    $data['lat'] ?? null,
    $data['lng'] ?? null,
    $data['address'] ?? '',
    $data['start_datetime'],
    $data['end_datetime'] ?? null,
    $data['required_pax'],
    $data['reward_amount'] ?? 0,
    isset($data['requirement_tags']) ? json_encode($data['requirement_tags']) : null
]);

echo json_encode(['success' => true, 'event_id' => $pdo->lastInsertId()]);
?>
