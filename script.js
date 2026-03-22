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
        librosFiltrados = librosFiltrados.filter(libro => libro.ciclo == ciclo);
    }
    
    if (curso) {
        librosFiltrados = librosFiltrados.filter(libro => libro.curso_id == curso);
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
                    <span class="book-ciclo">Ciclo ${libro.ciclo}</span>
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
    document.getElementById('modal-ciclo').textContent = `Ciclo ${libro.ciclo}`;
    document.getElementById('modal-description').textContent = libro.descripcion || 'Sin descripción disponible';
    document.getElementById('modal-isbn').textContent = libro.isbn || 'No especificado';
    document.getElementById('modal-year').textContent = libro.año_publicacion || 'No especificado';
    
    const downloadBtn = document.getElementById('modal-download');
    if (libro.archivo_pdf) {
        downloadBtn.href = `descargas/${libro.archivo_pdf}`;
        downloadBtn.style.display = 'inline-block';
    } else {
        downloadBtn.style.display = 'none';
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
