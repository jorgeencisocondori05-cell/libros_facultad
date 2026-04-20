CREATE DATABASE IF NOT EXISTS libros_facultad
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE libros_facultad;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS cycles;
DROP TABLE IF EXISTS curricula;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
    id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(20) NOT NULL,
    name VARCHAR(60) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE curricula (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL,
    name VARCHAR(120) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_curricula_code (code)
) ENGINE=InnoDB;

CREATE TABLE cycles (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    curriculum_id SMALLINT UNSIGNED NOT NULL,
    cycle_number TINYINT UNSIGNED NOT NULL,
    label VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_cycles_curriculum_number (curriculum_id, cycle_number),
    CONSTRAINT fk_cycles_curriculum
        FOREIGN KEY (curriculum_id) REFERENCES curricula (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE courses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    cycle_id SMALLINT UNSIGNED NOT NULL,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    order_in_cycle TINYINT UNSIGNED NOT NULL DEFAULT 1,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_courses_slug (slug),
    KEY idx_courses_cycle (cycle_id),
    CONSTRAINT fk_courses_cycle
        FOREIGN KEY (cycle_id) REFERENCES cycles (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_id TINYINT UNSIGNED NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    username VARCHAR(60) NOT NULL,
    email VARCHAR(120) DEFAULT NULL,
    password_hash CHAR(64) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_username (username),
    KEY idx_users_role (role_id),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE books (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_id INT UNSIGNED NOT NULL,
    uploaded_by INT UNSIGNED NOT NULL,
    title VARCHAR(180) NOT NULL,
    author VARCHAR(120) NOT NULL,
    description TEXT DEFAULT NULL,
    isbn VARCHAR(30) DEFAULT NULL,
    publication_year SMALLINT UNSIGNED DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_books_course (course_id),
    KEY idx_books_uploader (uploaded_by),
    CONSTRAINT fk_books_course
        FOREIGN KEY (course_id) REFERENCES courses (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_books_uploader
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO roles (slug, name) VALUES
    ('admin', 'Administrador'),
    ('docente', 'Docente');

INSERT INTO curricula (code, name) VALUES
    ('malla2019', 'malla2019');

INSERT INTO cycles (curriculum_id, cycle_number, label) VALUES
    (1, 1, 'Ciclo 1'),
    (1, 2, 'Ciclo 2'),
    (1, 3, 'Ciclo 3'),
    (1, 4, 'Ciclo 4'),
    (1, 5, 'Ciclo 5'),
    (1, 6, 'Ciclo 6'),
    (1, 7, 'Ciclo 7'),
    (1, 8, 'Ciclo 8'),
    (1, 9, 'Ciclo 9'),
    (1, 10, 'Ciclo 10');

INSERT INTO courses (cycle_id, name, slug, order_in_cycle) VALUES
    (1, 'Introducción a la Ciencia de Datos', 'introduccion-a-la-ciencia-de-datos', 1),
    (2, 'Técnicas de Exploración de Datos', 'tecnicas-de-exploracion-de-datos', 1),
    (3, 'Ingeniería de Procesos', 'ingenieria-de-procesos', 1),
    (3, 'Lenguaje de Programación 1', 'lenguaje-de-programacion-1', 2),
    (4, 'Análisis Estadístico', 'analisis-estadistico', 1),
    (4, 'Lenguaje de Programación 2', 'lenguaje-de-programacion-2', 2),
    (4, 'Métodos de Optimización', 'metodos-de-optimizacion', 3),
    (4, 'Sistemas de Gestión de Base de Datos 1', 'sistemas-de-gestion-de-base-de-datos-1', 4),
    (5, 'Análisis de Regresión', 'analisis-de-regresion', 1),
    (5, 'Cálculo de Probabilidades', 'calculo-de-probabilidades', 2),
    (5, 'Diseños Experimentales', 'disenos-experimentales', 3),
    (5, 'Estrategias de Muestreo', 'estrategias-de-muestreo', 4),
    (5, 'Lenguaje de Programación 3', 'lenguaje-de-programacion-3', 5),
    (6, 'Sistema de Gestión de Base de Datos 2', 'sistema-de-gestion-de-base-de-datos-2', 1),
    (6, 'Inferencia Estadística', 'inferencia-estadistica', 2),
    (6, 'Diseños Experimentales 2', 'disenos-experimentales-2', 3),
    (6, 'Técnicas Multivariadas', 'tecnicas-multivariadas', 4),
    (6, 'Algoritmia', 'algoritmia', 5),
    (7, 'Sistemas de Información Gerencial', 'sistemas-de-informacion-gerencial', 1),
    (7, 'Modelos Lineales 1', 'modelos-lineales-1', 2),
    (7, 'Estadística Bayesiana', 'estadistica-bayesiana', 3),
    (7, 'Estadística Computacional', 'estadistica-computacional', 4),
    (7, 'Marketing', 'marketing', 5),
    (8, 'Estadística No Paramétrica', 'estadistica-no-parametrica', 1),
    (8, 'Gestión Estratégica de Datos', 'gestion-estrategica-de-datos', 2),
    (8, 'Investigación de Mercados', 'investigacion-de-mercados', 3),
    (8, 'Máquinas de Aprendizaje', 'maquinas-de-aprendizaje', 4),
    (8, 'Modelos Lineales 2', 'modelos-lineales-2', 5),
    (8, 'Seminario en Estadística e Informática', 'seminario-en-estadistica-e-informatica', 6),
    (9, 'Análisis de Series de Tiempo', 'analisis-de-series-de-tiempo', 1),
    (9, 'Ciencia de Datos 1', 'ciencia-de-datos-1', 2),
    (9, 'Estadística Espacial', 'estadistica-espacial', 3),
    (9, 'Gestión de Proyectos de Información', 'gestion-de-proyectos-de-informacion', 4),
    (9, 'Seminario en Estadística e Informática 2', 'seminario-en-estadistica-e-informatica-2', 5),
    (10, 'Ciencia de Datos 2', 'ciencia-de-datos-2', 1),
    (10, 'Seminario en Estadística e Informática 3', 'seminario-en-estadistica-e-informatica-3', 2),
    (10, 'Tecnologías Emergentes', 'tecnologias-emergentes', 3);

-- Credenciales semilla en texto (para login):
-- admin / admin12345
-- profesor / profesor12345
INSERT INTO users (role_id, full_name, username, email, password_hash) VALUES
    (1, 'Administrador General', 'admin', 'admin@librosfacultad.local', '41e5653fc7aeb894026d6bb7b2db7f65902b454945fa8fd65a6327047b5277fb'),
    (2, 'Profesor Demo', 'profesor', 'profesor@librosfacultad.local', 'd005f1a99bbc39517480d823814b666acdaf310ee1243ce0aa174954d20553b8');
