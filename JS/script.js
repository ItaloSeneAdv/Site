window.onload = function () {
    let formulario = document.getElementById("contato-form");

    if (!formulario) {
        console.error("Erro: Formulário não encontrado!");
        return;
    }

    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        let nome = document.getElementById("nome").value.trim();
        let problema = document.getElementById("problema").value.trim();
        let mensagem = document.getElementById("mensagem").value.trim();

        if (nome === "" || problema === "" || mensagem === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Criando a mensagem formatada para WhatsApp
        let texto = `Olá, meu nome é ${nome}. Tenho um problema na área de ${problema} e gostaria de mais informações.\n\nMeu problema é: ${mensagem}`;

        // Codificando a mensagem para URL
        let mensagemCodificada = encodeURIComponent(texto);

        // Seu número de WhatsApp (com DDD e código do país)
        let numeroWhatsApp = "5543988008177"; 

        // Link do WhatsApp
        let linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`;

        // Redireciona o usuário para o WhatsApp
        window.location.href = linkWhatsApp;
    });
};
