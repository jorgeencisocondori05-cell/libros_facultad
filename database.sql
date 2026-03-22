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
(8, 'VIII Ciclo');

-- Insertar cursos de ejemplo
INSERT IGNORE INTO cursos (nombre, ciclo_id, descripcion) VALUES
('Matemática I', 1, 'Curso introductorio de matemáticas'),
('Estadística Descriptiva', 1, 'Fundamentos de estadística'),
('Probabilidad I', 2, 'Teoría de probabilidades'),
('Estadística Inferencial', 3, 'Métodos de inferencia estadística'),
('Análisis Multivariado', 4, 'Técnicas avanzadas de análisis multivariado'),
('Series de Tiempo', 5, 'Análisis temporal de datos'),
('Estadística Bayesiana', 6, 'Métodos bayesianos en estadística'),
('Minería de Datos', 7, 'Data mining y machine learning'),
('Seminario de Tesis', 8, 'Trabajo de tesis de carrera');

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
