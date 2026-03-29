<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$profesor_id = isset($_GET['profesor_id']) ? intval($_GET['profesor_id']) : 0;

if ($profesor_id <= 0) {
    responderJSON(false, 'ID de profesor inválido');
}

$sql = "SELECT l.*, COALESCE(l.archivo_pdf, '') AS archivo_pdf, CONCAT('/libros_facultad/descargas/', COALESCE(l.archivo_pdf, '')) AS archivo_url, c.nombre as curso_nombre, ci.numero as ciclo_numero, ci.nombre as ciclo_nombre 
        FROM libros l 
        JOIN cursos c ON l.curso_id = c.id 
        JOIN ciclos ci ON c.ciclo_id = ci.id 
        WHERE l.profesor_id = ? 
        ORDER BY l.fecha_subida DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $profesor_id);
$stmt->execute();
$result = $stmt->get_result();

$books = array();

while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

responderJSON(true, 'Libros obtenidos', array('books' => $books));
?>
