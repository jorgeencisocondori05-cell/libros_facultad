const apiBase = './api';

const panelUser = document.getElementById('panel-user');
const panelMessage = document.getElementById('panel-message');
const logoutBtn = document.getElementById('logout-btn');

const statBooks = document.getElementById('stat-books');
const statCourses = document.getElementById('stat-courses');
const statCycles = document.getElementById('stat-cycles');

const uploadForm = document.getElementById('upload-form');
const cycleSelect = document.getElementById('upload-cycle');
const courseSelect = document.getElementById('upload-course');
const booksList = document.getElementById('books-list');

const state = {
  user: null,
  cycles: [],
};

function showMessage(text, type = 'info') {
  if (!panelMessage) {
    return;
  }

  panelMessage.textContent = text;
  panelMessage.dataset.type = type;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'No se pudo completar la operación.');
  }

  return payload;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'No se pudo completar la operación.');
  }

  return payload;
}

function fillSelect(select, items, defaultLabel) {
  const previous = select.value;
  select.innerHTML = `<option value="">${defaultLabel}</option>`;

  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = String(item.value);
    option.textContent = item.label;
    select.appendChild(option);
  });

  if (previous && items.some((item) => String(item.value) === previous)) {
    select.value = previous;
  }
}

async function loadSession() {
  const payload = await requestJson(`${apiBase}/me.php`);
  state.user = payload.user;

  panelUser.textContent = `${state.user.full_name} (${state.user.role})`;
}

async function loadStats() {
  const payload = await requestJson(`${apiBase}/get_stats.php`);
  const data = payload.data || {};

  statBooks.textContent = data.books_count ?? '0';
  statCourses.textContent = data.courses_count ?? '0';
  statCycles.textContent = data.cycles_count ?? '0';
}

async function loadCycles() {
  const payload = await requestJson(`${apiBase}/get_cycles.php`);
  state.cycles = Array.isArray(payload.data) ? payload.data : [];

  const options = state.cycles.map((cycle) => ({
    value: cycle.id,
    label: `${cycle.label} - ${cycle.curriculum_name}`,
  }));

  fillSelect(cycleSelect, options, 'Selecciona ciclo');
  await loadCoursesByCycle();
}

async function loadCoursesByCycle() {
  const params = new URLSearchParams();
  if (cycleSelect.value) {
    params.set('cycle_id', cycleSelect.value);
  }

  const suffix = params.toString() ? `?${params.toString()}` : '';
  const payload = await requestJson(`${apiBase}/get_courses.php${suffix}`);
  const courses = Array.isArray(payload.data) ? payload.data : [];

  const options = courses.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  fillSelect(courseSelect, options, 'Selecciona curso');
}

function renderBooks(items) {
  if (!Array.isArray(items) || items.length === 0) {
    booksList.innerHTML = '<p class="panel-empty">No hay libros registrados todavía.</p>';
    return;
  }

  booksList.innerHTML = items.map((book) => `
    <article class="panel-item">
      <div>
        <p class="panel-item__meta">Ciclo ${escapeHtml(book.cycle_number)} · ${escapeHtml(book.course_name)}</p>
        <h3>${escapeHtml(book.title)}</h3>
        <p>Autor: ${escapeHtml(book.author)}</p>
        <p>Subido por: ${escapeHtml(book.uploaded_by_name)}</p>
        <a href="${escapeHtml(book.file_path)}" class="book-link" data-book-id="${escapeHtml(book.id)}" data-course-id="${escapeHtml(book.course_id || '')}" target="_blank" rel="noopener">Abrir PDF</a>
      </div>
      <button type="button" class="panel-danger" data-delete-book="${book.id}">Eliminar</button>
    </article>
  `).join('');
}

async function recordCourseView(courseId) {
  if (!courseId) {
    return;
  }

  try {
    await postJson('./api/record_course_view.php', { course_id: Number(courseId) });
  } catch (error) {
    console.error(error);
  }
}

async function openTrackedBook(bookId, courseId, filePath) {
  if (!bookId || !filePath) {
    return;
  }

  try {
    await postJson('./api/record_book_view.php', { book_id: Number(bookId) });
    await recordCourseView(courseId);
  } catch (error) {
    console.error(error);
  }

  window.open(filePath, '_blank', 'noopener');
}

async function loadBooks() {
  const payload = await requestJson(`${apiBase}/get_profesor_books.php`);
  renderBooks(payload.data);
}

async function onUploadSubmit(event) {
  event.preventDefault();

  if (!courseSelect.value) {
    showMessage('Selecciona primero un curso.', 'error');
    return;
  }

  const formData = new FormData(uploadForm);

  try {
    const payload = await requestJson(`${apiBase}/upload_book.php`, {
      method: 'POST',
      body: formData,
    });

    showMessage(payload.message || 'Libro cargado correctamente.', 'success');
    uploadForm.reset();
    await loadCoursesByCycle();
    await loadBooks();
    await loadStats();
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo subir el libro.', 'error');
  }
}

async function deleteBook(bookId) {
  const payload = await requestJson(`${apiBase}/delete_book.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: bookId }),
  });

  showMessage(payload.message || 'Libro eliminado.', 'success');
  await loadBooks();
  await loadStats();
}

async function deleteUser(userId) {
  const payload = await requestJson(`${apiBase}/delete_user.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });

  showMessage(payload.message || 'Usuario eliminado.', 'success');
  await loadUsers();
  await loadStats();
}

async function logout() {
  await requestJson(`${apiBase}/logout.php`, { method: 'POST' });
  window.location.href = 'admin.html';
}

function bindEvents() {
  cycleSelect.addEventListener('change', () => {
    loadCoursesByCycle().catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo cargar cursos.', 'error');
    });
  });

  uploadForm.addEventListener('submit', onUploadSubmit);

  booksList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const bookLink = target.closest('.book-link');
    if (bookLink instanceof HTMLAnchorElement) {
      event.preventDefault();
      openTrackedBook(bookLink.dataset.bookId, bookLink.dataset.courseId, bookLink.getAttribute('href') || '#');
      return;
    }

    const bookId = target.getAttribute('data-delete-book');
    if (!bookId) {
      return;
    }

    deleteBook(Number(bookId)).catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo eliminar el libro.', 'error');
    });
  });

  logoutBtn?.addEventListener('click', () => {
    logout().catch(() => {
      window.location.href = 'admin.html';
    });
  });
}

async function init() {
  bindEvents();

  try {
    await loadSession();
    await Promise.all([loadStats(), loadCycles(), loadBooks()]);
    showMessage('Panel listo para trabajar.', 'success');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo cargar la sesión.', 'error');
    window.setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1200);
  }
}

document.addEventListener('DOMContentLoaded', init);
