document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('article-search');
  const cards = Array.from(document.querySelectorAll('.post-card'));
  const buttons = Array.from(document.querySelectorAll('.category-filters [data-filter]'));
  const count = document.getElementById('visible-count');
  const pagination = document.getElementById('blog-pagination');
  
  let activeCategory = 'all';
  const itemsPerPage = 12;

  const pageFromUrl = () => {
    const page = Number.parseInt(new URL(window.location.href).searchParams.get('page') || '1', 10);
    return Number.isFinite(page) && page > 0 ? page : 1;
  };

  const setPageInUrl = (page, method) => {
    const url = new URL(window.location.href);
    if (page > 1) url.searchParams.set('page', String(page));
    else url.searchParams.delete('page');
    window.history[method]({ page }, '', url);
  };

  let currentPage = pageFromUrl();

  const normalize = (value) => (value || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function update() {
    const term = normalize(search ? search.value : '').trim();
    
    // Primeiro, filtra todos os cartões.
    const filtered = cards.filter((card) => {
      const byCategory = activeCategory === 'all' || normalize(card.dataset.category) === normalize(activeCategory);
      const byText = !term || normalize(card.textContent).includes(term);
      return byCategory && byText;
    });

    if (count) count.textContent = String(filtered.length);

    // Calcula páginas.
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const validPage = Math.min(currentPage, totalPages || 1);
    if (validPage !== currentPage) {
      currentPage = validPage;
      setPageInUrl(currentPage, 'replaceState');
    }

    // Oculta todos e mostra apenas os da página atual.
    cards.forEach(c => {
      c.hidden = true;
      c.style.display = 'none';
    });

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(c => {
      c.hidden = false;
      c.style.display = '';
    });

    // Renderiza controles de paginação.
    if (pagination) {
      pagination.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = String(i);
          btn.setAttribute('aria-label', `Ir para a página ${i}`);
          if (i === currentPage) btn.setAttribute('aria-current', 'page');
          btn.classList.toggle('active', i === currentPage);
          btn.addEventListener('click', () => {
            if (i === currentPage) return;
            currentPage = i;
            setPageInUrl(currentPage, 'pushState');
            update();
            window.scrollTo({ top: document.querySelector('.blog-section').offsetTop - 100, behavior: 'smooth' });
          });
          pagination.appendChild(btn);
        }
      }
    }
  }

  buttons.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter || 'all';
    buttons.forEach((item) => item.classList.toggle('active', item === button));
    currentPage = 1;
    setPageInUrl(currentPage, 'replaceState');
    update();
  }));

  if (search) {
    search.addEventListener('input', () => {
      currentPage = 1;
      setPageInUrl(currentPage, 'replaceState');
      update();
    });
  }

  window.addEventListener('popstate', () => {
    currentPage = pageFromUrl();
    update();
  });

  update();
});
