<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$payload = $_POST;
if (!$payload) {
    $payload = request_data();
}

$name = trim((string) ($payload['name'] ?? ''));
$year = trim((string) ($payload['year'] ?? ''));

if ($name === '' || $year === '') {
    json_response(['success' => false, 'message' => 'Completa el nombre y el año de la malla.'], 422);
}

$year = preg_replace('/[^0-9]/', '', $year) ?? '';
if ($year === '') {
    json_response(['success' => false, 'message' => 'El año de la malla debe ser numérico.'], 422);
}

$displayName = trim($name . ' ' . $year);
$code = normalize_upload_name($displayName);

$check = db()->prepare('SELECT id FROM curricula WHERE code = ? LIMIT 1');
$check->bind_param('s', $code);
$check->execute();
if ($check->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'Ya existe una malla con ese nombre o año.'], 409);
}

$insert = db()->prepare('INSERT INTO curricula (code, name) VALUES (?, ?)');
$insert->bind_param('ss', $code, $displayName);
$insert->execute();
$curriculumId = db()->insert_id;

$cycleInsert = db()->prepare(
    'INSERT INTO cycles (curriculum_id, cycle_number, label) VALUES (?, ?, ?)'
);

for ($cycleNumber = 1; $cycleNumber <= 10; $cycleNumber++) {
    $label = 'Ciclo ' . $cycleNumber;
    $cycleInsert->bind_param('iis', $curriculumId, $cycleNumber, $label);
    $cycleInsert->execute();
}

json_response([
    'success' => true,
    'message' => 'Malla curricular creada correctamente.',
    'data' => [
        'id' => $curriculumId,
        'code' => $code,
        'name' => $displayName,
    ],
]);
