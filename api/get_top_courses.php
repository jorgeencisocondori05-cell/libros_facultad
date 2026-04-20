<?php
require __DIR__ . '/config.php';

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

$result = db()->query(
    'SELECT co.id, co.name AS course_name, cy.cycle_number, cur.name AS curriculum_name, COUNT(cv.id) AS views_count
     FROM courses co
     INNER JOIN cycles cy ON cy.id = co.cycle_id
     INNER JOIN curricula cur ON cur.id = cy.curriculum_id
     LEFT JOIN course_views cv ON cv.course_id = co.id
     GROUP BY co.id, co.name, cy.cycle_number, cur.name
     ORDER BY views_count DESC, cy.cycle_number ASC, co.name ASC
     LIMIT 5'
);

json_response(['success' => true, 'data' => $result->fetch_all(MYSQLI_ASSOC)]);
