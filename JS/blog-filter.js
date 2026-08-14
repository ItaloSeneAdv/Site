document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('article-search');
  const cards = Array.from(document.querySelectorAll('.post-card'));
  const buttons = Array.from(document.querySelectorAll('.category-filters [data-filter]'));
  const count = document.getElementById('visible-count');
  const pagination = document.getElementById('blog-pagination');
  
  let activeCategory = 'all';
  let currentPage = 1;
  const itemsPerPage = 12;

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
    if (currentPage > totalPages) currentPage = totalPages || 1;

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
          btn.classList.toggle('active', i === currentPage);
          btn.addEventListener('click', () => {
            currentPage = i;
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
    update();
  }));

  if (search) {
    search.addEventListener('input', () => {
      currentPage = 1;
      update();
    });
  }

  update();
});
