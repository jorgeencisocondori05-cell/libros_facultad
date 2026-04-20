<?php
require __DIR__ . '/config.php';

session_destroy();

json_response(['success' => true, 'message' => 'Sesión cerrada.']);
