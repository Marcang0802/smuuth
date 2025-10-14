<?php
session_start();
include 'db.php';

$pdo = getPDO();

$eventId = $_POST['event_id'] ?? null;
if (!$eventId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing event_id']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM event WHERE id=? AND organiser_user_id=?");
$stmt->execute([$eventId, $_SESSION['user_id']]);
$event = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$event) {
    http_response_code(403);
    echo json_encode(['error' => 'Not authorised for this event']);
    exit;
}

$apps = $pdo->prepare("SELECT user_id FROM application WHERE event_id=? AND status='accepted'");
$apps->execute([$eventId]);
$helpers = $apps->fetchAll(PDO::FETCH_COLUMN);

$points = $event['reward_amount'] ?? 0;

if (count($helpers) === 0) {
    echo json_encode(['success' => true, 'points_awarded' => $points, 'count' => 0]);
    exit;
}

try {
    $pdo->beginTransaction();

    $insertLedger = $pdo->prepare(
        "INSERT INTO points_ledger (user_id, delta, reason, event_id, created_at)
         VALUES (?, ?, ?, ?, NOW())"
    );
    $updateUser = $pdo->prepare(
        "UPDATE user SET points = points + ? WHERE id = ?"
    );
    $updateApp = $pdo->prepare(
        "UPDATE application SET status='completed' WHERE event_id=? AND user_id=?"
    );

    foreach ($helpers as $uid) {
        $insertLedger->execute([$uid, $points, 'Event completion', $eventId]);
        $updateUser->execute([$points, $uid]);
        $updateApp->execute([$eventId, $uid]);
    }

    $pdo->prepare("UPDATE event SET status='completed' WHERE id=?")->execute([$eventId]);

    $pdo->commit();

    echo json_encode(['success' => true, 'points_awarded' => $points, 'count' => count($helpers)]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
