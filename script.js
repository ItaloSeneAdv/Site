document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contato-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio tradicional do formulário

        let nome = encodeURIComponent(document.getElementById("nome").value);
        let tipoProblema = encodeURIComponent(document.getElementById("tipo-problema").value);
        let mensagem = encodeURIComponent(document.getElementById("mensagem").value);

        let texto = `Olá, meu nome é ${nome}.%0AÁrea de Problema: ${tipoProblema}.%0A%0A${mensagem}`;
        let url = `https://api.whatsapp.com/send/?phone=5543988008177&text=${texto}`;

        window.open(url, "_blank"); // Abre o WhatsApp com os dados preenchidos
    });
});
