<?php
require __DIR__ . '/config.php';

$user = require_role(['docente', 'admin']);

$title = trim((string) ($_POST['title'] ?? ''));
$author = trim((string) ($_POST['author'] ?? ''));
$courseId = (int) ($_POST['course_id'] ?? 0);
$description = trim((string) ($_POST['description'] ?? ''));
$isbn = trim((string) ($_POST['isbn'] ?? ''));
$publicationYear = (int) ($_POST['publication_year'] ?? 0);
$yearValue = $publicationYear > 0 ? $publicationYear : null;
$uploaderId = (int) $user['id'];

if ($title === '' || $author === '' || $courseId <= 0) {
    json_response(['success' => false, 'message' => 'Faltan datos obligatorios.'], 422);
}

$courseStatement = db()->prepare('SELECT id FROM courses WHERE id = ? AND active = 1 LIMIT 1');
$courseStatement->bind_param('i', $courseId);
$courseStatement->execute();

if (!$courseStatement->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'El curso indicado no existe.'], 404);
}

if (!isset($_FILES['book_file']) || $_FILES['book_file']['error'] !== UPLOAD_ERR_OK) {
    json_response(['success' => false, 'message' => 'Debes subir un archivo PDF.'], 422);
}

$uploadedFile = $_FILES['book_file'];
$originalName = (string) $uploadedFile['name'];
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if ($extension !== 'pdf') {
    json_response(['success' => false, 'message' => 'Solo se permiten archivos PDF.'], 422);
}

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}

$fileBase = normalize_upload_name($originalName);
$fileName = $fileBase . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.pdf';
$destination = UPLOAD_DIR . DIRECTORY_SEPARATOR . $fileName;

if (!move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
    json_response(['success' => false, 'message' => 'No se pudo guardar el archivo.'], 500);
}

$relativePath = 'descargas/' . $fileName;

$statement = db()->prepare(
    'INSERT INTO books (course_id, uploaded_by, title, author, description, isbn, publication_year, file_name, file_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$statement->bind_param(
    'iissssiss',
    $courseId,
    $uploaderId,
    $title,
    $author,
    $description,
    $isbn,
    $yearValue,
    $fileName,
    $relativePath
);
$statement->execute();

json_response([
    'success' => true,
    'message' => 'Libro cargado correctamente.',
    'data' => ['id' => db()->insert_id, 'file_path' => $relativePath],
]);
