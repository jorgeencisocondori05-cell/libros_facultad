# 🌍 Despliegue en Producción

## Pasos para Subir a un Servidor en Vivo

### 1. Preparación Previa

#### ✅ Verificar Requisitos del Servidor
- PHP 7.4 o superior
- MySQL 5.7 o superior
- Acceso a cPanel o panel de hosting
- Espacio mínimo: 500MB

#### ✅ Configurar Seguridad Básica
```php
// En api/config.php
define('DB_PASS', 'contraseña_segura');  // NO usar 'root' sin contraseña

// Generar contraseña fuerte para profesor
$password = password_hash('contraseña_super_segura', PASSWORD_BCRYPT);
```

#### ✅ Crear .htaccess para Seguridad
```apache
# Proteger carpeta api
<Directory /public_html/libros_facultad/api>
    Order allow,deny
    Allow from all
</Directory>

# Proteger descargas (acceso solo descarga)
<Directory /public_html/libros_facultad/descargas>
    SetHandler default-handler
    php_flag engine off
</Directory>
```

---

### 2. Subir Archivos

#### Opción A: FTP (Recomendado)
```
1. Descargar FileZilla
2. Conectar con credenciales FTP del hosting
3. Navegar a public_html/
4. Crear carpeta: libros_facultad
5. Subir todos los archivos
6. Subir carpeta api/
```

#### Opción B: cPanel
```
1. Acceder a cPanel
2. File Manager
3. public_html → Crear carpeta libros_facultad
4. Upload archivos
5. Upload carpeta api/
```

#### Opción C: Git (Avanzado)
```bash
git clone https://github.com/tu-usuario/libros_facultad.git
cd libros_facultad
```

---

### 3. Configurar Base de Datos

#### Paso 1: Acceder a phpmyadmin
```
URL: tudominio.com/phpmyadmin
Usuario: cpanel_user
Contraseña: cpanel_password
```

#### Paso 2: Crear Base de Datos
```
1. Click "Nueva base de datos"
2. Nombre: biblioteca_estadistica
3. Crear
```

#### Paso 3: Importar Estructura
```
1. Seleccionar base de datos
2. Ir a Importar
3. Seleccionar database.sql
4. Ejecutar
```

#### Paso 4: Verificar Credenciales
```php
// En api/config.php
define('DB_HOST', 'localhost');  // Generalmente localhost
define('DB_USER', 'cpanel_usuario');  // Tu usuario cpanel
define('DB_PASS', 'contraseña_mysql');  // Contraseña DB
define('DB_NAME', 'biblioteca_estadistica');  // Nombre DB
```

---

### 4. Configurar Dominios y SSL

#### HTTPS (Obligatorio)
```
1. En cPanel → SSL/TLS
2. Autoinstalar certificado Let's Encrypt
3. Forzar HTTPS en .htaccess:

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

#### Subdominio (Opcional)
```
URL: biblioteca.tudominio.com

1. En cPanel → Subdomínios
2. Nombre: biblioteca
3. Dominio raíz: /public_html/libros_facultad
4. Crear
```

---

### 5. Archivos Importantes

#### Crear carpeta descargas con permisos
```bash
# En terminal del servidor (SSH)
mkdir -p /public_html/libros_facultad/descargas
chmod 755 /public_html/libros_facultad/descargas
chmod 644 /public_html/libros_facultad/descargas/*.pdf
```

#### Crear archivo para logs
```bash
touch /public_html/libros_facultad/logs.txt
chmod 777 /public_html/libros_facultad/logs.txt
```

---

### 6. Pruebas

#### Test 1: Acceso Web
```
Ir a: https://tudominio.com/libros_facultad/
```

#### Test 2: Login
```
Usuario: demo
Contraseña: demo123
```

#### Test 3: Subir Libro
```
1. Login como profesor
2. Ir a "Subir Libro"
3. Llenar formulario
4. Subir PDF de prueba
5. Verificar que aparece en "Mis Libros"
```

#### Test 4: Descargar
```
1. Volver a index.html (como alumno)
2. Filtrar y ver el libro subido
3. Hacer clic y descargar PDF
```

---

### 7. Configuración de Email (Opcional)

Para notificaciones por email:

```php
// Agregar en api/config.php
define('MAIL_FROM', 'noreply@tudominio.com');
define('MAIL_HOST', 'mail.tudominio.com');
define('MAIL_USER', 'usuario@tudominio.com');
define('MAIL_PASS', 'contraseña_email');
```

```php
// En api/upload_book.php (al final)
mail('profesor@universidad.edu', 
     'Libro subido exitosamente',
     'Tu libro fue publicado en la plataforma');
```

---

### 8. Backup Automático

#### Configurar backup en cPanel
```
1. cPanel → Backup
2. Configurar backup diario
3. Destino: email o FTP externo
```

#### Script de backup manual
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="biblioteca_backup_$DATE.sql"

mysqldump -u tu_usuario -p tu_contraseña biblioteca_estadistica > $BACKUP_FILE
tar -czf libros_facultad_backup_$DATE.tar.gz /home/usuario/public_html/libros_facultad/

# Enviar a FTP o email
```

---

### 9. Monitoreo

#### Revisar Logs
```
1. cPanel → Error Log
2. Buscar errores PHP
3. Revisar permisos de archivos
```

#### Verificar Rendimiento
```
1. cPanel → Analytics
2. Revisar uso de CPU/memoria
3. Revisar ancho de banda
```

---

### 10. Cambios de Seguridad

#### Cambiar Credenciales Demo
```sql
-- En phpmyadmin
UPDATE profesores 
SET contraseña = PASSWORD('contraseña_nueva_fuerte')
WHERE usuario = 'demo';
```

#### Crear Usuario Admin
```sql
INSERT INTO profesores (nombre, email, usuario, contraseña, departamento) 
VALUES ('Administrador', 'admin@universidad.edu', 'admin', 
        PASSWORD('contraseña_muy_segura'), 'Administración');
```

#### Deshabilitar Acceso Root DB
```
En MySQL:
DROP USER 'root'@'localhost';
```

---

## ⚠️ Checklist Predespliegue

```
☐ Base de datos creada
☐ Archivos subidos correctamente
☐ HTTPS configurado
☐ Credenciales db actualizadas
☐ Carpeta descargas con permisos 755
☐ Profesor demo testeado
☐ PDFs de ejemplo subidos
☐ Backup configurado
☐ Email configurado (opcional)
☐ Dominio/Subdominio apuntando correctamente
☐ SSL certificado activo
☐ Logs accesibles
```

---

## 📞 Troubleshooting Producción

### Error: "Conexión rechazada a BD"
```php
// Verificar en config.php:
1. DB_HOST (a veces es diferente en producción)
2. DB_USER y DB_PASS correctos
3. Base de datos existe
4. Usuario tiene permisos
```

### Error: "Permission denied"
```bash
# Verificar permisos:
ls -la /public_html/libros_facultad/
chmod 755 /public_html/libros_facultad/
chmod 755 /public_html/libros_facultad/api/
chmod 755 /public_html/libros_facultad/descargas/
```

### PDF no se descarga
```
1. Verificar que descargas/ existe
2. Verificar permisos (755 carpeta, 644 archivos)
3. Verificar .htaccess no bloquea descargas
```

---

## 🚀 URLs en Producción

```
Alumno:   https://tudominio.com/libros_facultad/
Profesor: https://tudominio.com/libros_facultad/admin.html
API:      https://tudominio.com/libros_facultad/api/
```

---

**¡Sistema en Vivo!** 🎉

Versión: 1.0  
Fecha: Marzo 2026
