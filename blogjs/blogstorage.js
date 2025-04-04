sync function loadPosts() {
  try {
    const response = await fetch('https://italoseneadv.github.io/Site/blogposts.json?ts=' + Date.now());
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
