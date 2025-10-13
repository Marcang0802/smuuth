<?php
require_once 'db.php';
header('Content-Type: application/json');
$pdo = getPDO();

$start = $_GET['start'] ?? null; // ISO date
$end = $_GET['end'] ?? null;

$query = "SELECT id, title, description, organiser_user_id, location_name, lat, lng, address, start_datetime, end_datetime, required_pax, reward_amount, requirement_tags, status FROM event WHERE status = 'open'";

$params = [];
if ($start && $end) {
    $query .= " AND NOT (end_datetime < :start OR start_datetime > :end)";
    $params[':start'] = $start;
    $params[':end'] = $end;
}

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$events = [];
while ($row = $stmt->fetch()) {
    $events[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'start' => $row['start_datetime'],
        'end' => $row['end_datetime'] ?: null,
        'extendedProps' => [
            'description' => $row['description'],
            'location_name' => $row['location_name'],
            'address' => $row['address'],
            'lat' => $row['lat'] !== null ? (float)$row['lat'] : null,
            'lng' => $row['lng'] !== null ? (float)$row['lng'] : null,
            'required_pax' => (int)$row['required_pax'],
            'reward_amount' => (float)$row['reward_amount'],
            'requirement_tags' => $row['requirement_tags'] ? json_decode($row['requirement_tags']) : null,
            'status' => $row['status']
        ]
    ];
}

echo json_encode($events);
