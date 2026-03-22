<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

$input = json_decode(file_get_contents('php://input'), true);

$libro_id = isset($input['libro_id']) ? intval($input['libro_id']) : 0;

if ($libro_id <= 0) {
    responderJSON(false, 'ID de libro inválido');
}

// Obtener nombre del archivo antes de eliminar
$sql_select = "SELECT archivo_pdf FROM libros WHERE id = ?";
$stmt_select = $conn->prepare($sql_select);
$stmt_select->bind_param("i", $libro_id);
$stmt_select->execute();
$result = $stmt_select->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    responderJSON(false, 'Libro no encontrado');
}

// Eliminar archivo
$archivo = '../descargas/' . $row['archivo_pdf'];
if (file_exists($archivo)) {
    unlink($archivo);
}

// Eliminar de base de datos
$sql_delete = "DELETE FROM libros WHERE id = ?";
$stmt_delete = $conn->prepare($sql_delete);
$stmt_delete->bind_param("i", $libro_id);

if ($stmt_delete->execute()) {
    responderJSON(true, 'Libro eliminado exitosamente');
} else {
    responderJSON(false, 'Error al eliminar el libro');
}
?>
