async function getPosts() {
  return await loadPosts();
}

async function savePosts(posts) {
  downloadJSON(posts);
}

function downloadJSON(posts) {
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
a.download = 'blogposts.json';
  a.click();
  URL.revokeObjectURL(url);
  alert('Arquivo JSON gerado!');
}

// Variáveis de controle para paginação do painel admin
let adminCurrentPage = 1;
const postsPerAdminPage = 3;

async function renderAdmin() {
  const list = document.getElementById('admin-list');
  const posts = await getPosts();
  
  list.innerHTML = '';
  
  if (posts.length === 0) {
    list.innerHTML = '<p>Nenhum post encontrado. Crie seu primeiro post!</p>';
    return;
  }
  
  // Cálculo da paginação
  const startIndex = (adminCurrentPage - 1) * postsPerAdminPage;
  const endIndex = startIndex + postsPerAdminPage;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  
  paginatedPosts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'admin-post-item';
    div.innerHTML = `
      <div class="post-header">
        <strong>${post.title}</strong>
        <span class="post-date">${formatDate(post.date)}</span>
      </div>
      <div class="post-meta">
        <span class="post-author">Autor: ${post.author}</span>
      </div>
    `;
    list.appendChild(div);
  });
  
  // Renderiza a paginação do admin
  renderAdminPagination(posts.length);
}

function renderAdminPagination(totalPosts) {
  const paginationContainer = document.getElementById('admin-pagination');
  if (!paginationContainer) {
    const container = document.createElement('div');
    container.id = 'admin-pagination';
    container.className = 'admin-pagination';
    document.getElementById('admin-list').after(container);
    renderAdminPagination(totalPosts);
    return;
  }
  
  paginationContainer.innerHTML = '';
  
  const totalPages = Math.ceil(totalPosts / postsPerAdminPage);
  
  // Botão anterior
  const prevButton = document.createElement('button');
  prevButton.textContent = '← Anterior';
  prevButton.disabled = adminCurrentPage === 1;
  prevButton.addEventListener('click', () => {
    if (adminCurrentPage > 1) {
      adminCurrentPage--;
      renderAdmin();
    }
  });
  paginationContainer.appendChild(prevButton);
  
  // Indicador de página atual
  const pageIndicator = document.createElement('span');
  pageIndicator.className = 'page-indicator';
  pageIndicator.textContent = `Página ${adminCurrentPage} de ${totalPages}`;
  paginationContainer.appendChild(pageIndicator);
  
  // Botão próximo
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Próximo →';
  nextButton.disabled = adminCurrentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (adminCurrentPage < totalPages) {
      adminCurrentPage++;
      renderAdmin();
    }
  });
  paginationContainer.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('post-form');
  document.getElementById('date').valueAsDate = new Date();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const postData = {
      id: document.getElementById('post-id').value || Date.now().toString(),
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      date: document.getElementById('date').value,
      image: document.getElementById('image').value.trim(),
      type: document.getElementById('type').value.trim(),
      content: document.getElementById('content').value.trim()
    };

    const posts = await getPosts();
    const existingIndex = posts.findIndex(p => p.id === postData.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = postData;
    } else {
      posts.unshift(postData);
    }

    await savePosts(posts);
    document.getElementById('post-id').value = '';
    form.reset();
    
    // Adiciona mensagem de sucesso
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = 'Post salvo com sucesso!';
    form.after(successMsg);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
    
    renderAdmin();
  });

  renderAdmin();
});