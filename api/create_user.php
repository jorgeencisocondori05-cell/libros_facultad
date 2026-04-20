<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$payload = $_POST;
if (!$payload) {
    $payload = request_data();
}

$fullName = trim((string) ($payload['full_name'] ?? ''));
$username = trim((string) ($payload['username'] ?? ''));
$email = trim((string) ($payload['email'] ?? ''));
$password = trim((string) ($payload['password'] ?? ''));
$role = trim((string) ($payload['role'] ?? 'docente'));

if ($fullName === '' || $username === '' || $password === '') {
    json_response(['success' => false, 'message' => 'Completa nombre, usuario y contraseña.'], 422);
}

if (!in_array($role, ['docente', 'admin'], true)) {
    json_response(['success' => false, 'message' => 'Rol inválido.'], 422);
}

$roleStatement = db()->prepare('SELECT id FROM roles WHERE slug = ? LIMIT 1');
$roleStatement->bind_param('s', $role);
$roleStatement->execute();
$roleRow = $roleStatement->get_result()->fetch_assoc();

if (!$roleRow) {
    json_response(['success' => false, 'message' => 'El rol no existe.'], 404);
}

$checkUser = db()->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$checkUser->bind_param('s', $username);
$checkUser->execute();

if ($checkUser->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'El usuario ya existe.'], 409);
}

$passwordHash = hash('sha256', $password);

$statement = db()->prepare(
    'INSERT INTO users (role_id, full_name, username, email, password_hash)
     VALUES (?, ?, ?, ?, ?)'
);
$roleId = (int) $roleRow['id'];
$statement->bind_param('issss', $roleId, $fullName, $username, $email, $passwordHash);
$statement->execute();

json_response([
    'success' => true,
    'message' => 'Usuario creado correctamente.',
    'data' => ['id' => db()->insert_id],
]);
