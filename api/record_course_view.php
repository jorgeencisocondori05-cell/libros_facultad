<?php
require __DIR__ . '/config.php';

$courseId = (int) ($_POST['course_id'] ?? 0);

if ($courseId <= 0) {
    $payload = request_data();
    $courseId = (int) ($payload['course_id'] ?? 0);
}

if ($courseId <= 0) {
    json_response(['success' => false, 'message' => 'Debes indicar el curso.'], 422);
}

$courseViewsTable = <<<SQL
CREATE TABLE IF NOT EXISTS course_views (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_course_views_course (course_id),
    KEY idx_course_views_user (user_id),
    CONSTRAINT fk_course_views_course
        FOREIGN KEY (course_id) REFERENCES courses (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_course_views_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB
SQL;

db()->query($courseViewsTable);

$check = db()->prepare('SELECT id FROM courses WHERE id = ? LIMIT 1');
$check->bind_param('i', $courseId);
$check->execute();

if (!$check->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'Curso no encontrado.'], 404);
}

$user = current_user();
$userId = $user ? (int) $user['id'] : null;

$statement = $userId === null
    ? db()->prepare('INSERT INTO course_views (course_id, user_id) VALUES (?, NULL)')
    : db()->prepare('INSERT INTO course_views (course_id, user_id) VALUES (?, ?)');

if ($userId === null) {
    $statement->bind_param('i', $courseId);
} else {
    $statement->bind_param('ii', $courseId, $userId);
}

$statement->execute();

json_response(['success' => true, 'message' => 'Consulta registrada.']);