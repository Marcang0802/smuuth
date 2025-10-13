<?php
session_start();
include 'db.php';
$pdo = getPDO();
// Hardcoded testing, I'll get to this soon
$_SESSION['user_id'] = 3;
$_SESSION['role'] = 'admin';

if ($_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit;
}

$required = ['eventName', 'manpower', 'startDatetime', 'endDatetime'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "$field is required"]);
        exit;
    }
}

$requirementTags = isset($_POST['qualifications']) && $_POST['qualifications'] !== ''
    ? json_encode(array_map('trim', explode(',', $_POST['qualifications'])))
    : null;

$stmt = $pdo->prepare("
    INSERT INTO event (
        title, description, organiser_user_id, location_name,
        start_datetime, end_datetime, required_pax, reward_amount, requirement_tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $_POST['eventName'],
    $_POST['eventDescription'] ?? '',
    $_SESSION['user_id'],
    $_POST['eventLocation'] ?? '',
    $_POST['startDatetime'],
    $_POST['endDatetime'],
    $_POST['manpower'],
    $_POST['rewardPoints'] ?? 50,
    $requirementTags
]);

echo json_encode(['success' => true, 'event_id' => $pdo->lastInsertId()]);
?>
