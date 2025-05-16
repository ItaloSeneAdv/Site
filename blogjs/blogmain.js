// blogjs/blogmain.js - Garantindo o uso correto da função formatDate
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
      
      // Criando o HTML do card com a imagem clicável
      card.innerHTML = `
        ${post.image ? `
          <div class="card-image">
            <a href="blogpost.html?id=${post.id}" class="image-link">
              <img src="blogimages/${post.image}" alt="${post.title}" onerror="this.style.display='none'">
            </a>
          </div>` : ''}
        <div class="card-content">
          <h3 class="card-title">${post.title}</h3>
          <div class="card-meta">
            <span class="author">${post.author}</span>
            <span class="date">${formatDate(post.date)}</span>
          </div>
          <a href="blogpost.html?id=${post.id}" class="read-more">Leia mais →</a>
        </div>
      `;
      
      container.appendChild(card);
    });

    // Adicione estilos para a imagem clicável
    addImageStyles();
    
    renderPagination();
  }

  // Função para adicionar estilos CSS para imagens clicáveis
  function addImageStyles() {
    // Verifica se já existe o estilo
    if (!document.getElementById('clickable-image-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'clickable-image-styles';
      styleSheet.innerHTML = `
        .card-image {
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }
        .card-image img {
          transition: transform 0.3s ease;
          width: 100%;
          height: auto;
        }
        .card-image:hover img {
          transform: scale(1.05);
        }
        .image-link {
          display: block;
          width: 100%;
          height: 100%;
        }
      `;
      document.head.appendChild(styleSheet);
    }
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