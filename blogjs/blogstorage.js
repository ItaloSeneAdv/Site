// Carrega posts do JSON público
async function loadPosts() {
  try {
    const response = await fetch('/blogposts.json'); // Adicione a barra no início
    const jsonPosts = await response.json();
    // Sincroniza localStorage com o JSON do servidor
    saveLocalPosts(jsonPosts); 
    return jsonPosts;
  } catch (error) {
    console.error('Usando posts do localStorage...');
    return getLocalPosts(); // Fallback
  }
}

// Funções para Admin (armazenamento local)
function getLocalPosts() {
  return JSON.parse(localStorage.getItem('posts') || '[]');
}

function saveLocalPosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Função para uso público
async function getPublicPosts() {
  try {
    const posts = await loadPosts();
    return posts;
  } catch (error) {
    console.error('Erro ao carregar posts públicos:', error);
    // Fallback para posts do localStorage se o arquivo JSON não estiver disponível
    return getLocalPosts();
  }
}
