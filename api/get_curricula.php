<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$result = db()->query(
    'SELECT id, code, name, active
     FROM curricula
     ORDER BY id DESC'
);

json_response(['success' => true, 'data' => $result->fetch_all(MYSQLI_ASSOC)]);
