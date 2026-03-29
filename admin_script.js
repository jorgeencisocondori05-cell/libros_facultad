// Variables globales
let profesorActual = null;

// Verificar si hay sesión al cargar
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    cargarCiclos();
    document.getElementById('ciclo').addEventListener('change', cargarCursos);
});

// Cargar ciclos desde la base de datos
async function cargarCiclos() {
    const cicloSelect = document.getElementById('ciclo');
    cicloSelect.innerHTML = '<option value="">Seleccione un ciclo</option>';
    cicloSelect.disabled = true;

    try {
        const response = await fetch('api/get_cycles.php');
        const data = await response.json();

        if (data.success && data.cycles.length > 0) {
            data.cycles.forEach(ciclo => {
                const option = document.createElement('option');
                option.value = ciclo.id;
                option.textContent = `${ciclo.numero} - ${ciclo.nombre}`;
                cicloSelect.appendChild(option);
            });
            cicloSelect.disabled = false;
        } else {
            console.warn('No se encontraron ciclos en la API; se usan valores por defecto.');
            cargarCiclosFallback(cicloSelect);
        }
    } catch (error) {
        console.error('Error al cargar ciclos:', error);
        cargarCiclosFallback(cicloSelect);
    }
}

function cargarCiclosFallback(cicloSelect) {
    const ciclosFallback = [
        {id: 1, numero: 'I Ciclo'},
        {id: 2, numero: 'II Ciclo'},
        {id: 3, numero: 'III Ciclo'},
        {id: 4, numero: 'IV Ciclo'},
        {id: 5, numero: 'V Ciclo'},
        {id: 6, numero: 'VI Ciclo'},
        {id: 7, numero: 'VII Ciclo'},
        {id: 8, numero: 'VIII Ciclo'},
        {id: 9, numero: 'IX Ciclo'},
        {id: 10, numero: 'X Ciclo'}
    ];

    cicloSelect.innerHTML = '<option value="">Seleccione un ciclo</option>';
    ciclosFallback.forEach(ciclo => {
        const option = document.createElement('option');
        option.value = ciclo.id;
        option.textContent = ciclo.numero;
        cicloSelect.appendChild(option);
    });
    cicloSelect.disabled = false;
}


// Verificar sesión
function verificarSesion() {
    const sesion = localStorage.getItem('profesor_sesion');
    if (sesion) {
        const profesor = JSON.parse(sesion);
        profesorActual = profesor;
        mostrarPanel();
    }
}

// Login
async function loginProfesor(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const contraseña = document.getElementById('contraseña').value;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.style.display = 'none';
    
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                contraseña: contraseña
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar sesión
            localStorage.setItem('profesor_sesion', JSON.stringify(data.profesor));
            profesorActual = data.profesor;
            mostrarPanel();
            cargarMisLibros();
            cargarEstadisticas();
        } else {
            errorDiv.textContent = data.message || 'Usuario o contraseña incorrectos';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = 'Error de conexión al servidor';
        errorDiv.style.display = 'block';
    }
}

// Mostrar panel administrativo
function mostrarPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    document.getElementById('profesor-nombre').textContent = `Bienvenido, ${profesorActual.nombre}`;
}

// Logout
function logout() {
    if (confirm('¿Desea cerrar sesión?')) {
        localStorage.removeItem('profesor_sesion');
        profesorActual = null;
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('admin-section').style.display = 'none';
        document.getElementById('usuario').value = '';
        document.getElementById('contraseña').value = '';
        limpiarFormulario();
    }
}

// Cambiar tab
function cambiarTab(tab, event) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Mostrar tab seleccionado
    document.getElementById('tab-' + tab).classList.add('active');
    
    // Activar botón
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Cargar datos si es necesario
    if (tab === 'mis-libros') {
        cargarMisLibros();
    } else if (tab === 'estadisticas') {
        cargarEstadisticas();
    }
}

// Cargar cursos
async function cargarCursos() {
    const ciclo = document.getElementById('ciclo').value;
    const cursoSelect = document.getElementById('curso');

    cursoSelect.innerHTML = '<option value="">Seleccione un curso</option>';
    cursoSelect.disabled = true;

    if (!ciclo) {
        return;
    }

    try {
        const response = await fetch(`api/get_courses.php?ciclo=${ciclo}`);
        const data = await response.json();

        if (data.success && data.courses.length > 0) {
            data.courses.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.nombre;
                cursoSelect.appendChild(option);
            });
            cursoSelect.disabled = false;
        } else {
            cursoSelect.innerHTML = '<option value="">No hay cursos para este ciclo</option>';
            cursoSelect.disabled = false; // permitir que el usuario vea la lista aunque esté vacía
        }
    } catch (error) {
        console.error('Error:', error);
        cursoSelect.innerHTML = '<option value="">Error al cargar cursos</option>';
        cursoSelect.disabled = false;
    }
}

// Subir libro
async function subirLibro(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const ciclo = document.getElementById('ciclo').value;
    const curso = document.getElementById('curso').value;
    const archivo = document.getElementById('archivo').files[0];
    const año = document.getElementById('año').value;
    const isbn = document.getElementById('isbn').value;
    const descripcion = document.getElementById('descripcion').value;
    const messageDiv = document.getElementById('upload-message');
    
    if (!ciclo || !curso) {
        mostrarMensaje(messageDiv, 'Seleccione un ciclo y un curso antes de subir el libro', 'error');
        return;
    }
    
    if (!archivo) {
        mostrarMensaje(messageDiv, 'Por favor seleccione un archivo PDF', 'error');
        return;
    }
    
    if (archivo.type !== 'application/pdf') {
        mostrarMensaje(messageDiv, 'El archivo debe ser un PDF', 'error');
        return;
    }
    
    if (archivo.size > 50 * 1024 * 1024) { // 50MB
        mostrarMensaje(messageDiv, 'El archivo no debe exceder 50MB', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('autor', autor);
    formData.append('ciclo', ciclo);
    formData.append('curso', curso);
    formData.append('año', año);
    formData.append('isbn', isbn);
    formData.append('descripcion', descripcion);
    formData.append('archivo', archivo);
    formData.append('profesor_id', profesorActual.id);
    
    try {
        const response = await fetch('api/upload_book.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje(messageDiv, 'Libro subido exitosamente', 'success');
            document.getElementById('form-libro').reset();
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            mostrarMensaje(messageDiv, data.message || 'Error al subir el libro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(messageDiv, 'Error de conexión', 'error');
    }
}

// Cargar mis libros
async function cargarMisLibros() {
    const container = document.getElementById('mis-libros-container');
    
    try {
        const response = await fetch(`api/get_profesor_books.php?profesor_id=${profesorActual.id}`);
        const data = await response.json();
        
        if (data.success && data.books.length > 0) {
            container.innerHTML = data.books.map(libro => {
                const archivo = libro.archivo_pdf && libro.archivo_pdf !== 'null' && libro.archivo_pdf !== 'undefined' ? libro.archivo_pdf.trim() : '';
                const botonDescarga = archivo ? `<a href="/libros_facultad/descargas/${encodeURIComponent(archivo)}" target="_blank" class="btn btn-primary" style="margin-right: 8px;">Descargar</a>` : '';

                return `
                <div class="libro-item">
                    <div class="libro-info">
                        <h4>${libro.titulo}</h4>
                        <p><strong>Autor:</strong> ${libro.autor}</p>
                        <p><strong>Curso:</strong> ${libro.curso_nombre}</p>
                        <p><strong>Ciclo:</strong> ${libro.ciclo_numero || libro.ciclo_nombre || 'N/A'}</p>
                        <p><strong>Fecha:</strong> ${new Date(libro.fecha_subida).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div class="libro-actions">
                        ${botonDescarga}
                        <button class="btn btn-danger" onclick="eliminarLibro(${libro.id})">Eliminar</button>
                    </div>
                </div>
            `;
            }).join('');
        } else {
            container.innerHTML = '<p style="text-align: center; color: #999;">Aún no has subido ningún libro</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="color: red;">Error al cargar los libros</p>';
    }
}

// Eliminar libro
async function eliminarLibro(libroId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        return;
    }
    
    try {
        const response = await fetch('api/delete_book.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                libro_id: libroId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Libro eliminado exitosamente');
            cargarMisLibros();
        } else {
            alert('Error al eliminar el libro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Cargar estadísticas
async function cargarEstadisticas() {
    try {
        const response = await fetch(`api/get_stats.php?profesor_id=${profesorActual.id}`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('stat-total-libros').textContent = data.stats.total_libros;
            document.getElementById('stat-mis-libros').textContent = data.stats.mis_libros;
            document.getElementById('stat-descargas').textContent = data.stats.descargas;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Mostrar mensaje
function mostrarMensaje(elemento, mensaje, tipo) {
    elemento.className = `alert alert-${tipo}`;
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('form-libro').reset();
    document.getElementById('upload-message').style.display = 'none';
}
