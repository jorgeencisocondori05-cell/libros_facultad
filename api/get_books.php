<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

// Obtener todos los libros
$sql = "SELECT l.*, COALESCE(l.archivo_pdf, '') AS archivo_pdf, CONCAT('/libros_facultad/descargas/', COALESCE(l.archivo_pdf, '')) AS archivo_url, c.nombre as curso_nombre, ci.numero as ciclo_numero, ci.nombre as ciclo_nombre, p.nombre as profesor_nombre 
        FROM libros l 
        JOIN cursos c ON l.curso_id = c.id 
        JOIN ciclos ci ON c.ciclo_id = ci.id 
        JOIN profesores p ON l.profesor_id = p.id 
        ORDER BY l.fecha_subida DESC";

$result = $conn->query($sql);

$books = array();

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
    responderJSON(true, 'Libros obtenidos correctamente', array('books' => $books));
} else {
    responderJSON(true, 'Sin libros disponibles', array('books' => array()));
}
?>
