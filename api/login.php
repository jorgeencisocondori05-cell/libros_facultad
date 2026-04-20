<?php
require __DIR__ . '/config.php';

$payload = $_POST;

if (!$payload) {
    $payload = request_data();
}

$username = trim((string) ($payload['username'] ?? ''));
$password = trim((string) ($payload['password'] ?? ''));
$role = trim((string) ($payload['role'] ?? ''));

if ($username === '' || $password === '' || $role === '') {
    json_response(['success' => false, 'message' => 'Completa usuario, contraseña y tipo de acceso.'], 422);
}

$allowedRoles = ['docente', 'admin'];
if (!in_array($role, $allowedRoles, true)) {
    json_response(['success' => false, 'message' => 'Tipo de acceso inválido.'], 422);
}

$passwordHash = hash('sha256', $password);

$statement = db()->prepare(
    'SELECT u.id, u.full_name, u.username, u.email, r.slug AS role
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE u.username = ? AND u.password_hash = ? AND r.slug = ? AND u.active = 1
     LIMIT 1'
);
$statement->bind_param('sss', $username, $passwordHash, $role);
$statement->execute();
$user = $statement->get_result()->fetch_assoc();

if (!$user) {
    json_response(['success' => false, 'message' => 'Usuario o contraseña incorrectos.'], 401);
}

$_SESSION['user'] = [
    'id' => (int) $user['id'],
    'full_name' => $user['full_name'],
    'username' => $user['username'],
    'email' => $user['email'],
    'role' => $user['role'],
];

json_response([
    'success' => true,
    'message' => 'Inicio de sesión correcto.',
    'user' => $_SESSION['user'],
]);
