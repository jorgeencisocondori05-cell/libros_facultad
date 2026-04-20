<?php
require __DIR__ . '/config.php';

$bookId = (int) ($_POST['book_id'] ?? 0);

if ($bookId <= 0) {
    $payload = request_data();
    $bookId = (int) ($payload['book_id'] ?? 0);
}

if ($bookId <= 0) {
    json_response(['success' => false, 'message' => 'Debes indicar el libro.'], 422);
}

$bookViewsTable = <<<SQL
CREATE TABLE IF NOT EXISTS book_views (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    book_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_book_views_book (book_id),
    KEY idx_book_views_user (user_id),
    CONSTRAINT fk_book_views_book
        FOREIGN KEY (book_id) REFERENCES books (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_book_views_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB
SQL;

db()->query($bookViewsTable);

$check = db()->prepare('SELECT id FROM books WHERE id = ? LIMIT 1');
$check->bind_param('i', $bookId);
$check->execute();
if (!$check->get_result()->fetch_assoc()) {
    json_response(['success' => false, 'message' => 'Libro no encontrado.'], 404);
}

$user = current_user();
$userId = $user ? (int) $user['id'] : null;

$statement = $userId === null
    ? db()->prepare('INSERT INTO book_views (book_id, user_id) VALUES (?, NULL)')
    : db()->prepare('INSERT INTO book_views (book_id, user_id) VALUES (?, ?)');

if ($userId === null) {
    $statement->bind_param('i', $bookId);
} else {
    $statement->bind_param('ii', $bookId, $userId);
}
$statement->execute();

json_response(['success' => true, 'message' => 'Vista registrada.']);
