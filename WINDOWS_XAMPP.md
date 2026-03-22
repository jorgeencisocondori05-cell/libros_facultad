# 🪟 Guía para Windows + XAMPP

## 🚀 Instalación en Windows

### Requisitos Previos
- Windows 10/11
- XAMPP instalado en `C:\xampp`
- Navegador actualizado

### Paso 1: Verificar XAMPP

```powershell
# Abrir PowerShell como Administrador
# Verificar que la carpeta existe
dir C:\xampp\htdocs\

# Resultado esperado: debe haber un listado de carpetas
```

### Paso 2: Navegar a la Carpeta del Proyecto

```powershell
cd C:\xampp\htdocs\libros_facultad\
dir
```

Deberías ver estos archivos:
```
Directory: C:\xampp\htdocs\libros_facultad\

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         22/3/2026    10:30 AM              api
d-----         22/3/2026    10:30 AM              descargas
-a----         22/3/2026    10:30 AM       1200  .htaccess
-a----         22/3/2026    10:30 AM       9000  admin.html
-a----         22/3/2026    10:30 AM       7000  admin_script.js
-a----         22/3/2026    10:30 AM        900  .gitignore
-a----         22/3/2026    10:30 AM       5000  index.html
-a----         22/3/2026    10:30 AM      20000  style.css
-a----         22/3/2026    10:30 AM       8000  script.js
-a----         22/3/2026    10:30 AM       3000  README.md
```

### Paso 3: Iniciar XAMPP

**Opción A: GUI (Recomendado)**
```
1. Presionar Windows + R
2. Escribir: C:\xampp\xampp-control.exe
3. Presionar Enter
4. Click en "Start" (botón verde) para Apache
5. Click en "Start" para MySQL
```

**Opción B: PowerShell**
```powershell
# Iniciar Apache
Start-Process "C:\xampp\apache\bin\httpd.exe"

# Iniciar MySQL
Start-Process "C:\xampp\mysql\bin\mysqld.exe"
```

### Paso 4: Verificar que Apache está corriendo

```powershell
# Verificar puerto 80
Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
```

O simplemente visita en el navegador:
```
http://localhost/
```

Deberías ver la página de XAMPP.

### Paso 5: Crear Base de Datos

**Opción A: phpMyAdmin (Recomendado)**
```
1. Ir a http://localhost/phpmyadmin/
2. Usuario: root
3. Contraseña: (dejar vacía)
4. Hacer clic en Entrar
5. Click en "Nuevo"
6. Nombre: biblioteca_estadistica
7. Crear
```

**Opción B: SQL Directo**
```powershell
# Navegar a la carpeta de MySQL
cd C:\xampp\mysql\bin\

# Acceder a MySQL
.\mysql.exe -u root

# En la consola MySQL:
CREATE DATABASE biblioteca_estadistica;
exit
```

### Paso 6: Importar Estructura de Base de Datos

**Opción A: phpMyAdmin**
```
1. Ir a http://localhost/phpmyadmin/
2. Seleccionar la base de datos "biblioteca_estadistica"
3. Ir a la pestaña "Importar"
4. Seleccionar archivo: C:\xampp\htdocs\libros_facultad\database.sql
5. Ejecutar
```

**Opción B: PowerShell**
```powershell
cd C:\xampp\mysql\bin\

# Importar archivo SQL
.\mysql.exe -u root biblioteca_estadistica < C:\xampp\htdocs\libros_facultad\database.sql
```

### Paso 7: Acceder a la Plataforma

Abre tu navegador e ir a:
```
http://localhost/libros_facultad/
```

¡Listo! Deberías ver la página principal con el menú de filtros.

---

## 🔐 Credenciales de Prueba

**Para profesores:**
```
Usuario: demo
Contraseña: demo123
```

**Para phpmyadmin:**
```
Usuario: root
Contraseña: (vacía)
```

---

## 🔧 Troubleshooting Específico para Windows

### Error: "Port 80 is already in use"
```powershell
# Encontrar qué programa está usando el puerto
Get-NetTCPConnection -LocalPort 80 | Select-Object OwningProcess

# Matar el proceso (reemplazar XXXX con el número de proceso)
Stop-Process -Id XXXX -Force

# O cambiar puerto en Apache:
# Editar: C:\xampp\apache\conf\httpd.conf
# Cambiar: Listen 80 → Listen 8080
# Luego acceder a: http://localhost:8080/libros_facultad/
```

### Error: MySQL no inicia
```powershell
# Asegurar que no hay otra instancia corriendo
Get-Process mysqld -ErrorAction SilentlyContinue | Stop-Process

# Reiniciar MySQL
Start-Service MySQL80  # o el número de versión

# O iniciar manualmente
C:\xampp\mysql\bin\mysqld.exe --port=3306
```

### Los estilos no cargan
```powershell
# Limpiar caché en navegador
# Ctrl + Shift + Supr
# Seleccionar: Imágenes y archivos en caché
# Limpiar datos

# O reiniciar XAMPP:
Stop-Process -Name httpd
Start-Process "C:\xampp\apache\bin\httpd.exe"
```

### Error: "Connection refused"
```powershell
# Verificar que MySQL está corriendo
Get-Process mysqld

# Resultado: debe haber un proceso mysqld en la lista

# Si no hay, iniciar:
Start-Service MySQL80
# O
.\mysql\bin\mysqld.exe
```

---

## 📁 Crear Carpeta de Descargas Manualmente

```powershell
# Si no se crea automáticamente:
New-Item -ItemType Directory -Path "C:\xampp\htdocs\libros_facultad\descargas" -Force

# Dar permisos (ejecutar como Administrador)
icacls "C:\xampp\htdocs\libros_facultad\descargas" /grant Users:F
```

---

## 📝 Editar Archivos de Configuración

### Editar config.php
```powershell
# Abrir con Notepad++
.\notepad++ C:\xampp\htdocs\libros_facultad\api\config.php

# O con editor por defecto
notepad C:\xampp\htdocs\libros_facultad\api\config.php
```

### Ver logs de Apache
```powershell
# Abrir log de errores
notepad C:\xampp\apache\logs\error.log

# Ver últimas líneas
Get-Content C:\xampp\apache\logs\error.log -Tail 20
```

### Ver logs de MySQL
```powershell
# Abrir log
notepad C:\xampp\mysql\data\COMPUTERNAME.err

# Ver últimas líneas
Get-Content "C:\xampp\mysql\data\*.err" -Tail 20
```

---

## ⚡ Scripts PowerShell Útiles

### Script de inicio rápido
```powershell
# Guardar como: iniciar_xampp.ps1

# Iniciar Apache
Write-Host "Iniciando Apache..."
Start-Process "C:\xampp\apache\bin\httpd.exe" -WindowStyle Hidden

# Iniciar MySQL
Write-Host "Iniciando MySQL..."
Start-Process "C:\xampp\mysql\bin\mysqld.exe" -WindowStyle Hidden

# Esperar un poco
Start-Sleep -Seconds 3

# Abrir navegador
Write-Host "Abriendo navegador..."
Start-Process "http://localhost/libros_facultad/"

Write-Host "✅ XAMPP iniciado correctamente"
```

### Script de parada
```powershell
# Guardar como: detener_xampp.ps1

# Detener Apache
Write-Host "Deteniendo Apache..."
Stop-Process -Name httpd -ErrorAction SilentlyContinue

# Detener MySQL
Write-Host "Deteniendo MySQL..."
Stop-Process -Name mysqld -ErrorAction SilentlyContinue

Write-Host "✅ XAMPP detenido"
```

### Ejecutar scripts
```powershell
# Cambiar política de ejecución (una sola vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ejecutar
.\iniciar_xampp.ps1
.\detener_xampp.ps1
```

---

## 🌐 Accesos Rápidos

```
Sitio Principal:    http://localhost/libros_facultad/
Panel de Profesores: http://localhost/libros_facultad/admin.html
phpMyAdmin:         http://localhost/phpmyadmin/
XAMPP Dashboard:    http://localhost/
```

---

## 📊 Comandos de Diagnóstico

```powershell
# Verificar puertos en uso
Get-NetTCPConnection -LocalAddress 127.0.0.1 | 
  Select-Object LocalPort, OwningProcess, State

# Verificar procesos Apache
Get-Process httpd -ErrorAction SilentlyContinue

# Verificar procesos MySQL
Get-Process mysqld -ErrorAction SilentlyContinue

# Ver espacio disco en C:
Get-Volume C | Select-Object DriveLetter, Size, SizeRemaining

# Ver carpeta de proyecto
Get-ChildItem "C:\xampp\htdocs\libros_facultad\" -Recurse | 
  Measure-Object -Property Length -Sum
```

---

## 🔐 Configurar Contraseña para MySQL (Opcional)

```powershell
cd C:\xampp\mysql\bin\

# Conectar sin contraseña
.\mysql.exe -u root

# En MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'mi_nueva_contraseña';
FLUSH PRIVILEGES;
exit

# Luego editar C:\xampp\htdocs\libros_facultad\api\config.php
# Cambiar: define('DB_PASS', ''); 
# Por:     define('DB_PASS', 'mi_nueva_contraseña');
```

---

## 📱 Acceder desde Otro Dispositivo

```
1. Encontrar IP de tu PC
   ipconfig

2. Buscar la línea "IPv4 Address" (ej: 192.168.1.100)

3. Desde otro dispositivo en la misma red:
   http://192.168.1.100/libros_facultad/

Nota: Solo funciona si Apache está iniciado
```

---

## 🎯 Resumen de Pasos (1-2-3)

```
1️⃣  Iniciar XAMPP (Apache + MySQL)
    ↓
2️⃣  Ir a http://localhost/libros_facultad/
    ↓
3️⃣  ¡Usar la plataforma!
```

---

**Guía creada:** 22 de Marzo, 2026  
**Sistema:** Windows + XAMPP  
**Versión:** 1.0  
**Estado:** Listo para usar
