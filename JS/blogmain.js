// blogjs/blogmain.js - Garantindo o uso correto da função formatDate
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('posts-container');
  const searchInput = document.getElementById('search');
  let posts = [];
  let filteredPosts = [];
  const postsPerPage = 12;
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
                ${post.type ? `<span class="post-type-badge">${post.type}</span>` : ''}
<a href="blogpost.html?id=${post.id}" class="image-link">
<img src="../blogimages/${post.image}" alt="${post.title}">
            </a>
          </div>` : ''}
        <div class="card-content">
          <h3 class="card-title">${post.title}</h3>
          <div class="card-meta">
            <span class="author">${post.author}</span>
            <span class="date">${formatDate(post.date)}</span>
          </div>
<a href="./blogpost.html?id=${post.id}" class="read-more">Leia mais →</a>       
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
          .post-type-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(207, 100, 12, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: bold;
        z-index: 10;
        text-transform: uppercase;
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
});// blogmain.js - Sistema de blog corrigido
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('posts-container');
  const searchInput = document.getElementById('search');
  let posts = [];
  let filteredPosts = [];
  const postsPerPage = 12;
  let currentPage = 1;

  // Função para obter posts públicos (substituindo getPublicPosts)
  function getPublicPosts() {
    // Verifica se os dados estão disponíveis via window.POSTS_DATA
    if (typeof window.POSTS_DATA !== 'undefined') {
      return window.POSTS_DATA.filter(post => post.status === 'published' || !post.status);
    }
    
    // Se não houver POSTS_DATA, retorna array vazio
    console.warn('POSTS_DATA não encontrado. Certifique-se de que blogposts.js foi carregado.');
    return [];
  }

  // Função para formatar data (caso não esteja definida globalmente)
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Sao_Paulo'
    };
    return date.toLocaleDateString('pt-BR', options);
  }

  // Carregar posts
  try {
    posts = getPublicPosts();
    
    if (!Array.isArray(posts)) {
      console.error('Os posts não são um array:', posts);
      posts = [];
    }
    
    // Ordenar posts por data (mais recentes primeiro)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        (post.content && post.content.toLowerCase().includes(query)) ||
        (post.type && post.type.toLowerCase().includes(query))
      );
      currentPage = 1;
      
      if (filteredPosts.length === 0) {
        container.innerHTML = '<div class="no-posts">Nenhum post encontrado com estes termos.</div>';
        const paginationElement = document.getElementById('pagination');
        if (paginationElement) {
          paginationElement.innerHTML = '';
        }
      } else {
        renderPage();
      }
    });
  }

  // Renderização
  function renderPage() {
    if (!container) return;
    
    container.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    
    filteredPosts.slice(start, end).forEach(post => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      
      // Definir caminho da imagem
      const imagePath = post.image ? `../blogimages/${post.image}` : '../landingassets/logo.webp';
      
      // Criando o HTML do card com a imagem clicável 
      card.innerHTML = `
        ${post.image ? `
          <div class="card-image">
            ${post.type ? `<span class="post-type-badge">${post.type}</span>` : ''}
            <a href="blogpost.html?id=${post.id}" class="image-link">
              <img src="${imagePath}" alt="${post.title}" onerror="this.src='../landingassets/logo.webp'">
            </a>
          </div>` : ''}
        <div class="card-content">
          <h3 class="card-title">${post.title}</h3>
          <div class="card-meta">
            <span class="author">${post.author}</span>
            <span class="date">${formatDate(post.date)}</span>
          </div>
          <a href="./blogpost.html?id=${post.id}" class="read-more">Leia mais →</a>       
        </div>
      `;
      
      container.appendChild(card);
    });

    // Adicionar estilos para a imagem clicável
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
        .post-type-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(207, 100, 12, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          z-index: 10;
          text-transform: uppercase;
        }
        .no-posts, .error {
          text-align: center;
          padding: 2rem;
          color: #666;
          font-size: 1.1rem;
        }
        .error {
          color: #d32f2f;
          background: #ffebee;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }

  // Paginação
  function renderPagination() {
    let pagination = document.getElementById('pagination');
    
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.id = 'pagination';
      const wrapper = document.getElementById('wrapper') || document.body;
      wrapper.appendChild(pagination);
    }
    
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    if (totalPages <= 1) return;
    
    // Botão anterior
    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '← Anterior';
      prevBtn.className = 'pagination-btn';
      prevBtn.addEventListener('click', () => {
        currentPage--;
        renderPage();
      });
      pagination.appendChild(prevBtn);
    }
    
    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'pagination-btn active' : 'pagination-btn';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage();
      });
      pagination.appendChild(btn);
    }
    
    // Botão próximo
    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Próximo →';
      nextBtn.className = 'pagination-btn';
      nextBtn.addEventListener('click', () => {
        currentPage++;
        renderPage();
      });
      pagination.appendChild(nextBtn);
    }
  }
});