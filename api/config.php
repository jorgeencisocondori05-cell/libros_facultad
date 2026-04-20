<?php
declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');

const DB_HOST = '127.0.0.1';
const DB_NAME = 'libros_facultad';
const DB_USER = 'root';
const DB_PASS = '';
const UPLOAD_DIR = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'descargas';

function db(): mysqli
{
    static $connection = null;

    if ($connection instanceof mysqli) {
        return $connection;
    }

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $connection->set_charset('utf8mb4');

    return $connection;
}

function json_response(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_data(): array
{
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);

    return is_array($decoded) ? $decoded : [];
}

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function require_login(): array
{
    $user = current_user();

    if (!$user) {
        json_response(['success' => false, 'message' => 'Debes iniciar sesión.'], 401);
    }

    return $user;
}

function require_role(array $allowedRoles): array
{
    $user = require_login();

    if (!in_array($user['role'], $allowedRoles, true)) {
        json_response(['success' => false, 'message' => 'No tienes permisos para esta acción.'], 403);
    }

    return $user;
}

function normalize_upload_name(string $name): string
{
    $baseName = pathinfo($name, PATHINFO_FILENAME);
    $baseName = preg_replace('/[^A-Za-z0-9_-]+/', '-', $baseName) ?? 'archivo';
    $baseName = trim($baseName, '-');

    return $baseName === '' ? 'archivo' : strtolower($baseName);
}

function bind_params(mysqli_stmt $statement, string $types, array $params): void
{
    if ($params === []) {
        return;
    }

    $references = [$types];

    foreach ($params as $index => $value) {
        $references[$index + 1] = &$params[$index];
    }

    call_user_func_array([$statement, 'bind_param'], $references);
}
