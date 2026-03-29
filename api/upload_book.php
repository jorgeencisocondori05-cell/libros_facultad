<?php
header('Content-Type: application/json');
require_once 'config.php';

$conn = obtenerConexion();

// Crear carpeta de descargas si no existe
if (!is_dir('../descargas')) {
    mkdir('../descargas', 0777, true);
}

$titulo = isset($_POST['titulo']) ? trim($_POST['titulo']) : '';
$autor = isset($_POST['autor']) ? trim($_POST['autor']) : '';
$ciclo = isset($_POST['ciclo']) ? intval($_POST['ciclo']) : 0;
$curso = isset($_POST['curso']) ? intval($_POST['curso']) : 0;
$año = isset($_POST['año']) ? intval($_POST['año']) : null;
$isbn = isset($_POST['isbn']) ? trim($_POST['isbn']) : '';
$descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
$profesor_id = isset($_POST['profesor_id']) ? intval($_POST['profesor_id']) : 0;

// Validaciones
if (empty($titulo) || empty($autor) || $ciclo <= 0 || $curso <= 0) {
    responderJSON(false, 'Todos los campos requeridos deben completarse');
}

// Validar relación curso-ciclo
$sql_curso = "SELECT ciclo_id FROM cursos WHERE id = ?";
$stmt_curso = $conn->prepare($sql_curso);
$stmt_curso->bind_param("i", $curso);
$stmt_curso->execute();
$result_curso = $stmt_curso->get_result();
if (!$result_curso || $result_curso->num_rows === 0) {
    responderJSON(false, 'Curso inválido');
}
$curso_datos = $result_curso->fetch_assoc();
$ciclo_del_curso = intval($curso_datos['ciclo_id']);

if ($ciclo_del_curso !== $ciclo) {
    responderJSON(false, 'Ciclo y curso no coinciden. Seleccione el curso correspondiente al ciclo.');
}

// Establecer ciclo según curso para evitar inconsistencias
$ciclo = $ciclo_del_curso;

if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
    responderJSON(false, 'Error al subir el archivo');
}

$archivo = $_FILES['archivo'];

// Validar tipo de archivo
$tipo_archivo = mime_content_type($archivo['tmp_name']);
if ($tipo_archivo !== 'application/pdf') {
    responderJSON(false, 'El archivo debe ser un PDF');
}

// Validar tamaño
if ($archivo['size'] > 50 * 1024 * 1024) {
    responderJSON(false, 'El archivo no debe exceder 50MB');
}

// Generar nombre único para el archivo
$nombre_archivo = 'libro_' . time() . '_' . uniqid() . '.pdf';
$ruta_archivo = '../descargas/' . $nombre_archivo;

// Mover archivo
if (!move_uploaded_file($archivo['tmp_name'], $ruta_archivo)) {
    responderJSON(false, 'Error al guardar el archivo');
}

// Insertar en base de datos
$sql = "INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    unlink($ruta_archivo);
    responderJSON(false, 'Error en la base de datos: ' . $conn->error);
}

$stmt->bind_param("ssiiiisss", $titulo, $autor, $curso, $ciclo, $profesor_id, $descripcion, $isbn, $año, $nombre_archivo);

if ($stmt->execute()) {
    responderJSON(true, 'Libro subido exitosamente');
} else {
    unlink($ruta_archivo);
    responderJSON(false, 'Error al guardar en la base de datos');
}
?>
