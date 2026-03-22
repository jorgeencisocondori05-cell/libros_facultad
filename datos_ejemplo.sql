-- Script para insertar datos de ejemplo
-- Ejecutar después de la instalación básica

USE biblioteca_estadistica;

-- Insertar profesor adicional
INSERT INTO profesores (nombre, email, usuario, contraseña, departamento) VALUES
('Dr. Carlos Rodríguez', 'carlos.rodriguez@universidad.edu', 'carlos.rodriguez', MD5('password123'), 'Estadística'),
('Mg. María González', 'maria.gonzalez@universidad.edu', 'maria.gonzalez', MD5('password123'), 'Estadística');

-- Insertar libros de ejemplo para el ciclo I

-- Para Matemática I
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Cálculo Diferencial Básico', 'James Stewart', 1, 1, 1, 'Introducción completa al cálculo diferencial con ejercicios prácticos', '978-0134689509', 2015, 'calculo_diferencial.pdf', 15),
('Álgebra Lineal para Principiantes', 'Gilbert Strang', 1, 1, 1, 'Fundamentos de algebra lineal con aplicaciones prácticas', '978-0980232776', 2009, 'algebra_lineal.pdf', 22),
('Geometría Analítica', 'Larson y Edwards', 1, 1, 1, 'Estudio completo de geometría analítica bidimensional y tridimensional', '978-1305658776', 2016, 'geometria_analitica.pdf', 8);

-- Para Estadística Descriptiva
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Estadística Descriptiva Aplicada', 'David Lane', 2, 1, 2, 'Métodos y técnicas de estadística descriptiva con ejemplos reales', '978-1466210591', 2014, 'estadistica_descriptiva.pdf', 34),
('Análisis Exploratorio de Datos', 'John Tukey', 2, 1, 1, 'Técnicas clásicas de análisis de datos exploratorios', '978-0201076165', 1977, 'analisis_exploratorio.pdf', 12),
('Gráficos y Visualización en R', 'Hadley Wickham', 2, 1, 2, 'Guía práctica para crear visualizaciones de datos en R', '978-0387981062', 2015, 'graficos_r.pdf', 28);

-- Para Probabilidad I (Ciclo II)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Introducción a la Probabilidad', 'Bertsekas y Tsitsiklis', 3, 2, 1, 'Fundamentos teóricos y prácticos de probabilidad', '978-1886529236', 2008, 'introduccion_probabilidad.pdf', 19),
('Probabilidad y Procesos Estocásticos', 'Roy Yates', 3, 2, 2, 'Temas avanzados en probabilidad y procesos aleatorios', '978-0471321652', 2014, 'procesos_estocasticos.pdf', 7);

-- Para Estadística Inferencial (Ciclo III)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Inferencia Estadística Moderna', 'Larry Wasserman', 4, 3, 1, 'Métodos de inferencia con enfoque moderno y computacional', '978-0387402726', 2006, 'inferencia_moderna.pdf', 26),
('Pruebas de Hipótesis y Estimación', 'George Casella', 4, 3, 2, 'Teoría y práctica de pruebas de hipótesis estadísticas', '978-0534243128', 2001, 'pruebas_hipotesis.pdf', 11);

-- Para Análisis Multivariado (Ciclo IV)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Análisis Multivariado Aplicado', 'Johnson y Wichern', 5, 4, 1, 'Técnicas multivariadas con aplicaciones en ciencia e ingeniería', '978-0131877467', 2007, 'analisis_multivariado.pdf', 9),
('Análisis de Componentes Principales', 'Ian Jolliffe', 5, 4, 2, 'Guía completa de PCA y técnicas relacionadas', '978-0387954509', 2002, 'pca.pdf', 14);

-- Para Series de Tiempo (Ciclo V)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Series de Tiempo: Análisis Moderno', 'Robert Shumway', 6, 5, 1, 'Métodos clásicos y modernos para análisis de series temporales', '978-1441904431', 2011, 'series_tiempo.pdf', 18),
('Pronósticos Económicos con R', 'Rob Hyndman', 6, 5, 2, 'Uso de R para forecasting y predicción', '978-0987507104', 2013, 'forecasting_r.pdf', 13);

-- Para Estadística Bayesiana (Ciclo VI)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Análisis Bayesiano de Datos', 'Gelman et al.', 7, 6, 1, 'Métodos bayesianos con aplicaciones prácticas', '978-1439840955', 2013, 'analisis_bayesiano.pdf', 11),
('Inferencia Bayesiana Computacional', 'Peter Congdon', 7, 6, 2, 'MCMC y métodos computacionales en estadística bayesiana', '978-0470871577', 2006, 'inferencia_bayesiana_comp.pdf', 6);

-- Para Minería de Datos (Ciclo VII)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Mining Massive Datasets', 'Leskovec, Rajaraman, Ullman', 8, 7, 1, 'Técnicas de minería de datos en grandes volúmenes', '978-1107015357', 2014, 'mining_massive.pdf', 17),
('Machine Learning en Acción', 'Peter Harrington', 8, 7, 2, 'Algoritmos ML implementados desde cero', '978-1935182085', 2012, 'ml_accion.pdf', 23),
('Deep Learning', 'Goodfellow, Bengio, Courville', 8, 7, 1, 'Fundamentos de deep learning y redes neuronales', '978-0262035613', 2016, 'deep_learning.pdf', 20);

-- Para Seminario de Tesis (Ciclo VIII)
INSERT INTO libros (titulo, autor, curso_id, ciclo_id, profesor_id, descripcion, isbn, año_publicacion, archivo_pdf, descargas) VALUES
('Guía para Escribir Tesis Científicas', 'Eco, Umberto', 9, 8, 1, 'Metodología y estructura de tesis académicas', '978-8483068779', 2017, 'guia_tesis.pdf', 31),
('Metodología de la Investigación', 'Hernández Sampieri', 9, 8, 2, 'Método científico y diseño de investigaciones', '978-6071502994', 2014, 'metodologia_investigacion.pdf', 27),
('Estadística para Investigadores', 'Box, Hunter, Hunter', 9, 8, 1, 'Diseño de experimentos y análisis estadístico', '978-0471718130', 2005, 'estadistica_investigadores.pdf', 10);

-- Verificar datos insertados
SELECT COUNT(*) as total_libros FROM libros;
SELECT COUNT(*) as total_profesores FROM profesores;
SELECT COUNT(*) as total_cursos FROM cursos;
