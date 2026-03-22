<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'biblioteca_estadistica');

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Crear base de datos si no existe
$sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
$conn->query($sql);

// Seleccionar base de datos
$conn->select_db(DB_NAME);

// Crear tablas si no existen
$tablas = array(
    "CREATE TABLE IF NOT EXISTS profesores (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        usuario VARCHAR(50) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        departamento VARCHAR(100),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    
    "CREATE TABLE IF NOT EXISTS ciclos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        numero INT UNIQUE NOT NULL,
        nombre VARCHAR(50)
    )",
    
    "CREATE TABLE IF NOT EXISTS cursos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        ciclo_id INT NOT NULL,
        descripcion TEXT,
        FOREIGN KEY (ciclo_id) REFERENCES ciclos(id)
    )",
    
    "CREATE TABLE IF NOT EXISTS libros (
        id INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(200) NOT NULL,
        autor VARCHAR(100) NOT NULL,
        curso_id INT NOT NULL,
        ciclo_id INT NOT NULL,
        profesor_id INT NOT NULL,
        descripcion TEXT,
        isbn VARCHAR(20),
        año_publicacion INT,
        archivo_pdf VARCHAR(255) NOT NULL,
        fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        descargas INT DEFAULT 0,
        FOREIGN KEY (curso_id) REFERENCES cursos(id),
        FOREIGN KEY (ciclo_id) REFERENCES ciclos(id),
        FOREIGN KEY (profesor_id) REFERENCES profesores(id)
    )",
    
    "CREATE TABLE IF NOT EXISTS descargas_log (
        id INT PRIMARY KEY AUTO_INCREMENT,
        libro_id INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_usuario VARCHAR(45),
        FOREIGN KEY (libro_id) REFERENCES libros(id)
    )"
);

foreach ($tablas as $tabla) {
    $conn->query($tabla);
}

// Insertar datos iniciales
$conn->query("INSERT IGNORE INTO ciclos (numero, nombre) VALUES 
    (1, 'I Ciclo'),
    (2, 'II Ciclo'),
    (3, 'III Ciclo'),
    (4, 'IV Ciclo'),
    (5, 'V Ciclo'),
    (6, 'VI Ciclo'),
    (7, 'VII Ciclo'),
    (8, 'VIII Ciclo')");

// Insertar cursos de ejemplo si no existen
$conn->query("INSERT IGNORE INTO cursos (nombre, ciclo_id, descripcion) VALUES
    ('Matemática I', 1, 'Curso introductorio de matemáticas'),
    ('Estadística Descriptiva', 1, 'Fundamentos de estadística'),
    ('Probabilidad I', 2, 'Teoría de probabilidades'),
    ('Estadística Inferencial', 3, 'Métodos de inferencia'),
    ('Análisis Multivariado', 4, 'Técnicas avanzadas de análisis'),
    ('Series de Tiempo', 5, 'Análisis temporal de datos'),
    ('Estadística Bayesiana', 6, 'Métodos bayesianos'),
    ('Minería de Datos', 7, 'Data mining y machine learning'),
    ('Seminario de Tesis', 8, 'Trabajo de tesis')");

// Insertar profesor de ejemplo si no existe
$conn->query("INSERT IGNORE INTO profesores (nombre, email, usuario, contraseña, departamento) VALUES
    ('Profesor Demo', 'profesor@ejemplo.com', 'demo', '" . password_hash('demo123', PASSWORD_BCRYPT) . "', 'Estadística')");

// Función para obtener conexión
function obtenerConexion() {
    global $conn;
    return $conn;
}

// Función para responder en JSON
function responderJSON($success, $message = '', $data = null) {
    $response = array(
        'success' => $success,
        'message' => $message
    );
    
    if ($data !== null) {
        foreach ($data as $key => $value) {
            $response[$key] = $value;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}
?>
