document.addEventListener('DOMContentLoaded', function() {

    /**
     * LÓGICA DO MENU HAMBURGER (MÓVEL) - LÓGICA ORIGINAL
     */
    const hamburger = document.getElementById('hamburger');
    const menu = document.querySelector('.menu');

    if (hamburger && menu) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        };

        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Fecha o menu se clicar fora dele
        document.addEventListener('click', function(e) {
            if (menu.classList.contains('active') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
                toggleMenu();
            }
        });

        // Fecha o menu se clicar em um link
        menu.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    /**
     * ANIMAÇÃO DE ELEMENTOS AO ROLAR A PÁGINA
     * Usa a API IntersectionObserver para melhor performance.
     */
    const animateOnScroll = () => {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    };

    animateOnScroll();

    /**
     * LÓGICA DO FORMULÁRIO DE CONTATO PARA WHATSAPP
     */
    const formulario = document.getElementById("contato-form");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();

            let nome = document.getElementById("nome").value.trim();
            let problema = document.getElementById("problema").value.trim();
            let mensagem = document.getElementById("mensagem").value.trim();

            if (nome === "" || problema === "" || mensagem === "") {
                alert("Por favor, preencha todos os campos do formulário.");
                return;
            }

            let texto = `Olá, meu nome é ${nome}. Meu caso é sobre ${problema}.\n\nDescrição: ${mensagem}\n\n*Mensagem enviada através do site.*`;
            let mensagemCodificada = encodeURIComponent(texto);
            let numeroWhatsApp = "5543988008177";
            let linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`;

            window.open(linkWhatsApp, '_blank');
        });
    } else {
        console.error("Erro: Formulário com id 'contato-form' não foi encontrado!");
    }
});
