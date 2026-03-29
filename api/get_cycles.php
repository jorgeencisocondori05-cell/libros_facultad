<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$sql = "SELECT id, numero, nombre FROM ciclos ORDER BY numero";
$result = $conn->query($sql);

$cycles = array();

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $cycles[] = $row;
    }
}

if (count($cycles) === 0) {
    echo json_encode(array('success' => false, 'message' => 'No se encontraron ciclos'));
    exit();
}

echo json_encode(array('success' => true, 'message' => 'Ciclos obtenidos', 'cycles' => $cycles));
exit();
?>