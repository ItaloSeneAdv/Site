document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    let menuClose;
    
    // Criar botão de fechar o menu apenas se estiver em modo mobile
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.menu-close')) {
                const menuCloseElement = document.createElement('div');
                menuCloseElement.className = 'menu-close';
                menuCloseElement.innerHTML = '&times;';
                menu.appendChild(menuCloseElement);
                menuClose = document.querySelector('.menu-close');
                
                // Fechar menu quando clicar no X
                menuClose.addEventListener('click', function() {
                    menu.classList.remove('active');
                });
            }
        } else {
            // Remover o X se a tela for expandida
            const existingMenuClose = document.querySelector('.menu-close');
            if (existingMenuClose) {
                existingMenuClose.remove();
            }
            
            // Certificar-se de que o menu não está ativo em desktop
            menu.classList.remove('active');
        }
    }
    
    // Verificar tamanho da tela ao carregar e ao redimensionar
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Abrir menu
    menuToggle.addEventListener('click', function() {
        menu.classList.add('active');
    });
    
    // Fechar menu quando clicar fora dele
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
            menu.classList.remove('active');
        }
    });
    
    // Fechar menu quando clicar em um link
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
        });
    });
});