document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const form = document.getElementById('contato-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const problema = document.getElementById('problema').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();
      if (!nome || !problema || !mensagem) {
        form.reportValidity();
        return;
      }
      const texto = `Olá, meu nome é ${nome}.\n\nAssunto: ${problema}\n\nMensagem: ${mensagem}\n\nMensagem enviada pelo site.`;
      window.open(`https://wa.me/5543988008177?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    });
  }

  const shareButtons = document.querySelectorAll('[data-share]');
  shareButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const title = document.querySelector('h1')?.textContent?.trim() || document.title;
      const url = window.location.href;
      const type = button.dataset.share;
      const status = button.parentElement.querySelector('.share-status');
      if (type === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, '_blank', 'noopener');
      } else if (type === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener');
      } else if (type === 'copy') {
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          const helper = document.createElement('textarea');
          helper.value = url;
          helper.style.position = 'fixed';
          helper.style.opacity = '0';
          document.body.appendChild(helper);
          helper.select();
          document.execCommand('copy');
          helper.remove();
        }
        if (status) {
          status.textContent = 'Link copiado.';
          window.setTimeout(() => { status.textContent = ''; }, 2200);
        }
      }
    });
  });
});
