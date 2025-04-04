// blogjs/blogstorage.js

// Carrega posts APENAS do JSON público
async function loadPosts() {
  try {
    const response = await fetch('/blogposts.json?v=' + Date.now());
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return [];
  }
}

// Função para uso público
async function getPublicPosts() {
  return await loadPosts();
}
