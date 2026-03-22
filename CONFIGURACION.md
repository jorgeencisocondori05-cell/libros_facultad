# Configuración de la Biblioteca Digital

## 🔧 Archivos de Configuración

### config.php
Contiene:
- Credenciales de la base de datos
- Creación automática de tablas
- Datos iniciales de ciclos y cursos
- Profesor de demo

### Cambiar credenciales de la BD

Editar los valores en `api/config.php`:
```php
define('DB_HOST', 'localhost');    // Host del servidor
define('DB_USER', 'root');         // Usuario MySQL
define('DB_PASS', '');             // Contraseña MySQL
define('DB_NAME', 'biblioteca_estadistica');  // Nombre BD
```

## 🔐 Cambiar contraseña del profesor demo

### Opción 1: Usar phpmyadmin
1. Ir a http://localhost/phpmyadmin/
2. Seleccionar tabla `profesores`
3. Editar el usuario 'demo'
4. Cambiar la contraseña (puede ser texto plano)

### Opción 2: SQL directo
```sql
UPDATE profesores SET contraseña = PASSWORD('nueva_contraseña') 
WHERE usuario = 'demo';
```

O con bcrypt (más seguro):
```php
$hash = password_hash('nueva_contraseña', PASSWORD_BCRYPT);
echo $hash; // Copiar este valor
```

Luego:
```sql
UPDATE profesores SET contraseña = '[hash_generado]' 
WHERE usuario = 'demo';
```

## 📦 Versiones Mínimas Requeridas

- PHP: 7.4 o superior
- MySQL: 5.7 o superior
- JavaScript: ES6 compatible

## 🌐 Configuración de Dominio (Producción)

Si quieres usar en un dominio en lugar de localhost:

1. Cambiar URL base en JavaScript:
   - Buscar `fetch(` en `script.js` y `admin_script.js`
   - Cambiar ruta relativa si es necesario

2. Actualizar .htaccess para el dominio

3. Configurar VirtualHost en Apache

## 📱 Responsive Design

El sitio está optimizado para:
- Desktop (1400px)
- Tablet (768px)
- Mobile (320px+)

## 🎨 Personalizar Colores

En `style.css`, cambiar las variables CSS:
```css
:root {
    --primary-color: #2c3e50;      /* Azul oscuro */
    --secondary-color: #3498db;    /* Azul */
    --accent-color: #e74c3c;       /* Rojo */
    --success-color: #27ae60;      /* Verde */
}
```

## 📝 Limitaciones Actuales

- Máximo 50MB por archivo PDF
- No hay autenticación de alumnos (acceso libre)
- Las sesiones se guardan en localStorage (logout al limpiar caché)

## 🚀 Mejoras Futuras

- Autenticación de alumnos
- Comentarios y valoraciones
- Sistema de favoritos
- Búsqueda avanzada
- Exportar reportes
- Notificaciones por email
- Integración con LMS (Moodle, Canvas)
- Generación de códigos QR

---

**Creado:** 22 de marzo de 2026
**Versión:** 1.0
