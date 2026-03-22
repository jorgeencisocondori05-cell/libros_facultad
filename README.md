# 📚 Biblioteca Digital - Carrera de Estadística

Sistema web completo para la gestión y consulta de libros académicos por ciclos y cursos.

## 🌟 Características

- **Para Alumnos:**
  - Visualización de libros organizados por ciclo y curso
  - Sistema de filtros avanzado
  - Búsqueda por título y autor
  - Vista detallada de libros
  - Descarga de archivos PDF

- **Para Profesores:**
  - Autenticación segura (usuario y contraseña)
  - Subida de libros en PDF
  - Gestión de libros subidos
  - Estadísticas de descargas
  - Eliminación de libros

## 📋 Requisitos

- XAMPP o servidor PHP 7.4+
- MySQL 5.7+
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## 🚀 Instalación

### 1. Descargar el proyecto
```bash
# Copiar la carpeta libros_facultad a:
# C:\xampp\htdocs\libros_facultad
```

### 2. Crear carpetas necesarias
```bash
# La carpeta 'descargas' se crea automáticamente al subir el primer libro
```

### 3. Iniciar XAMPP
- Abrir el Panel de Control de XAMPP
- Iniciar Apache
- Iniciar MySQL

### 4. Acceder al sitio
```
http://localhost/libros_facultad/
```

## 🔐 Credenciales por Defecto

**Usuario Demo para Profesores:**
- Usuario: `demo`
- Contraseña: `demo123`

## 📂 Estructura del Proyecto

```
libros_facultad/
├── index.html          # Página principal para alumnos
├── admin.html          # Panel de administración de profesores
├── style.css           # Estilos globales
├── script.js           # Scripts de la página principal
├── admin_script.js     # Scripts del panel administrativo
├── api/
│   ├── config.php      # Configuración de base de datos
│   ├── login.php       # Autenticación de profesores
│   ├── get_books.php   # Obtener todos los libros
│   ├── get_courses.php # Obtener cursos por ciclo
│   ├── upload_book.php # Subir nuevo libro
│   ├── delete_book.php # Eliminar libro
│   ├── get_profesor_books.php  # Obtener libros del profesor
│   └── get_stats.php   # Obtener estadísticas
└── descargas/          # Carpeta para archivos PDF (se crea automáticamente)

```

## 🎯 Cómo Usar

### Para Alumnos

1. Ir a http://localhost/libros_facultad/
2. Seleccionar un ciclo en el filtro
3. Opcionalmente, seleccionar un curso específico
4. Usar la búsqueda para encontrar libros por título o autor
5. Hacer clic en un libro para ver detalles
6. Descargar el PDF si está disponible

### Para Profesores

1. Ir a http://localhost/libros_facultad/admin.html
2. Ingresar con las credenciales:
   - Usuario: `demo`
   - Contraseña: `demo123`
3. **Subir Libro:**
   - Rellenar todos los campos requeridos (*)
   - Seleccionar un PDF de máximo 50MB
   - Hacer clic en "Subir Libro"
4. **Mis Libros:**
   - Ver lista de libros subidos
   - Eliminar libros si es necesario
5. **Estadísticas:**
   - Ver total de libros, libros personales y descargas

## 📊 Ciclos y Cursos Disponibles

### I Ciclo
- Matemática I
- Estadística Descriptiva

### II Ciclo
- Probabilidad I

### III Ciclo
- Estadística Inferencial

### IV Ciclo
- Análisis Multivariado

### V Ciclo
- Series de Tiempo

### VI Ciclo
- Estadística Bayesiana

### VII Ciclo
- Minería de Datos

### VIII Ciclo
- Seminario de Tesis

*Nota: Puedes agregar más cursos directamente en la base de datos MySQL*

## 🔒 Seguridad

- Las contraseñas se almacenan hasheadas (bcrypt)
- Las sesiones se guardan en localStorage (navegador del cliente)
- Los archivos PDF se almacenan en carpeta protegida
- Validación de tipos de archivo en servidor

## 📝 Agregar Nuevos Cursos

Para agregar nuevos cursos, accede a phpmyadmin:

```
http://localhost/phpmyadmin/
```

1. Seleccionar base de datos `biblioteca_estadistica`
2. Ir a tabla `cursos`
3. Insertar nuevo curso con su ciclo correspondiente

**Ejemplo SQL:**
```sql
INSERT INTO cursos (nombre, ciclo_id, descripcion) 
VALUES ('Nuevo Curso', 1, 'Descripción del curso');
```

## 👥 Agregar Nuevos Profesores

En phpmyadmin, tabla `profesores`:

```sql
INSERT INTO profesores (nombre, email, usuario, contraseña, departamento) 
VALUES ('Juan Pérez', 'juan@ejemplo.com', 'juan.perez', PASSWORD('micontraseña'), 'Estadística');
```

**O usar PHP:**
```php
$contraseña_hasheada = password_hash('micontraseña', PASSWORD_BCRYPT);
```

## 🐛 Solucionar Problemas

### Error: "Error al cargar los libros"
- Verificar que MySQL esté iniciado
- Verificar permisos de carpeta en htdocs

### Error: "La carpeta descargas no existe"
- Crear manualmente: C:\xampp\htdocs\libros_facultad\descargas
- O subir un libro desde el panel administrativo

### Login no funciona
- Verificar que el usuario exista en la tabla `profesores`
- Verificar la contraseña (base de datos es sensible a mayúsculas)

### Los estilos no se cargan
- Limpiar caché del navegador (Ctrl+Shift+Supr)
- Verificar que style.css esté en la carpeta raíz

## 📧 Contacto y Soporte

Para reportar bugs o solicitar nuevas características, documentar el problema con:
- Navegador y versión
- Mensaje de error exacto
- Pasos para reproducir

## 📄 Licencia

Proyecto educativo para la Carrera de Estadística - 2026

---

**Última actualización:** 22 de marzo de 2026
