document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('posts-container');
  const searchInput = document.getElementById('search');
  let posts = [];
  let filteredPosts = [];
  const postsPerPage = 6;
  let currentPage = 1;

  // Carregar posts
  try {
    posts = await getPublicPosts();
    if (!Array.isArray(posts)) {
      console.error('Os posts não são um array:', posts);
      posts = [];
    }
    filteredPosts = [...posts];
    
    if (posts.length === 0) {
      container.innerHTML = '<div class="no-posts">Nenhum post encontrado. Volte em breve!</div>';
    } else {
      renderPage();
    }
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    container.innerHTML = '<div class="error">Erro ao carregar posts. Por favor, tente novamente mais tarde.</div>';
  }

  // Função de busca
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      (post.content && post.content.toLowerCase().includes(query))
    );
    currentPage = 1;
    
    if (filteredPosts.length === 0) {
      container.innerHTML = '<div class="no-posts">Nenhum post encontrado com estes termos.</div>';
      document.getElementById('pagination').innerHTML = '';
    } else {
      renderPage();
    }
  });

  // Renderização
  function renderPage() {
    container.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    
    filteredPosts.slice(start, end).forEach(post => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        ${post.image ? `
          <div class="card-image">
            <img src="blogimages/${post.image}" alt="${post.title}" onerror="this.style.display='none'">
          </div>` : ''}
        <div class="card-content">
          <h3 class="card-title">${post.title}</h3>
          <div class="card-meta">
            <span class="author">${post.author}</span>
            <span class="date">${new Date(post.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <a href="blogpost.html?id=${post.id}" class="read-more">Leia mais →</a>
        </div>
      `;
      container.appendChild(card);
    });

    renderPagination();
  }

  // Paginação
  function renderPagination() {
    const pagination = document.getElementById('pagination') || document.createElement('div');
    pagination.id = 'pagination';
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'active' : '';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage();
      });
      pagination.appendChild(btn);
    }
    
    if (!document.getElementById('pagination')) {
      document.getElementById('wrapper').appendChild(pagination);
    }
  }
});