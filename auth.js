const GITHUB_CLIENT_ID = "Ov23liMjklGcMnD5lCBV";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Revisar si regresamos de autorizar en GitHub (lee el ?code=)
  const urlParams = new URLSearchParams(window.location.search);
  const githubCode = urlParams.get('code');

  if (githubCode) {
    // Sesión de GitHub exitosa
    const githubUser = {
      name: "Usuario de GitHub",
      picture: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      provider: "github"
    };
    saveSession(githubUser);
    // Limpia el código de la URL sin recargar
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  // 2. Si no hay retorno de GitHub, verificar si hay sesión guardada en localStorage
  const storedUser = JSON.parse(localStorage.getItem("session_user"));
  if (storedUser) {
    showDashboard(storedUser);
  }
});

// Login con Google
function handleGoogleLogin(response) {
  const payload = parseJwt(response.credential);
  const userData = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    provider: "google"
  };
  saveSession(userData);
}

// Redirección a GitHub
function loginWithGitHub() {
  const redirectUri = window.location.origin + window.location.pathname;
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}`;
}

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

  // Genera un código dinámico para la prueba
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("link-code").textContent = `!vincular LINK-${randomCode}`;
}

function logout() {
  localStorage.removeItem("session_user");
  window.location.reload();
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
      }
