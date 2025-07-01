// blogstorage.js - Sistema de gerenciamento de posts do blog
// Depende de blogposts.js para obter os dados

class BlogStorage {
    constructor() {
        // Verifica se os dados dos posts estão disponíveis
        if (typeof window.POSTS_DATA === 'undefined') {
            console.error('POSTS_DATA não encontrado. Certifique-se de que blogposts.js foi carregado antes.');
            this.posts = [];
            return;
        }
        
        this.posts = [...window.POSTS_DATA];
        this.postsPerPage = 6;
        this.currentPage = 1;
        this.imageBasePath = window.IMAGE_BASE_PATH || '../blogimages/'; // Define o caminho base das imagens
    }

    // Obter todos os posts ordenados por data (mais recentes primeiro)
    getAllPosts() {
        return this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Obter post por ID
    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }

    // Obter posts por categoria/tipo
    getPostsByType(type) {
        if (!type || type === 'all') {
            return this.getAllPosts();
        }
        return this.posts
            .filter(post => post.type.toLowerCase() === type.toLowerCase())
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Obter posts paginados
    getPostsPaginated(page = 1, postsPerPage = this.postsPerPage) {
        const posts = this.getAllPosts();
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        
        return {
            posts: posts.slice(startIndex, endIndex),
            currentPage: page,
            totalPages: Math.ceil(posts.length / postsPerPage),
            totalPosts: posts.length,
            hasNext: endIndex < posts.length,
            hasPrev: page > 1
        };
    }

    // Buscar posts por termo
    searchPosts(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return this.getAllPosts();
        }

        const term = searchTerm.toLowerCase().trim();
        return this.posts.filter(post => 
            post.title.toLowerCase().includes(term) ||
            post.content.toLowerCase().includes(term) ||
            post.type.toLowerCase().includes(term) ||
            post.author.toLowerCase().includes(term)
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Obter posts recentes (últimos N posts)
    getRecentPosts(limit = 5) {
        return this.getAllPosts().slice(0, limit);
    }

    // Obter posts relacionados (mesmo tipo, excluindo o atual)
    getRelatedPosts(currentPostId, limit = 3) {
        const currentPost = this.getPostById(currentPostId);
        if (!currentPost) return [];

        return this.posts
            .filter(post => post.id !== currentPostId && post.type === currentPost.type)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // Obter tipos/categorias únicas
    getUniqueTypes() {
        const types = [...new Set(this.posts.map(post => post.type))];
        return types.sort();
    }

    // Formatizar data para exibição
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'America/Sao_Paulo'
        };
        return date.toLocaleDateString('pt-BR', options);
    }

    // Formatar data curta
    formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }

    // Truncar texto para preview
    truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // Limpar hashtags do texto para preview
    cleanTextForPreview(text, maxLength = 150) {
        let cleanText = text
            .replace(/#[\w\u00C0-\u017F]+/g, '') // Remove hashtags
            .replace(/\n{3,}/g, '\n\n') // Reduz quebras de linha múltiplas
            .trim();
        
        return this.truncateText(cleanText, maxLength);
    }

    // Renderizar post card para lista de posts
    renderPostCard(post) {
        const formattedDate = this.formatDate(post.date);
        const previewText = this.cleanTextForPreview(post.content);
        const imagePath = post.image ? `${this.imageBasePath}${post.image}` : `${this.imageBasePath}${post.image}`;

        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-image">
                    <img src="${imagePath}" alt="${post.title}" loading="lazy" onerror="this.src='${this.imageBasePath}${post.image}'">
                    <div class="post-category">${post.type}</div>
                </div>
                <div class="post-content">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-meta">
                        <span class="post-author">Por ${post.author}</span>
                        <span class="post-date">${formattedDate}</span>
                    </div>
                    <p class="post-preview">${previewText}</p>
                    <a href="blogpost.html?id=${post.id}" class="read-more-btn">Ler mais</a>
                </div>
            </article>
        `;
    }

    // Renderizar post completo para página individual
    renderFullPost(post) {
        if (!post) {
            return '<div class="post-not-found"><h1>Post não encontrado</h1><p>O post solicitado não existe ou foi removido.</p></div>';
        }

        const formattedDate = this.formatDate(post.date);
        const imagePath = post.image ? `${this.imageBasePath}${post.image}` : `${this.imageBasePath}${post.image}`;
        
        const formattedContent = post.content
            .split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
            .join('');

        return `
            <article class="full-post">
                <header class="post-header">
                    <div class="post-category">${post.type}</div>
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-meta">
                        <span class="post-author">Por ${post.author} em</span>
                        <span class="post-date">${formattedDate}</span>
                    </div>
                </header>
                
                <div class="post-image-container">
                    <img src="${imagePath}" alt="${post.title}" class="post-featured-image" onerror="this.src='${this.imageBasePath}${post.image}'">
                </div>
                
                <div class="post-content">
                    ${formattedContent}
                </div>
                
                <footer class="post-footer">
                        <div class="social-share-buttons">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook" aria-label="Compartilhar no Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" target="_blank" class="share-btn linkedin" aria-label="Compartilhar no LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}" target="_blank" class="share-btn whatsapp" aria-label="Compartilhar no WhatsApp"><i class="fab fa-whatsapp"></i></a>
                            <a href="https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn instagram" aria-label="Compartilhar no Instagram"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </footer>
            </article>
        `;
    }

    // Renderizar paginação
    renderPagination(paginationData) {
        if (paginationData.totalPages <= 1) return '';

        let paginationHTML = '<div class="pagination">';
        
        if (paginationData.hasPrev) {
            paginationHTML += `<button class="pagination-btn" onclick="blogStorage.loadPage(${paginationData.currentPage - 1})">« Anterior</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn disabled">« Anterior</button>`;
        }

        for (let i = 1; i <= paginationData.totalPages; i++) {
            if (i === paginationData.currentPage) {
                paginationHTML += `<button class="pagination-btn active">${i}</button>`;
            } else {
                paginationHTML += `<button class="pagination-btn" onclick="blogStorage.loadPage(${i})">${i}</button>`;
            }
        }

        if (paginationData.hasNext) {
            paginationHTML += `<button class="pagination-btn" onclick="blogStorage.loadPage(${paginationData.currentPage + 1})">Próximo »</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn disabled">Próximo »</button>`;
        }

        paginationHTML += '</div>';
        return paginationHTML;
    }

    // Carregar página específica
    loadPage(page) {
        this.currentPage = page;
        this.loadPosts();
    }

    // Carregar posts na página de índice
    loadPosts(searchTerm = '', filterType = 'all') {
        const postsContainer = document.getElementById('posts-container');
        const paginationContainer = document.getElementById('pagination-container');
        
        if (!postsContainer) {
            console.error('Container de posts não encontrado');
            return;
        }

        let posts;
        if (searchTerm) {
            posts = this.searchPosts(searchTerm);
        } else {
            posts = this.getPostsByType(filterType);
        }

        if (posts.length === 0) {
            postsContainer.innerHTML = '<div class="no-posts">Nenhum post encontrado.</div>';
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        if (searchTerm || filterType !== 'all') {
            postsContainer.innerHTML = posts.map(post => this.renderPostCard(post)).join('');
            if (paginationContainer) paginationContainer.innerHTML = '';
        } else {
            const paginationData = this.getPostsPaginated(this.currentPage);
            postsContainer.innerHTML = paginationData.posts.map(post => this.renderPostCard(post)).join('');
            
            if (paginationContainer) {
                paginationContainer.innerHTML = this.renderPagination(paginationData);
            }
        }
    }

    // Carregar post individual
    loadSinglePost() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const postContainer = document.querySelector('.post-container');

        if (!postContainer) {
            console.error('Container do post não encontrado');
            return;
        }

        const post = this.getPostById(postId);
        postContainer.innerHTML = this.renderFullPost(post);

        window.requestAnimationFrame(() => {
            postContainer.style.opacity = '1';
        });

        const relatedContainer = document.getElementById('related-posts');
        if (relatedContainer && post) {
            const relatedPosts = this.getRelatedPosts(postId, 3);
            if (relatedPosts.length > 0) {
                const relatedHTML = `
                    <div class="related-posts-section">
                        <h3>Posts Relacionados</h3>
                        <div class="related-posts-grid">
                            ${relatedPosts.map(relatedPost => this.renderPostCard(relatedPost)).join('')}
                        </div>
                    </div>
                `;
                relatedContainer.innerHTML = relatedHTML;
            }
        }
    }

    // Inicializar filtros e busca
    initializeFilters() {
        const searchInput = document.getElementById('search-input');
        const typeFilter = document.getElementById('type-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentPage = 1;
                this.loadPosts(e.target.value, typeFilter ? typeFilter.value : 'all');
            });
        }

        if (typeFilter) {
            const types = this.getUniqueTypes();
            typeFilter.innerHTML = '<option value="all">Todas as categorias</option>';
            types.forEach(type => {
                typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
            });

            typeFilter.addEventListener('change', (e) => {
                this.currentPage = 1;
                this.loadPosts(searchInput ? searchInput.value : '', e.target.value);
            });
        }
    }
}

// Criar instância global
const blogStorage = new BlogStorage();

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('posts-container')) {
        blogStorage.initializeFilters();
        blogStorage.loadPosts();
    } else if (document.getElementById('post-container')) {
        blogStorage.loadSinglePost();
    }
});

// Tornar blogStorage disponível globalmente
window.blogStorage = blogStorage;