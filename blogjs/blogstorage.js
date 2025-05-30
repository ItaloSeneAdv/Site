// blogjs/blogstorage.js - Arquivo centralizado com a função formatDate
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

function formatDate(dateString) {
  // Verifica se a data está no formato yyyy-mm-dd (formato comum de entrada)
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Se a data for inválida, retorna o string original
    return dateString;
  }
  
  // Formata para o padrão brasileiro (dd/mm/yyyy)
  return date.toLocaleDateString('pt-BR');
}