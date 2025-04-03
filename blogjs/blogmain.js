document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('posts-container');
  const searchInput = document.getElementById('search');
  const paginationWrapper = document.getElementById('wrapper');
  const postsPerPage = 6;
  let currentPage = 1;

  let posts = JSON.parse(localStorage.getItem('posts') || '[]');
  let filteredPosts = [...posts];

  // Busca
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
      currentPage = 1;
      renderPage(currentPage);
    });
  }

  // Formatar data
  function formatDate(dateStr) {
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  // Renderizar a página atual
  function renderPage(page) {
    if (!container) return;

    container.innerHTML = '';

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    if (paginatedPosts.length === 0) {
      container.innerHTML = '<p>Nenhum post disponível.</p>';
      renderPagination();
      return;
    }

    paginatedPosts.forEach(post => {
      const imagePath = post.image ? `blogimages/${post.image}` : '';
            const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const article = document.createElement('article');
      article.classList.add('card');
      article.innerHTML = `
        ${post.image ? `<img src="${imagePath}" alt="${post.title}" class="card-img">` : ''}
        <h2 class="card-title">${post.title}</h2>
        <a href="blogpost.html?id=${post.id}" class="read-more">Leia mais »</a>
        <p class="card-footer">${post.author} – ${formatDate(post.date)} – ${time}</p>
      `;
      container.appendChild(article);
    });

    renderPagination();
  }

  // Renderizar paginação
  function renderPagination() {
    if (!paginationWrapper) return;

    let pagination = document.getElementById('pagination');
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.id = 'pagination';
      paginationWrapper.appendChild(pagination);
    }

    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.disabled = i === currentPage;
      btn.onclick = () => {
        currentPage = i;
        renderPage(currentPage);
      };
      pagination.appendChild(btn);
    }
  }

  // Render inicial
  renderPage(currentPage);
});
