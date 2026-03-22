<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$profesor_id = isset($_GET['profesor_id']) ? intval($_GET['profesor_id']) : 0;

if ($profesor_id <= 0) {
    responderJSON(false, 'ID de profesor inválido');
}

// Total de libros en el sistema
$sql_total = "SELECT COUNT(*) as total FROM libros";
$result_total = $conn->query($sql_total);
$row_total = $result_total->fetch_assoc();
$total_libros = $row_total['total'];

// Libros del profesor
$sql_profesor = "SELECT COUNT(*) as total FROM libros WHERE profesor_id = ?";
$stmt_profesor = $conn->prepare($sql_profesor);
$stmt_profesor->bind_param("i", $profesor_id);
$stmt_profesor->execute();
$result_profesor = $stmt_profesor->get_result();
$row_profesor = $result_profesor->fetch_assoc();
$mis_libros = $row_profesor['total'];

// Descargas de los libros del profesor
$sql_descargas = "SELECT SUM(descargas) as total FROM libros WHERE profesor_id = ?";
$stmt_descargas = $conn->prepare($sql_descargas);
$stmt_descargas->bind_param("i", $profesor_id);
$stmt_descargas->execute();
$result_descargas = $stmt_descargas->get_result();
$row_descargas = $result_descargas->fetch_assoc();
$descargas = $row_descargas['total'] ?? 0;

$stats = array(
    'total_libros' => $total_libros,
    'mis_libros' => $mis_libros,
    'descargas' => intval($descargas)
);

responderJSON(true, 'Estadísticas obtenidas', array('stats' => $stats));
?>
