<?php
require __DIR__ . '/config.php';

$curriculumId = isset($_GET['curriculum_id']) ? (int) $_GET['curriculum_id'] : 0;

$sql =
    'SELECT c.id, c.curriculum_id, c.cycle_number, c.label, cur.name AS curriculum_name
     FROM cycles c
     INNER JOIN curricula cur ON cur.id = c.curriculum_id';

if ($curriculumId > 0) {
    $sql .= ' WHERE c.curriculum_id = ?';
    $sql .= ' ORDER BY c.cycle_number';
    $statement = db()->prepare($sql);
    $statement->bind_param('i', $curriculumId);
    $statement->execute();
    $rows = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $sql .= ' ORDER BY c.curriculum_id, c.cycle_number';
    $rows = db()->query($sql)->fetch_all(MYSQLI_ASSOC);
}

json_response(['success' => true, 'data' => $rows]);