<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$payload = $_POST;
if (!$payload) {
    $payload = request_data();
}

$curriculumId = (int) ($payload['curriculum_id'] ?? 0);

if ($curriculumId <= 0) {
    json_response(['success' => false, 'message' => 'Debes indicar la malla a eliminar.'], 422);
}

$curriculumStatement = db()->prepare('SELECT id, code, name FROM curricula WHERE id = ? LIMIT 1');
$curriculumStatement->bind_param('i', $curriculumId);
$curriculumStatement->execute();
$curriculum = $curriculumStatement->get_result()->fetch_assoc();

if (!$curriculum) {
    json_response(['success' => false, 'message' => 'Malla no encontrada.'], 404);
}

$booksStatement = db()->prepare(
    'SELECT b.id, b.file_path
     FROM books b
     INNER JOIN courses co ON co.id = b.course_id
     INNER JOIN cycles cy ON cy.id = co.cycle_id
     WHERE cy.curriculum_id = ?'
);
$booksStatement->bind_param('i', $curriculumId);
$booksStatement->execute();
$books = $booksStatement->get_result()->fetch_all(MYSQLI_ASSOC);

$absoluteFilePaths = [];
foreach ($books as $book) {
    $absoluteFilePaths[] = dirname(__DIR__) . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, (string) $book['file_path']);
}

db()->begin_transaction();

try {
    $deleteBooks = db()->prepare(
        'DELETE b FROM books b
         INNER JOIN courses co ON co.id = b.course_id
         INNER JOIN cycles cy ON cy.id = co.cycle_id
         WHERE cy.curriculum_id = ?'
    );
    $deleteBooks->bind_param('i', $curriculumId);
    $deleteBooks->execute();

    $deleteCourses = db()->prepare(
        'DELETE co FROM courses co
         INNER JOIN cycles cy ON cy.id = co.cycle_id
         WHERE cy.curriculum_id = ?'
    );
    $deleteCourses->bind_param('i', $curriculumId);
    $deleteCourses->execute();

    $deleteCycles = db()->prepare('DELETE FROM cycles WHERE curriculum_id = ?');
    $deleteCycles->bind_param('i', $curriculumId);
    $deleteCycles->execute();

    $deleteCurriculum = db()->prepare('DELETE FROM curricula WHERE id = ? LIMIT 1');
    $deleteCurriculum->bind_param('i', $curriculumId);
    $deleteCurriculum->execute();

    db()->commit();
} catch (Throwable $exception) {
    db()->rollback();
    throw $exception;
}

foreach ($absoluteFilePaths as $path) {
    if (is_file($path)) {
        unlink($path);
    }
}

json_response([
    'success' => true,
    'message' => 'Malla eliminada correctamente.',
]);
