<?php
require __DIR__ . '/config.php';

$cycleId = isset($_GET['cycle_id']) ? (int) $_GET['cycle_id'] : 0;
$courseId = isset($_GET['course_id']) ? (int) $_GET['course_id'] : 0;
$search = trim((string) ($_GET['search'] ?? ''));

$sql =
    'SELECT b.id, b.title, b.author, b.description, b.isbn, b.publication_year, b.file_path,
            co.name AS course_name, cy.cycle_number, cur.name AS curriculum_name,
            u.full_name AS uploaded_by_name, b.created_at
     FROM books b
     INNER JOIN courses co ON co.id = b.course_id
     INNER JOIN cycles cy ON cy.id = co.cycle_id
     INNER JOIN curricula cur ON cur.id = cy.curriculum_id
     INNER JOIN users u ON u.id = b.uploaded_by
     WHERE 1 = 1';

$types = '';
$params = [];

if ($cycleId > 0) {
    $sql .= ' AND cy.id = ?';
    $types .= 'i';
    $params[] = $cycleId;
}

if ($courseId > 0) {
    $sql .= ' AND co.id = ?';
    $types .= 'i';
    $params[] = $courseId;
}

if ($search !== '') {
    $sql .= ' AND (b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?)';
    $like = '%' . $search . '%';
    $types .= 'sss';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}

$sql .= ' ORDER BY b.created_at DESC, b.id DESC';

if ($types !== '') {
    $statement = db()->prepare($sql);
    bind_params($statement, $types, $params);
    $statement->execute();
    $rows = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $rows = db()->query($sql)->fetch_all(MYSQLI_ASSOC);
}

json_response(['success' => true, 'data' => $rows]);
