<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$input = json_decode(file_get_contents('php://input'), true);

$usuario = isset($input['usuario']) ? $input['usuario'] : '';
$contraseña = isset($input['contraseña']) ? $input['contraseña'] : '';

if (empty($usuario) || empty($contraseña)) {
    responderJSON(false, 'Usuario y contraseña requeridos');
}

$sql = "SELECT id, nombre, email, usuario, departamento FROM profesores WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    responderJSON(false, 'Usuario o contraseña incorrectos');
}

$profesor = $result->fetch_assoc();

// Obtener contraseña hasheada de la base de datos para verificar
$sql_pass = "SELECT contraseña FROM profesores WHERE usuario = ?";
$stmt_pass = $conn->prepare($sql_pass);
$stmt_pass->bind_param("s", $usuario);
$stmt_pass->execute();
$result_pass = $stmt_pass->get_result();
$row_pass = $result_pass->fetch_assoc();

// Verificar contraseña
if (!password_verify($contraseña, $row_pass['contraseña'])) {
    // Para compatibilidad, también verificar texto plano en desarrollo
    if ($contraseña !== $row_pass['contraseña']) {
        responderJSON(false, 'Usuario o contraseña incorrectos');
    }
}

responderJSON(true, 'Login exitoso', array('profesor' => $profesor));
?>
