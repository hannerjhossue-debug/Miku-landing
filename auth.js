// Reemplaza con tus IDs reales
const GITHUB_CLIENT_ID = "Ov23liMjklGcMnD5lCBV";

// Al cargar la página, verificar si ya hay sesión guardada
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("session_user"));
  if (user) {
    showDashboard(user);
  }
});

// Callback cuando el usuario inicia sesión con Google
function handleGoogleLogin(response) {
  // Decodificar el token JWT de Google para obtener datos del usuario
  const payload = parseJwt(response.credential);
  
  const userData = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    provider: "google"
  };

  saveSession(userData);
}

// Función para redirigir a GitHub OAuth
function loginWithGitHub() {
  const redirectUri = window.location.href;
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}`;
}

// Guardar datos en el navegador y actualizar vista
function saveSession(userData) {
  localStorage.setItem("session_user", JSON.stringify(userData));
  showDashboard(userData);
}

function showDashboard(user) {
  document.getElementById("login-box").classList.add("hidden");
  document.getElementById("dashboard-content").classList.remove("hidden");
  document.getElementById("user-profile").classList.remove("hidden");
  
  document.getElementById("user-name").textContent = user.name;
  document.getElementById("user-avatar").src = user.picture || "https://via.placeholder.com/40";

  // Generar código único temporal para vincular con WhatsApp
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("link-code").textContent = `!vincular LINK-${randomCode}`;
}

function logout() {
  localStorage.removeItem("session_user");
  location.reload();
}

// Función auxiliar para leer los datos del token de Google
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}
