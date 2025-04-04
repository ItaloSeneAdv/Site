async function loadPosts() {
  try {
    const response = await fetch('https://italoseneadv.github.io/Site/blogposts.json?v=' + Date.now());
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    return [];
  }
}

async function getPublicPosts() {
  return await loadPosts();
}
