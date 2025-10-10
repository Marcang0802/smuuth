<?php
session_start();

$eventId = $_POST['event_id'] ?? null;
if (!$eventId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event_id']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM events WHERE id=? AND organiser_user_id=?");
$stmt->execute([$eventId, $_SESSION['user_id']]);
$event = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$event) {
    http_response_code(403);
    echo json_encode(['error' => 'Not authorised for this event']);
    exit;
}

$apps = $pdo->prepare("SELECT user_id FROM applications WHERE event_id=? AND status='accepted'");
$apps->execute([$eventId]);
$helpers = $apps->fetchAll(PDO::FETCH_COLUMN);

$points = 50; // reward per helper (Currently static)
$pdo->beginTransaction();
foreach ($helpers as $uid) {
    $pdo->prepare("INSERT INTO points_ledger (user_id, delta, reason, event_id)
                    VALUES(?, ?, 'Event completion', ?)")
        ->execute([$uid, $points, $eventId]);
    $pdo->prepare("UPDATE users SET points = points + ? WHERE id=?")
        ->execute([$points, $uid]);
    $pdo->prepare("UPDATE applications SET status='completed' WHERE event_id=? AND user_id=?")
        ->execute([$eventId, $uid]);
}
$pdo->prepare("UPDATE events SET status='completed' WHERE id=?")->execute([$eventId]);
$pdo->commit();

echo json_encode(['success' => true, 'points_awarded' => $points, 'count' => count($helpers)]);
?>
