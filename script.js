// Variable para almacenar todos los libros
let todosLibros = [];

// Cargar todos los libros
async function cargarLibros() {
    try {
        const response = await fetch('api/get_books.php');
        const data = await response.json();
        
        if (data.success) {
            todosLibros = data.books;
            mostrarLibros(todosLibros);
        } else {
            mostrarError('Error al cargar los libros');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
}

// Cargar ciclos para el filtro
async function cargarCiclosFiltro() {
    const cicloFilter = document.getElementById('ciclo-filter');
    cicloFilter.innerHTML = '<option value="">Todos los ciclos</option>';

    try {
        const response = await fetch('api/get_cycles.php');
        const data = await response.json();

        if (data.success) {
            data.cycles.forEach(ciclo => {
                const option = document.createElement('option');
                option.value = ciclo.id;
                option.textContent = `${ciclo.numero} - ${ciclo.nombre}`;
                cicloFilter.appendChild(option);
            });
        } else {
            for (let i = 1; i <= 10; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Ciclo ${i}`;
                cicloFilter.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Error al cargar ciclos:', error);
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Ciclo ${i}`;
            cicloFilter.appendChild(option);
        }
    }
}

// Cargar cursos según el ciclo seleccionado
async function cargarCursosPorCiclo() {
    const cicloSelect = document.getElementById('ciclo-filter');
    const ciclo = cicloSelect.value;
    const cursoSelect = document.getElementById('curso-filter');
    
    // Limpiar opciones previas
    const defaultOption = cursoSelect.options[0];
    cursoSelect.innerHTML = '';
    cursoSelect.appendChild(defaultOption);
    
    if (!ciclo) return;
    
    try {
        const response = await fetch(`api/get_courses.php?ciclo=${ciclo}`);
        const data = await response.json();
        
        if (data.success) {
            data.courses.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.nombre;
                cursoSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Aplicar filtros
function aplicarFiltros() {
    const ciclo = document.getElementById('ciclo-filter').value;
    const curso = document.getElementById('curso-filter').value;
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    
    let librosFiltrados = todosLibros;
    
    if (ciclo) {
        const cicloSeleccionado = Number(ciclo);
        console.log('Filtro ciclo:', cicloSeleccionado, 'libros antes:', librosFiltrados.length);
        librosFiltrados = librosFiltrados.filter(libro => {
            const cicloLibroId = Number(libro.ciclo_id);
            const cicloLibroNumero = Number(libro.ciclo_numero);
            return cicloLibroId === cicloSeleccionado || cicloLibroNumero === cicloSeleccionado;
        });
        console.log('libros después de filtro ciclo:', librosFiltrados.length);
    }
    
    if (curso) {
        const cursoSeleccionado = Number(curso);
        librosFiltrados = librosFiltrados.filter(libro => Number(libro.curso_id) === cursoSeleccionado);
    }
    
    if (busqueda) {
        librosFiltrados = librosFiltrados.filter(libro => 
            libro.titulo.toLowerCase().includes(busqueda) ||
            libro.autor.toLowerCase().includes(busqueda)
        );
    }
    
    mostrarLibros(librosFiltrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('ciclo-filter').value = '';
    document.getElementById('curso-filter').value = '';
    document.getElementById('busqueda').value = '';
    mostrarLibros(todosLibros);
}

// Mostrar libros en la grid
function mostrarLibros(libros) {
    const grid = document.getElementById('books-grid');
    
    if (libros.length === 0) {
        grid.innerHTML = '<div class="no-books">No hay libros disponibles con los filtros seleccionados</div>';
        return;
    }
    
    grid.innerHTML = libros.map(libro => `
        <div class="book-card" onclick="abrirModal(${libro.id})">
            <div class="book-image">📖</div>
            <div class="book-content">
                <h3>${libro.titulo}</h3>
                <p><strong>Autor:</strong> ${libro.autor}</p>
                <p><strong>Curso:</strong> ${libro.curso_nombre}</p>
                <div class="book-footer">
                    <span class="book-ciclo">Ciclo ${libro.ciclo_numero || libro.ciclo_nombre || libro.ciclo_id || libro.ciclo}</span>
                    <button class="btn btn-primary btn-btn" onclick="event.stopPropagation(); abrirModal(${libro.id})">Ver</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Abrir modal con detalles del libro
function abrirModal(libroId) {
    const libro = todosLibros.find(l => l.id == libroId);
    
    if (!libro) return;
    
    document.getElementById('modal-title').textContent = libro.titulo;
    document.getElementById('modal-author').textContent = libro.autor;
    document.getElementById('modal-course').textContent = libro.curso_nombre;
    document.getElementById('modal-ciclo').textContent = `Ciclo ${libro.ciclo_numero || libro.ciclo}`;
    document.getElementById('modal-description').textContent = libro.descripcion || 'Sin descripción disponible';
    document.getElementById('modal-isbn').textContent = libro.isbn || 'No especificado';
    document.getElementById('modal-year').textContent = libro.año_publicacion || 'No especificado';
    
    const downloadBtn = document.getElementById('modal-download');
    const archivoUrl = libro.archivo_url || '';
    const archivoRaw = libro.archivo_pdf;
    const archivo = archivoRaw && archivoRaw !== 'null' && archivoRaw !== 'undefined' ? archivoRaw.trim() : '';

    if (archivo && archivoUrl) {
        downloadBtn.href = archivoUrl;
        downloadBtn.setAttribute('download', archivo);
        downloadBtn.style.display = 'inline-block';
        downloadBtn.textContent = 'Descargar PDF';
        console.log('Link de descarga generado (archivo_url):', archivoUrl);
    } else {
        downloadBtn.href = '#';
        downloadBtn.removeAttribute('download');
        downloadBtn.style.display = 'none';
        console.warn('No hay archivo para descargar en este libro:', libro.id, libro.titulo, libro.archivo_pdf, libro.archivo_url);
    }
    
    document.getElementById('book-modal').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('book-modal').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('book-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Mostrar error
function mostrarError(mensaje) {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = `<div class="alert alert-error">${mensaje}</div>`;
}
