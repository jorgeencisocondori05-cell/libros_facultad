# 📚 Índice de Documentación

Bienvenido a la **Biblioteca Digital de la Carrera de Estadística**. Esta carpeta contiene una plataforma web completa para que alumnos consulten libros y profesores los suban.

---

## 📖 Documentación Disponible

### ⚡ Para Comenzar Rápido

**👉 Inicia aquí si tienes prisa:**

1. **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)** (5 minutos)
   - Cómo iniciar en 3 pasos
   - Credenciales de prueba
   - Navegación básica
   - Problemas comunes más rápidos

2. **[WINDOWS_XAMPP.md](WINDOWS_XAMPP.md)** (específico para Windows)
   - Pasos exactos en Windows
   - Comandos PowerShell
   - Troubleshooting Windows
   - Scripts útiles

---

### 📚 Documentación Principal

3. **[README.md](README.md)** (Guía Completa)
   - Descripción general
   - Requisitos y especificaciones
   - Instalación paso a paso
   - Estructura del proyecto
   - Cómo usar para alumnos y profesores
   - Agregar cursos y profesores
   - Solucionar problemas

4. **[PROYECTO.md](PROYECTO.md)** (Referencia Técnica)
   - Stack tecnológico
   - Estructura de base de datos
   - Estructura de carpetas
   - Flujos principales
   - Endpoints de API
   - Optimizaciones
   - Métricas de rendimiento

---

### 🔧 Configuración y Personalización

5. **[CONFIGURACION.md](CONFIGURACION.md)** (Ajustes Avanzados)
   - Archivos de configuración
   - Cambiar credenciales
   - Personalizar colores
   - Configuración de dominio
   - Mejoras futuras

6. **[DESPLIEGUE.md](DESPLIEGUE.md)** (Producción)
   - Preparación para servidor en vivo
   - Subida de archivos (FTP/cPanel)
   - Configuración de base de datos
   - SSL/HTTPS
   - Backup automático
   - Monitoreo
   - Checklist predespliegue

---

### 🗂️ Información de Proyecto

7. **[INVENTARIO.md](INVENTARIO.md)** (Listado Completo)
   - Todos los archivos creados
   - Estructura del proyecto
   - Estadísticas de código
   - Características implementadas
   - Checklist de completitud

8. **[ÍNDICE.md](ÍNDICE.md)** (Este Archivo)
   - Mapa de la documentación
   - Dónde encontrar qué

---

### 💾 Base de Datos

9. **[database.sql](database.sql)** (Script de Instalación)
   - Crear tablas
   - Insertar datos iniciales
   - Crear índices
   - Crear vistas

10. **[datos_ejemplo.sql](datos_ejemplo.sql)** (Datos de Prueba)
    - Profesores adicionales
    - Libros de ejemplo
    - Distribución por ciclos

---

## 🎯 Buscar por Tarea

### Si necesitas...

#### **"Quiero empezar ahora"**
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md) (5 min)

#### **"Estoy en Windows con XAMPP"**
→ [WINDOWS_XAMPP.md](WINDOWS_XAMPP.md)

#### **"Necesito instalar todo"**
→ [README.md](README.md) - Sección "Instalación"

#### **"Quiero personalizar colores/estilos"**
→ [CONFIGURACION.md](CONFIGURACION.md) - Sección "Personalizar colores"

#### **"Voy a subir a producción"**
→ [DESPLIEGUE.md](DESPLIEGUE.md)

#### **"Necesito entender la arquitectura"**
→ [PROYECTO.md](PROYECTO.md)

#### **"¿Qué archivos hay?"**
→ [INVENTARIO.md](INVENTARIO.md)

#### **"Tengo un error"**
→ [README.md](README.md) - Sección "Solucionar Problemas"
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md) - Sección "Problemas Comunes"

#### **"Quiero agregar más cursos"**
→ [README.md](README.md) - Sección "Agregar Nuevos Cursos"

#### **"Quiero crear un nuevo profesor"**
→ [README.md](README.md) - Sección "Agregar Nuevos Profesores"

---

## 📊 Estructura de Archivos del Proyecto

```
libros_facultad/
├── 📖 DOCUMENTACIÓN
│   ├── README.md              ← Guía principal
│   ├── GUIA_RAPIDA.md         ← Inicio rápido
│   ├── WINDOWS_XAMPP.md       ← Específico Windows
│   ├── CONFIGURACION.md       ← Ajustes avanzados
│   ├── DESPLIEGUE.md          ← Producción
│   ├── PROYECTO.md            ← Referencia técnica
│   ├── INVENTARIO.md          ← Listado de archivos
│   └── ÍNDICE.md              ← Este archivo
│
├── 💾 BASE DE DATOS
│   ├── database.sql           ← Crear tablas
│   └── datos_ejemplo.sql      ← Datos de prueba
│
├── 🌐 FRONTEND
│   ├── index.html             ← Página principal
│   ├── admin.html             ← Panel profesores
│   ├── style.css              ← Estilos
│   ├── script.js              ← Lógica principal
│   └── admin_script.js        ← Lógica admin
│
├── 🔌 BACKEND API
│   └── api/
│       ├── config.php         ← Configuración BD
│       ├── login.php          ← Autenticación
│       ├── get_books.php      ← Obtener libros
│       ├── get_courses.php    ← Obtener cursos
│       ├── upload_book.php    ← Subir libro
│       ├── delete_book.php    ← Eliminar libro
│       ├── get_profesor_books.php  ← Libros profesor
│       └── get_stats.php      ← Estadísticas
│
├── 📥 DESCARGAS (creado automáticamente)
│   └── descargas/             ← Almacenamiento PDF
│
└── ⚙️ CONFIGURACIÓN
    └── .htaccess              ← Config Apache
```

---

## 🔑 Información Clave

### Credenciales de Prueba
```
Usuario: demo
Contraseña: demo123
```

### URLs Principales
```
Alumno:    http://localhost/libros_facultad/
Profesor:  http://localhost/libros_facultad/admin.html
phpmyadmin: http://localhost/phpmyadmin/
```

### Base de Datos
```
Nombre: biblioteca_estadistica
Usuario MySQL: root
Contraseña: (vacía por defecto)
```

---

## ✨ Características

### Para Alumnos 👥
- Visualizar libros por ciclo
- Filtrar por curso
- Buscar por título/autor
- Descargar PDFs
- Ver detalles completos

### Para Profesores 👨‍🏫
- Login seguro
- Subir libros PDF
- Gestionar libros
- Ver estadísticas
- Eliminar libros

### Sistema 🔧
- 10 ciclos académicos
- 37 cursos de ejemplo
- Base de datos relacional
- API REST JSON
- Responsive design
- Almacenamiento seguro

---

## 🚀 Flujo de Uso Rápido

### Alumno
```
1. Ir a http://localhost/libros_facultad/
2. Seleccionar ciclo
3. Filtrar por curso (opcional)
4. Buscar libro (opcional)
5. Ver detalles
6. Descargar PDF
```

### Profesor
```
1. Ir a admin.html
2. Ingresar: demo / demo123
3. Subir Libro (rellenar formulario)
4. Ver "Mis Libros"
5. Gestionar/Eliminar
6. Ver Estadísticas
```

---

## 🆘 Ayuda Rápida

### "No funciona nada"
1. ¿XAMPP iniciado? → [WINDOWS_XAMPP.md](WINDOWS_XAMPP.md)
2. ¿BD creada? → [README.md](README.md)
3. ¿Archivos en el lugar correcto? → [INVENTARIO.md](INVENTARIO.md)

### "Tengo un error específico"
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md) - "Problemas Comunes"
→ [README.md](README.md) - "Solucionar Problemas"

### "Quiero personalizar"
→ [CONFIGURACION.md](CONFIGURACION.md)

### "Voy a producción"
→ [DESPLIEGUE.md](DESPLIEGUE.md)

---

## 📚 Recursos Adicionales

### SQL para Consultas Útiles
```sql
-- Ver todos los libros
SELECT l.*, c.nombre as curso_nombre 
FROM libros l 
JOIN cursos c ON l.curso_id = c.id;

-- Ver libros por profesor
SELECT * FROM libros 
WHERE profesor_id = 1;

-- Estadísticas
SELECT COUNT(*) as total, SUM(descargas) as descargas 
FROM libros;
```

### Comandos MySQL Útiles
```bash
# Conectar
mysql -u root biblioteca_estadistica

# Ver bases de datos
SHOW DATABASES;

# Ver tablas
SHOW TABLES;

# Ver estructura
DESC libros;

# Contar registros
SELECT COUNT(*) FROM libros;
```

---

## 🎓 Ciclos Académicos Disponibles

| Ciclo | Cursos |
|-------|--------|
| I | Introducción a la Ciencia de Datos |
| II | Técnicas de Exploración de Datos |
| III | Ingeniería de Procesos, Lenguaje de Programación 1 |
| IV | Análisis Estadístico, Lenguaje de Programación 2, Métodos de Optimización, Sistemas de Gestión de Base de Datos 1 |
| V | Análisis de Regresión, Cálculo de Probabilidades, Diseños Experimentales, Estrategias de Muestreo, Lenguaje de Programación 3 |
| VI | Sistema de Gestión de Base de Datos 2, Inferencia Estadística, Diseños Experimentales 2, Técnicas Multivariadas, Algoritmia |
| VII | Sistemas de Información Gerencial, Modelos Lineales 1, Estadística Bayesiana, Estadística Computacional, Marketing |
| VIII | Estadística No Paramétrica, Gestión Estratégica de Datos, Investigación de Mercados, Máquinas de Aprendizaje, Modelos Lineales 2, Seminario en Estadística e Informática |
| IX | Análisis de Series de Tiempo, Ciencia de Datos 1, Estadística Espacial, Gestión de Proyectos de Información, Seminario en Estadística e Informática 2 |
| X | Ciencia de Datos 2, Seminario en Estadística e Informática 3, Tecnologías Emergentes |

---

## 📝 Notas Importantes

✅ La plataforma está **100% funcional**  
✅ Lista para usar en **desarrollo o producción**  
✅ Documentación **completa y exhaustiva**  
✅ Base de datos **bien estructurada**  
✅ API **RESTful JSON**  
✅ Diseño **responsive y moderno**  

---

## 📞 Soporte

Para problemas:
1. Revisar la documentación relevante
2. Buscar en "Solucionar Problemas"
3. Verificar base de datos en phpmyadmin
4. Revisar logs de Apache

---

## 🗺️ Mapa de Navegación

```
ÍNDICE (este archivo)
├── GUIA_RAPIDA ← Empieza aquí
├── WINDOWS_XAMPP ← Si estás en Windows
├── README ← Guía completa
├── PROYECTO ← Técnica
├── CONFIGURACION ← Personalizar
└── DESPLIEGUE ← Producción
```

---

## ✅ Checklist Inicial

- [ ] Leer GUIA_RAPIDA.md (5 min)
- [ ] Iniciar XAMPP
- [ ] Crear base de datos
- [ ] Acceder a http://localhost/libros_facultad/
- [ ] Probar como alumno
- [ ] Login como profesor (demo/demo123)
- [ ] Subir un libro de prueba
- [ ] Descargar el libro como alumno
- [ ] ¡Éxito! 🎉

---

## 🎉 ¡Listo!

Ahora tienes una **plataforma educativa completa y funcional**.

**Próximo paso:** Lee [GUIA_RAPIDA.md](GUIA_RAPIDA.md)

---

**Versión:** 1.0  
**Fecha:** 22 de Marzo, 2026  
**Estado:** ✅ Completamente Funcional  
**Soporte:** Ver documentación arriba
