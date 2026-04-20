<?php
require __DIR__ . '/config.php';

require_role(['admin']);

$result = db()->query(
	'SELECT u.id, u.full_name, u.username, u.email, u.active, r.slug AS role, u.created_at
	 FROM users u
	 INNER JOIN roles r ON r.id = u.role_id
	 ORDER BY u.id DESC'
);

json_response(['success' => true, 'data' => $result->fetch_all(MYSQLI_ASSOC)]);
