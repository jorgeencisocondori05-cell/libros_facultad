<?php
require __DIR__ . '/config.php';

$result = db()->query(
    'SELECT
        (SELECT COUNT(*) FROM books) AS books_count,
        (SELECT COUNT(*) FROM users) AS users_count,
        (SELECT COUNT(*) FROM courses) AS courses_count,
        (SELECT COUNT(*) FROM cycles) AS cycles_count'
);

json_response(['success' => true, 'data' => $result->fetch_assoc()]);
