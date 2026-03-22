<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$ciclo = isset($_GET['ciclo']) ? intval($_GET['ciclo']) : 0;

if ($ciclo <= 0) {
    responderJSON(false, 'Ciclo inválido');
}

$sql = "SELECT id, nombre FROM cursos WHERE ciclo_id = ? ORDER BY nombre";
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
