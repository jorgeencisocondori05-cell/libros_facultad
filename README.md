<p align="center">
	<img src="https://img.shields.io/badge/Proyecto-Biblioteca%20Digital%20DAEI-0b5fff?style=for-the-badge" alt="Proyecto Biblioteca Digital DAEI">
	<img src="https://img.shields.io/badge/Stack-PHP%20%7C%20MySQL%20%7C%20JavaScript-111827?style=for-the-badge" alt="Stack tecnológico">
	<img src="https://img.shields.io/badge/Formato-PDF%20Acad%C3%A9mico-16a34a?style=for-the-badge" alt="Formato PDF Académico">
</p>

<h1 align="center">Biblioteca Digital del Departamento de Estadística e Informática</h1>

<p align="center">
	Repositorio web para organizar, consultar y administrar material académico en formato PDF.
	Permite navegar por malla curricular, ciclo y curso, además de ofrecer acceso diferenciado para visitantes, docentes y administradores.
</p>

---

## Resumen del proyecto

Esta aplicación fue creada para concentrar en un solo sitio el material académico del departamento. El objetivo no es solo almacenar archivos PDF, sino ordenarlos de forma útil para que cualquier usuario pueda encontrarlos según su contexto académico.

La plataforma incluye una portada pública para consulta, un área de autenticación para usuarios internos y un panel administrativo con carga de libros, gestión de cursos, creación de mallas y administración de usuarios.

## Qué resuelve

- Evita que los libros estén dispersos en múltiples carpetas o canales.
- Permite localizar materiales por filtros académicos.
- Facilita la carga de PDFs por parte de docentes autorizados.
- Centraliza la administración de cursos, ciclos y mallas.
- Registra actividad para mostrar estadísticas de uso.

## Funciones principales

- Búsqueda de libros por malla curricular, ciclo, curso y texto libre.
- Visualización de libros en tarjetas con información clara.
- Inicio de sesión para docentes y administradores.
- Subida de archivos PDF al sistema.
- Eliminación de libros y usuarios desde el panel administrativo.
- Creación de mallas curriculares y cursos desde el panel interno.
- Estadísticas de libros, cursos, ciclos y usuarios.
- Seguimiento de vistas de libros y vistas de cursos.

## Perfiles de usuario

### Visitante o estudiante

Consulta el catálogo, aplica filtros y abre los PDF disponibles.

### Docente

Inicia sesión, sube libros, revisa su propio material y accede a su panel interno.

### Administrador

Gestiona usuarios, mallas, cursos, libros y estadísticas generales del sistema.

## Flujo de uso

1. El usuario entra a la portada principal.
2. Selecciona una malla, un ciclo o un curso.
3. El sistema consulta la API y muestra los resultados.
4. Si necesita acceso interno, entra a la pantalla de login.
5. El docente o administrador accede al panel correspondiente.
6. Desde el panel se pueden subir, ver o eliminar recursos.
7. La base de datos guarda toda la información y las estadísticas asociadas.

## Stack tecnológico

- HTML para estructurar las páginas.
- CSS para el diseño visual y la interfaz.
- JavaScript para filtros, formularios y consumo de API.
- PHP para autenticación, lógica del servidor y operaciones internas.
- MySQL para almacenar usuarios, libros, cursos, ciclos y estadísticas.

## Estructura del proyecto

- `index.html`: portada principal del sistema.
- `admin.html`: acceso interno para docentes y administradores.
- `panel.html`: panel de gestión de libros.
- `admin-panel.html`: panel administrativo con funciones ampliadas.
- `script.js`: lógica de la portada pública.
- `admin.js`: lógica del login.
- `panel.js`: lógica del panel docente.
- `admin-panel.js`: lógica del panel administrativo.
- `style.css`: estilos globales del sitio.
- `api/`: endpoints PHP para login, consultas, carga, estadísticas y administración.
- `database.sql`: esquema de base de datos y datos semilla.
- `descargas/`: carpeta donde se almacenan los PDF cargados.

## Endpoints principales

- `api/login.php`: inicio de sesión.
- `api/logout.php`: cierre de sesión.
- `api/me.php`: sesión activa.
- `api/get_books.php`: listado de libros.
- `api/get_courses.php`: listado de cursos.
- `api/get_cycles.php`: listado de ciclos.
- `api/get_curricula.php`: listado de mallas curriculares.
- `api/get_users.php`: listado de usuarios.
- `api/get_stats.php`: estadísticas generales.
- `api/get_top_courses.php`: cursos más consultados.
- `api/upload_book.php`: carga de libros PDF.
- `api/delete_book.php`: eliminación de libros.
- `api/delete_user.php`: eliminación de usuarios.

## Requisitos

- Servidor local con PHP y MySQL, como XAMPP, WAMP o MAMP.
- phpMyAdmin o una herramienta similar para importar la base de datos.
- Navegador moderno para probar la interfaz.
- Permisos de escritura en `descargas/` para guardar los archivos PDF.

## Instalación rápida

1. Copia el proyecto dentro de `htdocs` o la carpeta pública de tu servidor.
2. Inicia Apache y MySQL.
3. Importa `database.sql` en phpMyAdmin.
4. Verifica las credenciales de conexión en `api/config.php`.
5. Abre `http://localhost/libros_facultad/`.

## Credenciales de prueba

- Administrador: `admin / admin12345`
- Docente: `profesor / profesor12345`

## Base de datos

La estructura relacional está pensada para reflejar el orden académico del sistema. Incluye tablas para roles, usuarios, mallas, ciclos, cursos, libros, vistas de libros y vistas de cursos. Esto permite que cada archivo tenga contexto y que las consultas sean consistentes con la organización curricular.

## Consideraciones técnicas

- El proyecto está diseñado para entornos locales o de prueba.
- Antes de llevarlo a producción, conviene reforzar seguridad de sesión y validación de archivos.
- Se recomienda revisar límites de tamaño para PDFs y permisos de carpeta.
- También es buena idea proteger mejor las credenciales de base de datos.

## Mejoras futuras

- Búsqueda avanzada por autor, ISBN y año.
- Ordenamiento y paginación en listados grandes.
- Gráficas más completas para estadísticas.
- Recuperación de contraseña para usuarios internos.
- Validaciones más estrictas para archivos subidos.

## Cierre

Este README está pensado para GitHub y resume el proyecto con una estructura clara, útil y visual. Explica qué hace, cómo funciona, cómo instalarlo y cómo navegarlo sin perder tiempo.