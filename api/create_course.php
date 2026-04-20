<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$payload = $_POST;
if (!$payload) {
    $payload = request_data();
}

$cycleId = (int) ($payload['cycle_id'] ?? 0);
$name = trim((string) ($payload['name'] ?? ''));
$orderInCycle = (int) ($payload['order_in_cycle'] ?? 1);

if ($cycleId <= 0 || $name === '') {
    json_response(['success' => false, 'message' => 'Completa el ciclo y el nombre del curso.'], 422);
}

$cycleCheck = db()->prepare('SELECT id FROM cycles WHERE id = ? LIMIT 1');
$cycleCheck->bind_param('i', $cycleId);
$cycleCheck->execute();
if (!$cycleCheck->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'El ciclo indicado no existe.'], 404);
}

$slug = normalize_upload_name($name . '-' . $cycleId);
$check = db()->prepare('SELECT id FROM courses WHERE slug = ? LIMIT 1');
$check->bind_param('s', $slug);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'Ya existe un curso con ese nombre en ese ciclo.'], 409);
}

if ($orderInCycle <= 0) {
    $orderInCycle = 1;
}

$statement = db()->prepare(
    'INSERT INTO courses (cycle_id, name, slug, order_in_cycle)
     VALUES (?, ?, ?, ?)'
);
$statement->bind_param('issi', $cycleId, $name, $slug, $orderInCycle);
$statement->execute();

json_response([
    'success' => true,
    'message' => 'Curso creado correctamente.',
    'data' => [
        'id' => db()->insert_id,
        'slug' => $slug,
    ],
]);
