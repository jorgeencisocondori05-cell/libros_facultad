-- Script de instalación de la Biblioteca Digital
-- Base de datos para la Carrera de Estadística

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS biblioteca_estadistica;
USE biblioteca_estadistica;

-- Tabla de profesores
CREATE TABLE IF NOT EXISTS profesores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    departamento VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ciclos
CREATE TABLE IF NOT EXISTS ciclos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT UNIQUE NOT NULL,
    nombre VARCHAR(50)
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    ciclo_id INT NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (ciclo_id) REFERENCES ciclos(id) ON DELETE CASCADE
);

-- Tabla de libros
CREATE TABLE IF NOT EXISTS libros (
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
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    FOREIGN KEY (ciclo_id) REFERENCES ciclos(id) ON DELETE CASCADE,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE
);

-- Tabla de log de descargas
CREATE TABLE IF NOT EXISTS descargas_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    libro_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuario VARCHAR(45),
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
);

-- Insertar ciclos
INSERT IGNORE INTO ciclos (numero, nombre) VALUES 
(1, 'I Ciclo'),
(2, 'II Ciclo'),
(3, 'III Ciclo'),
(4, 'IV Ciclo'),
(5, 'V Ciclo'),
(6, 'VI Ciclo'),
(7, 'VII Ciclo'),
(8, 'VIII Ciclo'),
(9, 'IX Ciclo'),
(10, 'X Ciclo');

-- Insertar cursos de ejemplo
INSERT IGNORE INTO cursos (nombre, ciclo_id, descripcion) VALUES
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
('Tecnologías Emergentes', 10, 'Tendencias y herramientas emergentes');

-- Insertar profesor demo (contraseña: demo123)
-- Usar: $2y$10$... que es el hash de 'demo123' con bcrypt
INSERT IGNORE INTO profesores (nombre, email, usuario, contraseña, departamento) VALUES
('Profesor Demo', 'profesor@ejemplo.com', 'demo', '$2y$10$Z8bqW8gqRQtMLWVzlNIzHeM/jmLFXzQBGqLqQn4i/0wG0N3hM2sC6', 'Estadística');

-- Crear índices para mejorar búsquedas
CREATE INDEX idx_curso_ciclo ON cursos(ciclo_id);
CREATE INDEX idx_libro_profesor ON libros(profesor_id);
CREATE INDEX idx_libro_curso ON libros(curso_id);
CREATE INDEX idx_libro_ciclo ON libros(ciclo_id);
CREATE INDEX idx_libro_titulo ON libros(titulo);
CREATE INDEX idx_libro_autor ON libros(autor);

-- Vistas útiles
CREATE OR REPLACE VIEW vista_libros_detallados AS
SELECT 
    l.id,
    l.titulo,
    l.autor,
    l.descripcion,
    l.isbn,
    l.año_publicacion,
    l.fecha_subida,
    l.descargas,
    c.nombre as curso_nombre,
    c.ciclo_id,
    ci.numero as ciclo,
    p.nombre as profesor_nombre,
    p.email as profesor_email
FROM libros l
JOIN cursos c ON l.curso_id = c.id
JOIN ciclos ci ON l.ciclo_id = ci.id
JOIN profesores p ON l.profesor_id = p.id
ORDER BY l.fecha_subida DESC;

-- Fin del script de instalación
