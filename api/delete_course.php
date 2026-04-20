<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$payload = $_POST;
if (!$payload) {
    $payload = request_data();
}

$courseId = (int) ($payload['course_id'] ?? 0);

if ($courseId <= 0) {
    json_response(['success' => false, 'message' => 'Debes indicar el curso a eliminar.'], 422);
}

$courseCheck = db()->prepare('SELECT id, name FROM courses WHERE id = ? LIMIT 1');
$courseCheck->bind_param('i', $courseId);
$courseCheck->execute();
$course = $courseCheck->get_result()->fetch_assoc();

if (!$course) {
    json_response(['success' => false, 'message' => 'Curso no encontrado.'], 404);
}

$booksCount = db()->prepare('SELECT COUNT(*) AS total FROM books WHERE course_id = ?');
$booksCount->bind_param('i', $courseId);
$booksCount->execute();
$totalBooks = (int) ($booksCount->get_result()->fetch_assoc()['total'] ?? 0);

if ($totalBooks > 0) {
    json_response(['success' => false, 'message' => 'No puedes eliminar este curso porque tiene libros asociados.'], 409);
}

$delete = db()->prepare('DELETE FROM courses WHERE id = ? LIMIT 1');
$delete->bind_param('i', $courseId);
$delete->execute();

json_response(['success' => true, 'message' => 'Curso eliminado correctamente.']);
