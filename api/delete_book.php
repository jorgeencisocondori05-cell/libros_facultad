<?php
require __DIR__ . '/config.php';

$user = require_role(['docente', 'admin']);

$payload = $_POST;
if (!$payload) {
    $payload = request_data();
}

$bookId = (int) ($payload['book_id'] ?? 0);

if ($bookId <= 0) {
    json_response(['success' => false, 'message' => 'Debes indicar el libro a eliminar.'], 422);
}

$statement = db()->prepare('SELECT id, uploaded_by, file_path FROM books WHERE id = ? LIMIT 1');
$statement->bind_param('i', $bookId);
$statement->execute();
$book = $statement->get_result()->fetch_assoc();

if (!$book) {
    json_response(['success' => false, 'message' => 'Libro no encontrado.'], 404);
}

if ($user['role'] === 'docente' && (int) $book['uploaded_by'] !== (int) $user['id']) {
    json_response(['success' => false, 'message' => 'Solo puedes eliminar tus propios libros.'], 403);
}

$delete = db()->prepare('DELETE FROM books WHERE id = ? LIMIT 1');
$delete->bind_param('i', $bookId);
$delete->execute();

$absolutePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, (string) $book['file_path']);
if (is_file($absolutePath)) {
    unlink($absolutePath);
}

json_response(['success' => true, 'message' => 'Libro eliminado correctamente.']);
