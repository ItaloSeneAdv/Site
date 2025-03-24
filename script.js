document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contato-form").addEventListener("submit", function (event) {

        let nome = document.getElementById("nome").value;
        let problema = document.getElementById("problema").value;
        let mensagem = document.getElementById("mensagem").value;

        if (nome === "" || problema === "" || mensagem === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Criando a mensagem formatada para WhatsApp
        let texto = `Olá, meu nome é ${nome}. Tenho um problema na área de ${problema} e gostaria de mais informações.\n\nDescrição: ${mensagem}`;

        // Codificando a mensagem para URL
        let mensagemCodificada = encodeURIComponent(texto);

        // Seu número de WhatsApp (com DDD e código do país)
        let numeroWhatsApp = "5543988008177"; 

        // Link do WhatsApp
        let linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`;

        // Redireciona o usuário para o WhatsApp
        window.location.href = linkWhatsApp;
    });
});
