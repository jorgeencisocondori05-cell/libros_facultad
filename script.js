const apiBase = './api';
const filtersForm = document.getElementById('filters-form');
const resultsList = document.getElementById('results-list');
const mallaSelect = document.getElementById('malla');
const cicloSelect = document.getElementById('ciclo');
const cursoSelect = document.getElementById('curso');
const searchInput = document.getElementById('search');
const statsBooks = document.getElementById('stats-books');
const statsCourses = document.getElementById('stats-courses');
const statsCycles = document.getElementById('stats-cycles');
const topCoursesChart = document.getElementById('top-courses-chart');

const state = {
  cycles: [],
  courses: [],
};

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

async function getJson(url) {
  const response = await fetch(url, { credentials: 'same-origin' });
  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'No se pudo obtener la información.');
  }

  return payload.data;
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

function renderCards(books, limitToEight = false) {
  if (!resultsList) {
    return;
  }

  const visibleBooks = Array.isArray(books)
    ? (limitToEight ? books.slice(0, 8) : books)
    : [];

  if (visibleBooks.length === 0) {
    resultsList.innerHTML = `
      <article class="card card--empty">
        <p class="card__meta">Sin resultados</p>
        <h4>No hay libros registrados con este filtro</h4>
        <p>Prueba cambiando ciclo, curso o texto de búsqueda.</p>
      </article>
    `;
    return;
  }

  resultsList.innerHTML = visibleBooks.map((book) => {
    const title = escapeHtml(book.title || 'Sin título');
    const author = escapeHtml(book.author || 'Autor no indicado');
    const curriculum = escapeHtml(book.curriculum_name || 'Malla no indicada');
    const course = escapeHtml(book.course_name || 'Curso no indicado');
    const cycle = escapeHtml(book.cycle_number || '-');
    const description = escapeHtml(book.description || 'Sin descripción.');
    const uploader = escapeHtml(book.uploaded_by_name || 'No indicado');
    const filePath = escapeHtml(book.file_path || '#');
    const bookId = escapeHtml(book.id || '');
    const courseId = escapeHtml(book.course_id || '');

    return `
      <article class="card">
        <p class="card__meta">${curriculum} · Ciclo ${cycle}</p>
        <h4>${title}</h4>
        <p><strong>Autor:</strong> ${author}</p>
        <p><strong>Curso:</strong> ${course}</p>
        <p>${description}</p>
        <p><strong>Subido por:</strong> ${uploader}</p>
        <a class="role-card__link book-link" href="${filePath}" data-book-id="${bookId}" data-course-id="${courseId}" target="_blank" rel="noopener">Ver o descargar PDF</a>
      </article>
    `;
  }).join('');
}

function renderStatsSummary(data) {
  if (statsBooks) {
    statsBooks.textContent = data.books_count ?? '0';
  }

  if (statsCourses) {
    statsCourses.textContent = data.courses_count ?? '0';
  }

  if (statsCycles) {
    statsCycles.textContent = data.cycles_count ?? '0';
  }
}

function renderTopCourses(items) {
  if (!topCoursesChart) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    topCoursesChart.innerHTML = '<p class="panel-empty">Todavía no hay consultas registradas.</p>';
    return;
  }

  const maxViews = Math.max(...items.map((item) => Number(item.views_count) || 0), 1);

  topCoursesChart.innerHTML = items.map((item) => {
    const title = escapeHtml(item.course_name || 'Curso');
    const curriculum = escapeHtml(item.curriculum_name || 'Malla');
    const cycle = escapeHtml(item.cycle_number || '-');
    const views = Number(item.views_count) || 0;
    const width = Math.max(12, Math.round((views / maxViews) * 100));

    return `
      <div class="top-chart__item">
        <div class="top-chart__meta">
          <strong>${title}</strong>
          <span>${curriculum} · Ciclo ${cycle} · ${views} consultas</span>
        </div>
        <div class="top-chart__bar"><span style="width:${width}%"></span></div>
      </div>
    `;
  }).join('');
}

function setOptions(select, options, emptyLabel) {
  if (!select) {
    return;
  }

  const previousValue = select.value;
  select.innerHTML = `<option value="">${emptyLabel}</option>`;

  options.forEach((item) => {
    const option = document.createElement('option');
    option.value = String(item.value);
    option.textContent = item.label;
    select.appendChild(option);
  });

  if (previousValue && options.some((item) => String(item.value) === previousValue)) {
    select.value = previousValue;
  }
}

async function loadCurriculaAndCycles() {
  const cycles = await getJson(`${apiBase}/get_cycles.php`);
  state.cycles = Array.isArray(cycles) ? cycles : [];

  const curriculaMap = new Map();
  state.cycles.forEach((cycle) => {
    if (!curriculaMap.has(cycle.curriculum_id)) {
      curriculaMap.set(cycle.curriculum_id, cycle.curriculum_name);
    }
  });

  const curriculaOptions = [...curriculaMap.entries()].map(([id, name]) => ({
    value: id,
    label: name,
  }));

  setOptions(mallaSelect, curriculaOptions, 'Todas las mallas');
  loadCyclesByCurriculum();
}

function loadCyclesByCurriculum() {
  if (!mallaSelect) {
    return;
  }

  const selectedCurriculumId = Number(mallaSelect.value);
  const filteredCycles = state.cycles.filter((cycle) => {
    if (!selectedCurriculumId) {
      return true;
    }
    return Number(cycle.curriculum_id) === selectedCurriculumId;
  });

  const cycleOptions = filteredCycles.map((cycle) => ({
    value: cycle.id,
    label: `${cycle.label}`,
  }));

  setOptions(cicloSelect, cycleOptions, 'Todos los ciclos');
}

async function loadCourses() {
  const query = new URLSearchParams();
  if (cicloSelect && cicloSelect.value) {
    query.set('cycle_id', cicloSelect.value);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const courses = await getJson(`${apiBase}/get_courses.php${suffix}`);
  state.courses = Array.isArray(courses) ? courses : [];

  const courseOptions = state.courses.map((course) => ({
    value: course.id,
    label: course.name,
  }));

  setOptions(cursoSelect, courseOptions, 'Todos los cursos');
}

async function loadBooks() {
  const query = new URLSearchParams();
  const hasFilters = Boolean(
    (mallaSelect && mallaSelect.value) ||
    (cicloSelect && cicloSelect.value) ||
    (cursoSelect && cursoSelect.value) ||
    (searchInput && searchInput.value.trim() !== '')
  );

  if (cicloSelect && cicloSelect.value) {
    query.set('cycle_id', cicloSelect.value);
  }

  if (cursoSelect && cursoSelect.value) {
    query.set('course_id', cursoSelect.value);
  }

  const searchTerm = searchInput ? searchInput.value.trim() : '';
  if (searchTerm !== '') {
    query.set('search', searchTerm);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const books = await getJson(`${apiBase}/get_books.php${suffix}`);
  renderCards(books, !hasFilters);
}

async function loadStatistics() {
  const stats = await getJson(`${apiBase}/get_stats.php`);
  renderStatsSummary(stats || {});

  const topCourses = await getJson(`${apiBase}/get_top_courses.php`);
  renderTopCourses(topCourses || []);
}

async function recordCourseView(courseId) {
  if (!courseId) {
    return;
  }

  try {
    await postJson(`${apiBase}/record_course_view.php`, { course_id: Number(courseId) });
  } catch (error) {
    console.error(error);
  }
}

async function openTrackedBook(bookId, courseId, filePath) {
  if (!bookId || !filePath) {
    return;
  }

  try {
    await postJson(`${apiBase}/record_book_view.php`, { book_id: Number(bookId) });
    await recordCourseView(courseId);
  } catch (error) {
    console.error(error);
  }

  window.open(filePath, '_blank', 'noopener');
}

function renderError(message) {
  if (!resultsList) {
    return;
  }

  resultsList.innerHTML = `
    <article class="card card--empty">
      <p class="card__meta">Error</p>
      <h4>No se pudo cargar la información</h4>
      <p>${escapeHtml(message)}</p>
    </article>
  `;
}

async function init() {
  if (!filtersForm || !resultsList) {
    return;
  }

  try {
    await loadCurriculaAndCycles();
    await loadCourses();
    await loadBooks();
    await loadStatistics();
  } catch (error) {
    renderError(error instanceof Error ? error.message : 'Error inesperado.');
  }

  if (mallaSelect) {
    mallaSelect.addEventListener('change', async () => {
      try {
        loadCyclesByCurriculum();
        await loadCourses();
        await loadBooks();
      } catch (error) {
        renderError(error instanceof Error ? error.message : 'Error inesperado.');
      }
    });
  }

  if (cicloSelect) {
    cicloSelect.addEventListener('change', async () => {
      try {
        await loadCourses();
        await loadBooks();
      } catch (error) {
        renderError(error instanceof Error ? error.message : 'Error inesperado.');
      }
    });
  }

  if (cursoSelect) {
    cursoSelect.addEventListener('change', async () => {
      try {
        await loadBooks();
      } catch (error) {
        renderError(error instanceof Error ? error.message : 'Error inesperado.');
        return;
      }

      recordCourseView(cursoSelect.value).catch((error) => {
        console.error(error);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        loadBooks().catch((error) => {
          renderError(error instanceof Error ? error.message : 'Error inesperado.');
        });
      }
    });
  }

  resultsList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const bookLink = target.closest('.book-link');
    if (bookLink instanceof HTMLAnchorElement) {
      event.preventDefault();
      openTrackedBook(bookLink.dataset.bookId, bookLink.dataset.courseId, bookLink.getAttribute('href') || '#');
    }
  });

  filtersForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await loadBooks();
    } catch (error) {
      renderError(error instanceof Error ? error.message : 'Error inesperado.');
      return;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
