document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        // Abrir menu
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.add('active');
        });
        
        // Fechar menu com botão de fechar
        if (menuClose) {
            menuClose.addEventListener('click', function(e) {
                e.stopPropagation();
                menu.classList.remove('active');
            });
        }
        
        // Fechar menu ao clicar nos links
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            if (menu.classList.contains('active') && 
                !menu.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                menu.classList.remove('active');
            }
        });
    }
    
    // Função para configurar o botão de fechar caso ele não exista
    function setupMenuClose() {
        if (!menuClose) {
            menuClose = document.createElement('button');
            menuClose.className = 'menu-close';
            menuClose.innerHTML = '&times;'; // Símbolo "X"
            menuClose.style.position = 'absolute';
            menuClose.style.right = '10px';
            menuClose.style.top = '10px';
            menuClose.style.background = 'transparent';
            menuClose.style.border = 'none';
            menuClose.style.fontSize = '24px';
            menuClose.style.cursor = 'pointer';
            menu.prepend(menuClose);
        }
    }
});