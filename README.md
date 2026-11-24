# Tramas – Feito à mão, feito no Brasil

**Página do projeto:** https://giovannatoco.github.io/Tramas/

O Tramas é uma plataforma da moda brasileira e da economia criativa. Ela dá visibilidade a pequenas marcas, designers, costureiras, artesãs e produtoras independentes do Brasil, ligando quem produz a quem quer comprar.

Projeto do grupo **HackGirls** (Elo, Gih e Vi), da PUC-Campinas, para o **HackBrasil**.

## O problema

- Muitas artesãs e pequenas marcas têm um trabalho incrível, mas pouca visibilidade.
- Muitas não sabem precificar e acabam cobrando menos do que gastam.
- Vender por WhatsApp não dá segurança: o cliente tem medo de pagar e não receber, e a artesã tem medo de produzir e não receber.
- É difícil saber onde as feiras acontecem e quem vai estar lá.

## A solução

- **Feed de vídeos curtos** com os produtos, o processo de criação e as coleções, com botão de compra.
- **Perfil da criadora** com a história da marca, as inspirações e como as peças são feitas.
- **Selo de origem** com região, técnica e materiais de cada peça.
- **Mapa de feiras** com as feiras próximas e as artesãs confirmadas em cada uma.
- **Encomenda com pagamento protegido**, inspirado no Enjoei: o dinheiro fica retido no app e só é liberado para a artesã quando o cliente recebe a peça.
- **Assistente de IA** (pago com créditos) para calcular o preço com todos os custos e criar a identidade visual da marca.
- **Chat protegido** que oculta contatos externos, para que toda negociação aconteça no app.
- **Acessibilidade**: descrição de imagens, leitor de tela, legendas, ajuste de contraste e fonte, e modo simplificado.

### Exemplo de uso

1. A Maria, do Ateliê da Maria (MG), publica um vídeo bordando uma bolsa. O vídeo aparece no feed com o selo “Feito à mão – Minas Gerais” e o botão “Comprar R$ 189”.
2. Antes de publicar, ela usou o assistente de IA: informou material, embalagem, horas de trabalho e custos fixos, e recebeu um preço sugerido com margem de lucro.
3. Uma cliente encomenda a bolsa e paga com Pix. O valor fica retido no Tramas enquanto a peça é produzida e enviada.
4. Quando a cliente confirma o recebimento, o valor, já sem a comissão, vai para a carteira da Maria.
5. No mapa, a cliente vê que a Maria vai estar na Feira de Artesanato da Praça no sábado e segue a feira para receber um aviso.

## Modelo de negócio

- Plano Gratuito: comissão de 12% por venda.
- Plano Premium (R$ 29,90/mês): comissão de 8%, destaque no feed, 30 créditos de IA por mês e relatórios.
- Pacotes de créditos de IA, anúncios patrocinados, destaque de feiras e antecipação de recebimento.

## Como executar

A landing page é um site estático (HTML e CSS, sem dependências nem build).

**Online:** acesse https://giovannatoco.github.io/Tramas/

**Localmente:**

```bash
git clone https://github.com/giovannatoco/Tramas.git
cd Tramas
# abra o index.html direto no navegador, ou sirva a pasta:
python3 -m http.server 8000
# e acesse http://localhost:8000
```

**Publicar no GitHub Pages:** em *Settings → Pages*, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.

## Estrutura do repositório

- `index.html`: landing page do projeto (HTML e CSS, sem dependências).
- `img/`: telas do protótipo do app.
