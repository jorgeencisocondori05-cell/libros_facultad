const apiBase = './api';

const panelUser = document.getElementById('panel-user');
const panelMessage = document.getElementById('panel-message');
const logoutBtn = document.getElementById('logout-btn');

const statBooks = document.getElementById('stat-books');
const statUsers = document.getElementById('stat-users');
const statCourses = document.getElementById('stat-courses');
const statCycles = document.getElementById('stat-cycles');

const createCurriculumForm = document.getElementById('create-curriculum-form');
const curriculumNameInput = document.getElementById('curriculum-name');
const curriculumYearInput = document.getElementById('curriculum-year');
const curriculaList = document.getElementById('curricula-list');
const courseSearchInput = document.getElementById('course-search');

const uploadForm = document.getElementById('upload-form');
const uploadCycleSelect = document.getElementById('upload-cycle');
const uploadCourseSelect = document.getElementById('upload-course');
const booksList = document.getElementById('books-list');

const createCourseForm = document.getElementById('create-course-form');
const courseCurriculumSelect = document.getElementById('course-curriculum');
const courseCycleSelect = document.getElementById('course-cycle');
const coursesList = document.getElementById('courses-list');

const createUserForm = document.getElementById('create-user-form');
const usersList = document.getElementById('users-list');

const state = {
  user: null,
  curricula: [],
  cycles: [],
  courses: [],
  courseQuery: '',
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

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
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
  if (!select) {
    return;
  }

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

  if (state.user.role !== 'admin') {
    throw new Error('Acceso exclusivo para administradores.');
  }

  panelUser.textContent = `${state.user.full_name} (${state.user.role})`;
}

async function loadStats() {
  const payload = await requestJson(`${apiBase}/get_stats.php`);
  const data = payload.data || {};

  statBooks.textContent = data.books_count ?? '0';
  statUsers.textContent = data.users_count ?? '0';
  statCourses.textContent = data.courses_count ?? '0';
  statCycles.textContent = data.cycles_count ?? '0';
}

async function loadCurricula() {
  const payload = await requestJson(`${apiBase}/get_curricula.php`);
  state.curricula = Array.isArray(payload.data) ? payload.data : [];

  if (courseCurriculumSelect) {
    const options = state.curricula.map((curriculum) => ({
      value: curriculum.id,
      label: curriculum.name,
    }));
    fillSelect(courseCurriculumSelect, options, 'Selecciona una malla');
  }

  renderCurricula(state.curricula);
}

async function loadCyclesForCurriculum(curriculumId, targetSelect) {
  const params = new URLSearchParams();
  if (curriculumId) {
    params.set('curriculum_id', curriculumId);
  }

  const suffix = params.toString() ? `?${params.toString()}` : '';
  const payload = await requestJson(`${apiBase}/get_cycles.php${suffix}`);
  const cycles = Array.isArray(payload.data) ? payload.data : [];

  if (targetSelect) {
    const options = cycles.map((cycle) => ({
      value: cycle.id,
      label: `${cycle.label} - ${cycle.curriculum_name}`,
    }));
    fillSelect(targetSelect, options, 'Selecciona un ciclo');
  }

  return cycles;
}

async function loadUploadCycles() {
  state.cycles = await loadCyclesForCurriculum('', uploadCycleSelect);
  await loadUploadCourses();
}

async function loadUploadCourses() {
  const params = new URLSearchParams();
  if (uploadCycleSelect?.value) {
    params.set('cycle_id', uploadCycleSelect.value);
  }

  const suffix = params.toString() ? `?${params.toString()}` : '';
  const payload = await requestJson(`${apiBase}/get_courses.php${suffix}`);
  const courses = Array.isArray(payload.data) ? payload.data : [];

  const options = courses.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  fillSelect(uploadCourseSelect, options, 'Selecciona curso');
}

async function loadCourseCycles() {
  const curriculumId = courseCurriculumSelect?.value || '';
  await loadCyclesForCurriculum(curriculumId, courseCycleSelect);
}

async function loadCourses() {
  const payload = await requestJson(`${apiBase}/get_courses.php`);
  state.courses = Array.isArray(payload.data) ? payload.data : [];
  renderCourses(state.courses);
}

async function loadBooks() {
  const payload = await requestJson(`${apiBase}/get_profesor_books.php`);
  renderBooks(payload.data);
}

async function loadUsers() {
  const payload = await requestJson(`${apiBase}/get_users.php`);
  renderUsers(payload.data);
}

function renderCurricula(items) {
  if (!curriculaList) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    curriculaList.innerHTML = '<p class="panel-empty">No hay mallas registradas.</p>';
    return;
  }

  curriculaList.innerHTML = items.map((curriculum) => `
    <article class="panel-item panel-item--compact">
      <div>
        <p class="panel-item__meta">Malla</p>
        <h3>${escapeHtml(curriculum.name)}</h3>
        <p>Código: ${escapeHtml(curriculum.code)}</p>
      </div>
      <button type="button" class="panel-danger" data-delete-curriculum="${curriculum.id}">Eliminar</button>
    </article>
  `).join('');
}

function renderCourses(items) {
  if (!coursesList) {
    return;
  }

  const query = state.courseQuery.trim().toLowerCase();
  const normalizedQuery = normalizeText(query);
  const filteredItems = !normalizedQuery ? items : items.filter((course) => {
    const haystack = [course.name, course.curriculum_name, course.cycle_number, course.order_in_cycle]
      .map((value) => normalizeText(value))
      .join(' ');

    return haystack.includes(normalizedQuery);
  });

  const visibleItems = query ? filteredItems : filteredItems.slice(0, 5);

  if (!Array.isArray(visibleItems) || visibleItems.length === 0) {
    coursesList.innerHTML = '<p class="panel-empty">No hay cursos registrados.</p>';
    return;
  }

  const hiddenCount = !query && filteredItems.length > visibleItems.length ? filteredItems.length - visibleItems.length : 0;

  coursesList.innerHTML = `
    ${hiddenCount > 0 ? `<p class="panel-empty">Mostrando 5 cursos. Usa el buscador para encontrar el resto.</p>` : ''}
    ${visibleItems.map((course) => `
    <article class="panel-item panel-item--compact">
      <div>
        <p class="panel-item__meta">${escapeHtml(course.curriculum_name)} · Ciclo ${escapeHtml(course.cycle_number)}</p>
        <h3>${escapeHtml(course.name)}</h3>
        <p>Orden: ${escapeHtml(course.order_in_cycle)}</p>
      </div>
      <button type="button" class="panel-danger" data-delete-course="${course.id}">Eliminar</button>
    </article>
  `).join('')}
  `;
}

function renderBooks(items) {
  if (!booksList) {
    return;
  }

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
        <a href="${escapeHtml(book.file_path)}" target="_blank" rel="noopener">Abrir PDF</a>
      </div>
      <button type="button" class="panel-danger" data-delete-book="${book.id}">Eliminar</button>
    </article>
  `).join('');
}

function renderUsers(items) {
  if (!usersList) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    usersList.innerHTML = '<p class="panel-empty">No hay usuarios registrados.</p>';
    return;
  }

  usersList.innerHTML = items.map((user) => `
    <article class="panel-item">
      <div>
        <p class="panel-item__meta">${escapeHtml(user.role)}</p>
        <h3>${escapeHtml(user.full_name)}</h3>
        <p>Usuario: ${escapeHtml(user.username)}</p>
        <p>Email: ${escapeHtml(user.email || '-')}</p>
      </div>
      <button type="button" class="panel-danger" data-delete-user="${user.id}">Eliminar</button>
    </article>
  `).join('');
}

async function onCreateCurriculumSubmit(event) {
  event.preventDefault();

  const payload = {
    name: curriculumNameInput?.value.trim() || '',
    year: curriculumYearInput?.value.trim() || '',
  };

  try {
    const result = await requestJson(`${apiBase}/create_curriculum.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    showMessage(result.message || 'Malla creada correctamente.', 'success');
    createCurriculumForm.reset();
    if (curriculumNameInput) {
      curriculumNameInput.value = 'malla2019';
    }
    if (courseCurriculumSelect && result.data?.id) {
      courseCurriculumSelect.value = String(result.data.id);
    }

    await Promise.all([loadCurricula(), loadUploadCycles(), loadCourseCycles(), loadStats()]);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo crear la malla.', 'error');
  }
}

async function onCreateCourseSubmit(event) {
  event.preventDefault();

  const selectedCurriculumId = courseCurriculumSelect?.value || '';

  const payload = {
    cycle_id: courseCycleSelect?.value || '',
    name: document.getElementById('course-name')?.value.trim() || '',
    order_in_cycle: document.getElementById('course-order')?.value || '1',
  };

  if (!payload.cycle_id) {
    showMessage('Selecciona una malla y un ciclo.', 'error');
    return;
  }

  try {
    const result = await requestJson(`${apiBase}/create_course.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    showMessage(result.message || 'Curso creado correctamente.', 'success');
    createCourseForm.reset();
    if (courseCurriculumSelect && selectedCurriculumId) {
      courseCurriculumSelect.value = selectedCurriculumId;
    }
    await Promise.all([loadCourses(), loadUploadCycles(), loadCourseCycles(), loadStats()]);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo crear el curso.', 'error');
  }
}

async function onUploadSubmit(event) {
  event.preventDefault();

  if (!uploadCourseSelect?.value) {
    showMessage('Selecciona primero un curso.', 'error');
    return;
  }

  const formData = new FormData(uploadForm);

  try {
    const result = await requestJson(`${apiBase}/upload_book.php`, {
      method: 'POST',
      body: formData,
    });

    showMessage(result.message || 'Libro cargado correctamente.', 'success');
    uploadForm.reset();
    await loadUploadCycles();
    await loadBooks();
    await loadStats();
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo subir el libro.', 'error');
  }
}

async function onCreateUserSubmit(event) {
  event.preventDefault();

  const formData = new FormData(createUserForm);
  const body = Object.fromEntries(formData.entries());

  try {
    const result = await requestJson(`${apiBase}/create_user.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    showMessage(result.message || 'Usuario creado.', 'success');
    createUserForm.reset();
    await Promise.all([loadUsers(), loadStats()]);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo crear el usuario.', 'error');
  }
}

async function deleteBook(bookId) {
  const result = await requestJson(`${apiBase}/delete_book.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: bookId }),
  });

  showMessage(result.message || 'Libro eliminado.', 'success');
  await Promise.all([loadBooks(), loadStats()]);
}

async function deleteCourse(courseId) {
  const result = await requestJson(`${apiBase}/delete_course.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_id: courseId }),
  });

  showMessage(result.message || 'Curso eliminado.', 'success');
  await Promise.all([loadCourses(), loadUploadCycles(), loadCourseCycles(), loadStats()]);
}

async function deleteCurriculum(curriculumId) {
  const result = await requestJson(`${apiBase}/delete_curriculum.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ curriculum_id: curriculumId }),
  });

  showMessage(result.message || 'Malla eliminada.', 'success');
  state.courseQuery = '';
  if (courseSearchInput) {
    courseSearchInput.value = '';
  }
  await Promise.all([loadCurricula(), loadCourses(), loadUploadCycles(), loadCourseCycles(), loadStats(), loadBooks()]);
}

async function deleteUser(userId) {
  const result = await requestJson(`${apiBase}/delete_user.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });

  showMessage(result.message || 'Usuario eliminado.', 'success');
  await Promise.all([loadUsers(), loadStats()]);
}

async function logout() {
  await requestJson(`${apiBase}/logout.php`, { method: 'POST' });
  window.location.href = 'admin.html';
}

function bindEvents() {
  createCurriculumForm?.addEventListener('submit', onCreateCurriculumSubmit);
  createCourseForm?.addEventListener('submit', onCreateCourseSubmit);
  uploadForm?.addEventListener('submit', onUploadSubmit);
  createUserForm?.addEventListener('submit', onCreateUserSubmit);
  courseSearchInput?.addEventListener('input', () => {
    state.courseQuery = courseSearchInput.value;
    renderCourses(state.courses);
  });

  uploadCycleSelect?.addEventListener('change', () => {
    loadUploadCourses().catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo cargar cursos.', 'error');
    });
  });

  courseCurriculumSelect?.addEventListener('change', () => {
    loadCourseCycles().catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo cargar los ciclos.', 'error');
    });
  });

  booksList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
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

  coursesList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const courseId = target.getAttribute('data-delete-course');
    if (!courseId) {
      const curriculumId = target.getAttribute('data-delete-curriculum');
      if (!curriculumId) {
        return;
      }

      deleteCurriculum(Number(curriculumId)).catch((error) => {
        showMessage(error instanceof Error ? error.message : 'No se pudo eliminar la malla.', 'error');
      });
      return;
    }

    deleteCourse(Number(courseId)).catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo eliminar el curso.', 'error');
    });
  });

  curriculaList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const curriculumId = target.getAttribute('data-delete-curriculum');
    if (!curriculumId) {
      return;
    }

    deleteCurriculum(Number(curriculumId)).catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo eliminar la malla.', 'error');
    });
  });

  usersList?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const userId = target.getAttribute('data-delete-user');
    if (!userId) {
      return;
    }

    deleteUser(Number(userId)).catch((error) => {
      showMessage(error instanceof Error ? error.message : 'No se pudo eliminar el usuario.', 'error');
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
    await Promise.all([
      loadStats(),
      loadCurricula(),
      loadUploadCycles(),
      loadCourses(),
      loadBooks(),
      loadUsers(),
    ]);
    showMessage('Panel listo para trabajar.', 'success');
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'No se pudo cargar la sesión.', 'error');
    window.setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1200);
  }
}

document.addEventListener('DOMContentLoaded', init);
