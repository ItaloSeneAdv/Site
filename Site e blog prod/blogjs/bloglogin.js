const VALID_USER = "italo sene";
const VALID_PASS_HASH = "68edf52feae1109059805c633b331fbcecbd013781f2511d38fc9480e19efba8";

function normalize(str) {
  return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function hashSHA256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function login() {
    const userInput = document.getElementById('username').value;
    const passInput = document.getElementById('password').value;
  
    const user = normalize(userInput);
    const passHash = await hashSHA256(passInput);
  
    // 🔎 Mostra o que está sendo digitado e gerado
    console.log("🧪 Usuário digitado normalizado:", user);
    console.log("🧪 Hash SHA-256 da senha:", passHash);
    console.log("🧾 Esperado:", VALID_USER, VALID_PASS_HASH);
  
    if (user === VALID_USER && passHash === VALID_PASS_HASH) {
      console.log("✅ Login autorizado");
      localStorage.setItem('admin_logged', 'true');
      showAdmin();
    } else {
      console.warn("❌ Login rejeitado: usuário ou senha incorretos.");
      alert("Usuário ou senha incorretos.");
    }
  }
  

function showAdmin() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-screen').style.display = 'block';
  renderAdmin();
}

function logout() {
  localStorage.removeItem('admin_logged');
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem('admin_logged') === 'true') {
    showAdmin();
  }
};
