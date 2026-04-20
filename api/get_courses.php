<?php
require __DIR__ . '/config.php';

$cycleId = isset($_GET['cycle_id']) ? (int) $_GET['cycle_id'] : 0;

$sql =
    'SELECT co.id, co.cycle_id, co.name, co.slug, co.order_in_cycle, cy.cycle_number, cur.name AS curriculum_name
     FROM courses co
     INNER JOIN cycles cy ON cy.id = co.cycle_id
     INNER JOIN curricula cur ON cur.id = cy.curriculum_id';

if ($cycleId > 0) {
    $sql .= ' WHERE co.cycle_id = ?';
    $sql .= ' ORDER BY co.order_in_cycle, co.name';
    $statement = db()->prepare($sql);
    $statement->bind_param('i', $cycleId);
    $statement->execute();
    $rows = $statement->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $sql .= ' ORDER BY cy.cycle_number, co.order_in_cycle, co.name';
    $rows = db()->query($sql)->fetch_all(MYSQLI_ASSOC);
}

json_response(['success' => true, 'data' => $rows]);
