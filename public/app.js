// API Configuration - auto-detect environment
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : window.location.origin;
const TOKEN_KEY = 'auth_token';

// Utility Functions
function showMessage(text, type = 'info') {
  const msgEl = document.getElementById('message');
  msgEl.textContent = text;
  msgEl.className = type;

  setTimeout(() => {
    msgEl.textContent = '';
    msgEl.className = '';
  }, 5000);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function setLoading(buttonId, isLoading) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.disabled = isLoading;
    btn.textContent = isLoading ? 'Loading...' : btn.getAttribute('data-text') || btn.textContent;
  }
}

// Tab Management
function openTab(tabName) {
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  const activeBtn = Array.from(buttons).find(btn =>
    btn.textContent.toLowerCase() === tabName.toLowerCase()
  );
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  if (tabName === 'profile') {
    loadProfile();
  }
}

// Authentication Functions
async function signup(event) {
  event.preventDefault();

  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;

  if (!email || !password || !role) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  setLoading('signup-btn', true);

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(`Account created successfully! Welcome, ${data.email}`, 'success');
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
      document.getElementById('signup-role').value = '';
      setTimeout(() => openTab('login'), 1500);
    } else {
      showMessage(data.error || 'Signup failed', 'error');
    }
  } catch (error) {
    showMessage('Network error. Please try again.', 'error');
    console.error('Signup error:', error);
  } finally {
    setLoading('signup-btn', false);
  }
}

async function login(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showMessage('Please enter email and password', 'error');
    return;
  }

  setLoading('login-btn', true);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      saveToken(data.token);
      showMessage('Login successful!', 'success');
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
      setTimeout(() => openTab('profile'), 1000);
    } else {
      showMessage(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    showMessage('Network error. Please try again.', 'error');
    console.error('Login error:', error);
  } finally {
    setLoading('login-btn', false);
  }
}

async function loadProfile() {
  const token = getToken();

  if (!token) {
    document.getElementById('profile-info').innerHTML = `
      <p class="warning">⚠️ Please login to view your profile</p>
    `;
    document.getElementById('logout-btn').style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('profile-info').innerHTML = `
        <div class="profile-card">
          <p><strong>👤 User ID:</strong> ${data.id}</p>
          <p><strong>🎭 Role:</strong> <span class="role-badge ${data.role}">${data.role}</span></p>
          <p><strong>🔐 Token:</strong> Active</p>
        </div>
      `;
      document.getElementById('logout-btn').style.display = 'block';
      showMessage('Profile loaded successfully', 'success');
    } else {
      document.getElementById('profile-info').innerHTML = `
        <p class="error">❌ Session expired. Please login again.</p>
      `;
      clearToken();
      document.getElementById('logout-btn').style.display = 'none';
      showMessage(data.error || 'Failed to load profile', 'error');
    }
  } catch (error) {
    document.getElementById('profile-info').innerHTML = `
      <p class="error">Network error. Please try again.</p>
    `;
    console.error('Profile error:', error);
  }
}

async function checkAdmin() {
  const token = getToken();

  if (!token) {
    showMessage('Please login first', 'error');
    openTab('login');
    return;
  }

  setLoading('admin-check-btn', true);

  try {
    const response = await fetch(`${API_URL}/auth/admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('admin-info').innerHTML = `
        <div class="success-card">
          <h4>✅ ${data.message}</h4>
          <p>You have admin privileges</p>
        </div>
      `;
      showMessage('Admin access granted', 'success');
    } else {
      document.getElementById('admin-info').innerHTML = `
        <div class="error-card">
          <h4>⛔ Access Denied</h4>
          <p>${data.error || 'You do not have admin privileges'}</p>
        </div>
      `;
      showMessage('Admin access denied', 'error');
    }
  } catch (error) {
    document.getElementById('admin-info').innerHTML = `
      <p class="error">Network error. Please try again.</p>
    `;
    console.error('Admin check error:', error);
    showMessage('Network error', 'error');
  } finally {
    setLoading('admin-check-btn', false);
  }
}

function logout() {
  clearToken();
  showMessage('Logged out successfully', 'success');
  document.getElementById('profile-info').innerHTML = `
    <p>Please login to view your profile</p>
  `;
  document.getElementById('logout-btn').style.display = 'none';
  openTab('login');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button[type="submit"]').forEach(btn => {
    btn.setAttribute('data-text', btn.textContent);
  });

  const token = getToken();
  if (token) {
    showMessage('Welcome back!', 'success');
  }
});
