<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$ciclo = isset($_GET['ciclo']) ? intval($_GET['ciclo']) : 0;

if ($ciclo <= 0) {
    responderJSON(false, 'Ciclo inválido');
}

// Verificar que el ciclo exista
$sql_check_ciclo = "SELECT id FROM ciclos WHERE id = ?";
$stmt_check_ciclo = $conn->prepare($sql_check_ciclo);
$stmt_check_ciclo->bind_param("i", $ciclo);
$stmt_check_ciclo->execute();
$result_check_ciclo = $stmt_check_ciclo->get_result();
if (!$result_check_ciclo || $result_check_ciclo->num_rows === 0) {
    responderJSON(false, 'Ciclo no encontrado');
}

$sql = "SELECT MIN(id) AS id, nombre FROM cursos WHERE ciclo_id = ? GROUP BY nombre ORDER BY nombre";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $ciclo);
$stmt->execute();
$result = $stmt->get_result();

$courses = array();

while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

responderJSON(true, 'Cursos obtenidos', array('courses' => $courses));
?>
