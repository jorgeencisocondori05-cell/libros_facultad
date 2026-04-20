<?php
require __DIR__ . '/config.php';

$user = require_role(['admin']);

$payload = $_POST;
if (!$payload) {
	$payload = request_data();
}

$userId = (int) ($payload['user_id'] ?? 0);

if ($userId <= 0) {
	json_response(['success' => false, 'message' => 'Debes indicar el usuario a eliminar.'], 422);
}

if ($userId === (int) $user['id']) {
	json_response(['success' => false, 'message' => 'No puedes eliminar tu propia sesión.'], 422);
}

$statement = db()->prepare('SELECT id, username FROM users WHERE id = ? LIMIT 1');
$statement->bind_param('i', $userId);
$statement->execute();

if (!$statement->get_result()->fetch_assoc()) {
	json_response(['success' => false, 'message' => 'Usuario no encontrado.'], 404);
}

$delete = db()->prepare('DELETE FROM users WHERE id = ? LIMIT 1');
$delete->bind_param('i', $userId);
$delete->execute();

json_response(['success' => true, 'message' => 'Usuario eliminado correctamente.']);
