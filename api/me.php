<?php
require __DIR__ . '/config.php';

$user = require_login();

json_response([
    'success' => true,
    'user' => $user,
]);
