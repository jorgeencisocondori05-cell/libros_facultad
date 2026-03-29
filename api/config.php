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
        FOREIGN KEY (ciclo_id) REFERENCES ciclos(id),
        UNIQUE KEY uq_curso_ciclo (nombre, ciclo_id)
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
    (8, 'VIII Ciclo'),
    (9, 'IX Ciclo'),
    (10, 'X Ciclo')");

// Insertar cursos de ejemplo si no existen
$conn->query("INSERT IGNORE INTO cursos (nombre, ciclo_id, descripcion) VALUES
    ('Introducción a la Ciencia de Datos', 1, 'Curso base del primer ciclo'),
    ('Técnicas de Exploración de Datos', 2, 'Métodos de análisis exploratorio'),
    ('Ingeniería de Procesos', 3, 'Diseño y mejora de procesos'),
    ('Lenguaje de Programación 1', 3, 'Fundamentos de programación'),
    ('Análisis Estadístico', 4, 'Métodos estadísticos clásicos'),
    ('Lenguaje de Programación 2', 4, 'Programación avanzada'),
    ('Métodos de Optimización', 4, 'Optimización matemática y numérica'),
    ('Sistemas de Gestión de Base de Datos 1', 4, 'Bases de datos relacionales básicas'),
    ('Análisis de Regresión', 5, 'Modelos de regresión y predicción'),
    ('Cálculo de Probabilidades', 5, 'Probabilidad aplicada'),
    ('Diseños Experimentales', 5, 'Diseño y análisis de experimentos'),
    ('Estrategias de Muestreo', 5, 'Métodos de muestreo para inferencia'),
    ('Lenguaje de Programación 3', 5, 'Programación orientada a datos'),
    ('Sistema de Gestión de Base de Datos 2', 6, 'Administración avanzada de bases de datos'),
    ('Inferencia Estadística', 6, 'Inferencia y pruebas de hipótesis avanzadas'),
    ('Diseños Experimentales 2', 6, 'Diseños de experimentos avanzados'),
    ('Técnicas Multivariadas', 6, 'Análisis multivariante de datos'),
    ('Algoritmia', 6, 'Algoritmos y estructuras de datos'),
    ('Sistemas de Información Gerencial', 7, 'Sistemas de información para toma de decisiones'),
    ('Modelos Lineales 1', 7, 'Modelos lineales clásicos'),
    ('Estadística Bayesiana', 7, 'Métodos bayesianos'),
    ('Estadística Computacional', 7, 'Cálculo estadístico con software'),
    ('Marketing', 7, 'Principios de marketing y análisis de mercado'),
    ('Estadística No Paramétrica', 8, 'Métodos estadísticos no paramétricos'),
    ('Gestión Estratégica de Datos', 8, 'Estrategias de datos en la organización'),
    ('Investigación de Mercados', 8, 'Técnicas y análisis de investigación de mercado'),
    ('Máquinas de Aprendizaje', 8, 'Aprendizaje automático y minería de datos'),
    ('Modelos Lineales 2', 8, 'Modelos lineales avanzados'),
    ('Seminario en Estadística e Informática', 8, 'Seminario de integración'),
    ('Análisis de Series de Tiempo', 9, 'Modelado y predicción temporal'),
    ('Ciencia de Datos 1', 9, 'Introducción práctica a ciencia de datos'),
    ('Estadística Espacial', 9, 'Análisis de datos geoespaciales'),
    ('Gestión de Proyectos de Información', 9, 'Metodologías de gestión de proyectos'),
    ('Seminario en Estadística e Informática 2', 9, 'Seminario avanzado'),
    ('Ciencia de Datos 2', 10, 'Segunda parte de ciencia de datos'),
    ('Seminario en Estadística e Informática 3', 10, 'Proyecto final'),
    ('Tecnologías Emergentes', 10, 'Tendencias y herramientas emergentes')");

// Limpiar duplicados de cursos en caso de inserciones anteriores repetidas
$conn->query("DELETE c1 FROM cursos c1
  INNER JOIN cursos c2
  WHERE c1.id > c2.id
    AND c1.nombre = c2.nombre
    AND c1.ciclo_id = c2.ciclo_id");

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
