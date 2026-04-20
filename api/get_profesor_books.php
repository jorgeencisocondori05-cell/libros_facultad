<?php
require __DIR__ . '/config.php';

$user = require_role(['docente', 'admin']);

$sql =
    'SELECT b.id, b.course_id, b.title, b.author, b.description, b.isbn, b.publication_year, b.file_path,
            co.name AS course_name, cy.cycle_number, b.created_at, u.full_name AS uploaded_by_name
     FROM books b
     INNER JOIN courses co ON co.id = b.course_id
     INNER JOIN cycles cy ON cy.id = co.cycle_id
     INNER JOIN users u ON u.id = b.uploaded_by';

if ($user['role'] === 'docente') {
    $sql .= ' WHERE b.uploaded_by = ? ORDER BY b.created_at DESC';
    $statement = db()->prepare($sql);
    $statement->bind_param('i', $user['id']);
    $statement->execute();
    $rows = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $sql .= ' ORDER BY b.created_at DESC';
    $rows = db()->query($sql)->fetch_all(MYSQLI_ASSOC);
}

json_response(['success' => true, 'data' => $rows]);
