document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página certa
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    // Buscar posts do localStorage (simulando um banco de dados)
    const posts = getBlogPosts();
    
    // Filtrar por categoria se houver um parâmetro na URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get('categoria');
    
    let filteredPosts = posts;
    if (categoriaParam) {
        filteredPosts = posts.filter(post => post.category === categoriaParam);
    }
    
    // Exibir os posts
    if (filteredPosts.length > 0) {
        displayPosts(filteredPosts);
    } else {
        postsContainer.innerHTML = '<p class="no-posts">Nenhum artigo encontrado nesta categoria.</p>';
    }
    
    // Preencher os posts recentes na sidebar
    const recentPostsList = document.getElementById('recent-posts');
    if (recentPostsList) {
        const recentPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        recentPostsList.innerHTML = recentPosts.map(post => `
            <li><a href="post.html?slug=${post.slug}">${post.title}</a></li>
        `).join('');
    }
});

// Função para buscar posts do localStorage
function getBlogPosts() {
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
        return JSON.parse(storedPosts);
    }
    
    // Se não existirem posts, criar alguns de exemplo e salvar
    const defaultPosts = [
        {
            id: 1,
            title: "Direitos do Produtor Rural: O que você precisa saber",
            slug: "direitos-do-produtor-rural",
            category: "agrario",
            excerpt: "Um guia prático sobre os principais direitos dos produtores rurais no Brasil e como garantir que sejam respeitados.",
            content: "<p>O produtor rural desempenha um papel fundamental na economia brasileira, sendo responsável pela produção de alimentos e matérias-primas essenciais. Entretanto, muitos desconhecem seus direitos e garantias legais.</p><h2>Direito à Propriedade</h2><p>A Constituição Federal garante o direito à propriedade, desde que esta cumpra sua função social. Para propriedades rurais, isso significa aproveitamento racional e adequado, utilização dos recursos naturais disponíveis, preservação do meio ambiente e respeito às leis trabalhistas.</p><h2>Acesso ao Crédito Rural</h2><p>O produtor rural tem direito a linhas de crédito específicas com juros reduzidos pelo Programa Nacional de Fortalecimento da Agricultura Familiar (PRONAF) e outras iniciativas governamentais.</p><h2>Proteção contra Riscos</h2><p>Existem seguros agrícolas que protegem contra perdas decorrentes de eventos climáticos e outros riscos inerentes à atividade rural.</p><p>Para garantir seus direitos, é fundamental buscar orientação jurídica especializada em Direito Agrário.</p>",
            image: "img/farm-rights.jpg",
            date: "2024-03-15"
        },
        {
            id: 2,
            title: "Contratos de Arrendamento Rural: Como Elaborar",
            slug: "contratos-arrendamento-rural",
            category: "contratos",
            excerpt: "Entenda os aspectos importantes para elaborar contratos de arrendamento rural seguros e equilibrados.",
            content: "<p>O arrendamento rural é uma prática comum no Brasil, permitindo que produtores utilizem terras de terceiros mediante pagamento. Um contrato bem elaborado é essencial para evitar conflitos futuros.</p><h2>Elementos Essenciais</h2><p>Todo contrato de arrendamento rural deve conter identificação das partes, descrição detalhada do imóvel, prazo de vigência, valor e forma de pagamento, responsabilidades das partes e condições de rescisão.</p><h2>Prazos Mínimos</h2><p>O Estatuto da Terra estabelece prazos mínimos para contratos de arrendamento: 3 anos para lavouras temporárias, 5 anos para lavouras permanentes e 7 anos para exploração pecuária.</p><h2>Preço do Arrendamento</h2><p>O valor do arrendamento não pode ser superior a 15% do valor cadastral do imóvel, incluídas as benfeitorias.</p><p>É recomendável registrar o contrato no Cartório de Registro de Imóveis para garantir segurança jurídica às partes.</p>",
            image: "img/contract.jpg",
            date: "2024-02-20"
        },
        {
            id: 3,
            title: "Regularização Ambiental de Propriedades Rurais",
            slug: "regularizacao-ambiental-rural",
            category: "ambiental",
            excerpt: "Como regularizar sua propriedade rural de acordo com as normas ambientais e evitar multas.",
            content: "<p>A regularização ambiental é um processo essencial para propriedades rurais, garantindo conformidade legal e sustentabilidade.</p><h2>Cadastro Ambiental Rural (CAR)</h2><p>O CAR é o primeiro passo para regularização ambiental, consistindo no registro eletrônico da propriedade com informações ambientais, como áreas de preservação permanente e reserva legal.</p><h2>Programa de Regularização Ambiental (PRA)</h2><p>Após o CAR, proprietários com passivos ambientais devem aderir ao PRA, comprometendo-se a recuperar áreas degradadas através de um projeto específico.</p><h2>Áreas de Preservação Permanente (APP)</h2><p>São áreas protegidas como margens de rios, topos de morros e encostas íngremes. A regularização inclui a recuperação destas áreas quando degradadas.</p><p>O não cumprimento das normas ambientais pode resultar em multas significativas e impossibilidade de acesso a crédito rural.</p>",
            image: "img/environmental.jpg",
            date: "2024-01-25"
        }
    ];
    
    localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
    return defaultPosts;
}

// Função para exibir os posts na página
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    
    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
            ${post.image ? `<div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>` : ''}
            <div class="post-content">
                <h2><a href="post.html?slug=${post.slug}">${post.title}</a></h2>
                <div class="post-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="post-category">${getCategoryName(post.category)}</span>
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="post.html?slug=${post.slug}" class="read-more">Ler mais</a>
            </div>
        </article>
    `).join('');
}

// Função para formatar a data
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Função para obter o nome da categoria
function getCategoryName(categorySlug) {
    const categories = {
        'agrario': 'Direito Agrário',
        'contratos': 'Contratos',
        'ambiental': 'Direito Ambiental',
        'trabalhista': 'Direito Trabalhista Rural',
        'tributario': 'Direito Tributário'
    };
    
    return categories[categorySlug] || categorySlug;
}

// Inicializar as categorias no menu de navegação
document.addEventListener('DOMContentLoaded', function() {
    const categoriesMenu = document.getElementById('categories-menu');
    if (!categoriesMenu) return;
    
    const categories = {
        'agrario': 'Direito Agrário',
        'contratos': 'Contratos',
        'ambiental': 'Direito Ambiental',
        'trabalhista': 'Direito Trabalhista Rural',
        'tributario': 'Direito Tributário'
    };
    
    categoriesMenu.innerHTML = Object.entries(categories).map(([slug, name]) => `
        <li><a href="index.html?categoria=${slug}">${name}</a></li>
    `).join('');
});