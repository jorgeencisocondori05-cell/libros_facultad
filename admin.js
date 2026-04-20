const switchButtons = document.querySelectorAll('.login-switch__button');
const panels = document.querySelectorAll('.login-card[role="tabpanel"]');
const messageBox = document.getElementById('login-message');

function showMessage(text, type = 'info') {
  if (!messageBox) {
    return;
  }

  messageBox.textContent = text;
  messageBox.dataset.type = type;
}

switchButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;

    switchButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
    });

    panels.forEach((panel) => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('is-active', isTarget);
      panel.hidden = !isTarget;
    });

    showMessage('');
  });
});

async function handleLogin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const role = form.dataset.role;
  const usernameInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const username = usernameInput?.value.trim() || '';
  const password = passwordInput?.value.trim() || '';

  if (!username || !password) {
    showMessage('Completa usuario y contraseña.', 'error');
    return;
  }

  showMessage('Validando credenciales...', 'info');

  try {
    const response = await fetch('api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ username, password, role }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      showMessage(result.message || 'No se pudo iniciar sesión.', 'error');
      return;
    }

    showMessage(`Acceso correcto: ${result.user.full_name} (${result.user.role}).`, 'success');
    form.reset();
    window.setTimeout(() => {
      window.location.href = result.user.role === 'admin' ? 'admin-panel.html' : 'panel.html';
    }, 450);
  } catch (error) {
    showMessage('No fue posible conectar con el servidor.', 'error');
  }
}

document.getElementById('docente-form')?.addEventListener('submit', handleLogin);
document.getElementById('admin-form')?.addEventListener('submit', handleLogin);
