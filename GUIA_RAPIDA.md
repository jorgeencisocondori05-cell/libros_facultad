# 🚀 GUÍA RÁPIDA DE INICIO

## ⚡ En 5 minutos

### 1. Iniciar Servidor (3 segundos)
- Abrir XAMPP Control Panel
- Click en **Start** para Apache
- Click en **Start** para MySQL

### 2. Ingresar a la Plataforma (3 segundos)
```
http://localhost/libros_facultad/
```

### 3. Explorar como Alumno (2 minutos)
✓ Ver libros disponibles
✓ Filtrar por ciclo y curso
✓ Buscar por título o autor
✓ Descargar PDFs

### 4. Ingresar como Profesor (1 minuto)
1. Click en "Acceso Profesores"
2. Usuario: `demo`
3. Contraseña: `demo123`
4. ¡Listo! Ya puedes subir libros

---

## 📚 Flujo de Alumno

```
1. Acceder a index.html
   ↓
2. Seleccionar ciclo
   ↓
3. Seleccionar curso (opcional)
   ↓
4. Buscar libro (opcional)
   ↓
5. Ver detalles del libro
   ↓
6. Descargar PDF
```

---

## 👨‍🏫 Flujo de Profesor

```
1. Acceder a admin.html
   ↓
2. Ingresar usuario y contraseña
   ↓
3. Ir a "Subir Libro"
   ↓
4. Completar formulario:
   - Título
   - Autor
   - Ciclo
   - Curso
   - PDF (máx 50MB)
   - Descripción (opcional)
   - ISBN (opcional)
   - Año (opcional)
   ↓
5. Click "Subir Libro"
   ↓
6. Ver en "Mis Libros"
```

---

## 🔧 Instalación Manual (Si es Necesario)

### Paso 1: Crear Base de Datos
```bash
1. Abrir http://localhost/phpmyadmin/
2. Click en "Nuevo" o "Nueva base de datos"
3. Nombre: biblioteca_estadistica
4. Crear
5. Copiar contenido de database.sql
6. Pegar en pestaña SQL
7. Ejecutar
```

### Paso 2: Verificar Carpeta
```bash
# Asegurar que existe:
C:\xampp\htdocs\libros_facultad\
```

### Paso 3: Crear Carpeta Descargas
```bash
# Crear manualmente si es necesario:
C:\xampp\htdocs\libros_facultad\descargas\
```

### Paso 4: Acceder
```
http://localhost/libros_facultad/
```

---

## 🆘 Problemas Comunes

### ❌ "No se conecta a la base de datos"
**Solución:**
1. Verificar que MySQL esté corriendo (verde en XAMPP)
2. Verificar credenciales en `api/config.php`
3. Ejecutar database.sql en phpmyadmin

### ❌ "Los estilos no se cargan"
**Solución:**
1. Presionar Ctrl+Shift+Supr (borrar caché)
2. Recargar la página
3. Verificar que style.css exista

### ❌ "Error al subir libro"
**Solución:**
1. Verificar que sea un PDF
2. Verificar que no pese más de 50MB
3. Verificar permisos de carpeta descargas
4. Crear carpeta descargas si no existe

### ❌ "Login no funciona"
**Solución:**
1. Verificar usuario: `demo`
2. Verificar contraseña: `demo123`
3. En phpmyadmin, tabla profesores
4. Si es necesario, actualizar contraseña

---

## 📞 Pasos Siguientes

1. **Cambiar credenciales por defecto**
   - Editar contraseña de "demo" en phpmyadmin

2. **Agregar más profesores**
   - phpmyadmin → tabla profesores → Insertar

3. **Agregar más cursos**
   - phpmyadmin → tabla cursos → Insertar

4. **Insertar datos de ejemplo**
   - Ejecutar datos_ejemplo.sql en phpmyadmin

5. **Personalizar colores**
   - Editar variables CSS en style.css

---

## 📁 Estructura Mínima Necesaria

```
libros_facultad/
├── index.html              ✓
├── admin.html              ✓
├── style.css               ✓
├── script.js               ✓
├── admin_script.js         ✓
├── api/config.php          ✓
├── api/login.php           ✓
├── api/get_books.php       ✓
├── api/get_courses.php     ✓
├── api/upload_book.php     ✓
└── descargas/              (se crea automáticamente)
```

---

## ✨ Características Principales

### Para Alumnos 👥
- ✓ Ver libros por ciclo
- ✓ Filtrar por curso
- ✓ Buscar por nombre/autor
- ✓ Descargar PDFs
- ✓ Ver detalles completos

### Para Profesores 👨‍🏫
- ✓ Login seguro
- ✓ Subir libros PDF
- ✓ Gestionar sus libros
- ✓ Ver estadísticas
- ✓ Eliminar libros

---

## 🎯 Objetivo Logrado

```
✓ Plataforma funcionando
✓ Alumnos consultando libros
✓ Profesores subiendo libros
✓ Base de datos activa
✓ Descargas disponibles
```

---

**¡Listo para usar!** 🎉

Para más información, ver README.md o CONFIGURACION.md
