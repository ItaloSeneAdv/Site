# Organização do repositório

## Conteúdo público

- `index.html`: site principal.
- `landingpage.html`: landing page independente.
- `blog/`: índice, artigos e imagens do blog.
- `areas/`: páginas das áreas de atuação.
- `CSS/`, `JS/`, `fonts/` e `landingassets/`: recursos usados pelas páginas públicas.
- `robots.txt`, `sitemap.xml`, `CNAME`, `404.html`, `_headers` e o arquivo de verificação do Google: arquivos públicos de configuração, hospedagem ou validação que precisam permanecer na raiz para preservar as URLs existentes.

## Manutenção e automação

- `.github/workflows/`: automações do GitHub Actions.
- `scripts/`: scripts de manutenção do sitemap e dos dados estruturados.
- `blog/_AI_INSTRUCTIONS.txt`: orientação interna para futuras IAs; excluído do build público.
- `archive/`: materiais legados preservados fora do fluxo público.

## Regra de segurança

Não mover arquivos públicos sem atualizar simultaneamente todas as referências, canônicas, sitemap, caminhos de assets e redirecionamentos. A organização deve preservar `https://italoseneadv.com.br/`, `/landingpage.html`, `/blog/`, `/blog/index.html`, `/areas/*.html` e os caminhos atuais dos assets.
