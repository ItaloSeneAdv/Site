// Carrega posts do JSON público
async function loadPosts() {
  try {
    const response = await fetch('blogposts.json');
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return [];
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