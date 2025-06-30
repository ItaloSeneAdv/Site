document.addEventListener('DOMContentLoaded', () => {
  const themeCheckbox = document.getElementById('theme-checkbox');
  if (!themeCheckbox) return;

  const themeStylesheet = document.getElementById('theme-stylesheet');
  const pageName = window.location.pathname.split('/').pop().split('.')[0];

  const themeMap = {
    'index': {
      'styles.css': 'styles-light.css',
      'styles-light.css': 'styles.css'
    },
    'blogindex': {
      'blogstyle.css': 'blogstyle-light.css',
      'blogstyle-light.css': 'blogstyle.css'
    },
    'blogpost': {
      'blogpost.css': 'blogpost-light.css',
      'blogpost-light.css': 'blogpost.css',
    }
  };

  const savedTheme = 'dark';
  const currentStylesheet = themeStylesheet.href.split('/').pop();
  
  // Aplicar tema salvo
  if (pageName in themeMap) {
  const darkSheet = Object.keys(themeMap[pageName])
    .find(key => !key.includes('light')); // Encontra a folha de estilo escura
  if (darkSheet) {
    themeStylesheet.href = themeStylesheet.href.replace(currentStylesheet, darkSheet);
    themeCheckbox.checked = false; // Checkbox desmarcada para modo escuro
    themeCheckbox.setAttribute('aria-label', 'Alternar para modo claro');
    localStorage.setItem('theme', 'dark'); // Salva o tema escuro como padrão
  }
}

  themeCheckbox.checked = savedTheme === 'light';
  themeCheckbox.setAttribute('aria-label', 
    savedTheme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro');

  // Listener para troca de tema
  themeCheckbox.addEventListener('change', () => {
    if (pageName in themeMap) {
      const current = themeStylesheet.href.split('/').pop();
      const newSheet = themeMap[pageName][current];
      
      if (newSheet) {
        themeStylesheet.href = themeStylesheet.href.replace(current, newSheet);
        const newTheme = newSheet.includes('light') ? 'light' : 'dark';
        themeCheckbox.setAttribute('aria-label', 
          newTheme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro');
        localStorage.setItem('theme', newTheme);
        
        // Remover inline styles ao mudar para modo claro
        if (newTheme === 'light') {
          const postContainer = document.querySelector('.post-container');
          if (postContainer) {
            const elements = postContainer.querySelectorAll('[style*="color"]');
            elements.forEach(el => {
              el.style.color = '';
            });
          }
        }
      }
    }
  });
});
