# Site de Casamento — Samara & Renan

> "Isto é obra do Senhor, e é maravilhosa aos nossos olhos." — Salmos 118:23

Briefing completo do projeto. Este arquivo é a fonte da verdade para qualquer agente que for implementar, alterar ou revisar o site. **Leia-o por inteiro antes de tocar em código.**

---

## 1. Visão geral

Site one-page (com rotas auxiliares para RSVP/admin/presentes) para o casamento de **Samara & Renan**, em **11 de outubro de 2026**. Funciona como cartão-convite digital, hub de informações, ferramenta de RSVP e lista de presentes com pagamento via PIX/cartão.

**Princípios de design:**
- Elegante, romântico, leve. Animações sutis (não exagerar — performance importa, principalmente em celular).
- Mobile-first, mas impecável no desktop.
- Simples de usar. Convidados de várias idades vão acessar.
- Refletir a personalidade alegre e moderna do casal (paleta pastel) sem perder a sofisticação (acentos dourados/champagne e tipografia serifada).

**Inspirações de referência (assets na raiz do projeto):**
- Estrutura, menu, animações, fluxo de presentes → `https://moroniedaphine.vercel.app` (print `screencapture-moroniedaphine-vercel-app-...png`)
- Escolha de palavras / copy de cada seção → design Canva (print `screencapture-canva-design-...png`)
- Estilo visual base (cores quentes, tipografia, cards) → `lista_presença.html` (form RSVP autoral do Renan)
- Paleta complementar pastel → `paleta de cores.jpeg`
- Telas específicas do fluxo de presentes → `carrinho.png`, `icone no canto direito indicando a lista de carrinho.png`, `tela_resumo_do_presente.png`, `resumo_tela_pagamento.png`
- Visualização da lista de presentes → `lista de presentes.png`

> **Importante:** o site não deve ser cópia de nenhum dos sites acima. É para ser **melhor** — usar o que cada um tem de bom e harmonizar.

---

## 2. Stack técnico

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 15** (App Router) + React 19 | SSR/ISR para SEO do convite, Route Handlers para RSVP/admin, edge-friendly no Netlify |
| Linguagem | **TypeScript** (strict) | Segurança em formulários/admin |
| Estilização | **Tailwind CSS v4** | Velocidade + design system consistente via tokens |
| Componentes | **shadcn/ui** (apenas o que precisar — Dialog, Sheet, Form, Input, Button, Tabs, Toast) | Acessível, sem lock-in |
| Animações | **Framer Motion** (apenas em entradas de seção, hover de cards e overlay do carrinho) | Leve quando usado com moderação |
| Estado do carrinho | **Zustand** + `persist` em localStorage | Simples, sem boilerplate |
| Banco de dados | **Supabase (Postgres)** | Free tier generoso, ótimo SDK, integra com Auth |
| Auth admin | **Supabase Auth** (email + senha) | Apenas Renan e Samara cadastrados manualmente no painel Supabase |
| Email transacional | **Brevo** (HTTP API) + React Email templates | Free tier 300 emails/dia, sem SDK extra (usa `fetch` + `@react-email/components` render) |
| Validação | **Zod** | Compartilhada entre client e server |
| Formulários | **React Hook Form** + `@hookform/resolvers/zod` | Padrão do ecossistema |
| Deploy | **Netlify** (usuário fará manualmente após push no GitHub) | — |
| Imagens | `next/image` + pasta `/public` (otimizadas em build) | Next cuida de WebP/AVIF e tamanhos |
| Fontes | **Cormorant Garamond** (display) + **Jost** (sans) — Google Fonts via `next/font` | Mesmas do `lista_presença.html`, dão identidade |

**Não usar:** UI kits pesados (MUI, Chakra), GSAP (Framer Motion já dá conta), Redux, ORM complexo (preferir o client do Supabase direto).

---

## 3. Identidade visual

### 3.1. Paleta de cores

Fusão entre o tom quente/champagne do `lista_presença.html` (já validado pelo Renan) e a paleta pastel da noiva. Champagne lidera; pastéis aparecem como **acentos** (background suave de seções, hover, ícones, badges, ilustrações de fundo aquareladas).

```css
/* Tokens — Tailwind v4 (definir em globals.css com @theme) */
--color-cream: #f7f3ee;          /* fundo principal */
--color-cream-soft: #faf8f5;     /* inputs / cards-bg */
--color-ink: #2e2218;            /* títulos */
--color-text: #3a3028;           /* corpo */
--color-text-soft: #6b5540;
--color-champagne: #c4a882;      /* acento principal */
--color-champagne-deep: #a07850; /* botões / hover */
--color-champagne-light: #b8966e;/* labels uppercase */
--color-border: #e0d4c4;

/* Pastéis — usar com moderação, sempre dessaturados */
--pastel-rose: #f7d6d6;       /* Rosa bebê */
--pastel-salmon: #fbc8a8;     /* Salmão */
--pastel-lavender: #d8cdf0;   /* Lavanda */
--pastel-mint: #c8e6cf;       /* Verde menta */
--pastel-sky: #c8dcf0;        /* Azul Serenity */
--pastel-yellow: #f5e8b0;     /* Amarelo pastel */
```

**Regra prática:** champagne + cream = 80% da tela. Pastéis = 20% (e nunca mais que 2 deles na mesma seção). Texto sempre em `--color-ink` ou `--color-text`. Nunca usar pastéis em texto sobre fundo cream — contraste ruim.

### 3.2. Tipografia

- **Display / títulos**: `Cormorant Garamond` (300, 400, italic) — usar `font-light` por padrão, itálico para nomes do casal.
- **Corpo / UI**: `Jost` (300, 400, 500).
- **Labels uppercase** (ex: "RSVP", "DATA"): Jost 500, `letter-spacing: 4px`, `text-transform: uppercase`, cor `--color-champagne-light`, tamanho 11–12px.

### 3.3. Componentes-chave de UI

- **Cards**: fundo branco, `border-radius: 16px`, `box-shadow: 0 2px 16px rgba(100,70,30,0.07)`.
- **Inputs**: borda 1.5px `--color-border`, focus em `--color-champagne-light` com glow `rgba(184,150,110,0.1)`.
- **Botão primário (CTA)**: gradiente `linear-gradient(135deg, #c4a882 → #a07850)`, texto branco uppercase, letter-spacing 3px, border-radius 50px (pill), sombra champagne.
- **Ornamentos**: linha fina champagne com coraçãozinho SVG no centro, repetido em separadores de seção (igual ao `lista_presença.html`).
- **Background**: cream com dois `radial-gradient` em opacidade baixa (champagne) — herdar do HTML.

### 3.4. Animações (regra de bolso)

- Entrada de seção: `fadeUp` (translateY 18px → 0, opacity 0 → 1) com `IntersectionObserver` + Framer Motion `whileInView`. Stagger de 80ms entre filhos.
- Hover de card: `scale: 1.02` + leve aumento de sombra, 200ms.
- Carrinho lateral: slide-in da direita, 300ms, ease-out.
- **Não** usar parallax, scroll-jacking, ou animações infinitas que rodem fora da viewport. Respeitar `prefers-reduced-motion`.

---

## 4. Estrutura do site (rotas)

```
/                    → Página principal one-page
/presentes           → Lista de presentes (rota separada para evitar peso na home)
/presentes/resumo    → Tela "Resumo do presente" (nome + WhatsApp)
/presentes/pagar     → Tela de pagamento (PIX / Cartão)
/rsvp                → Lista de presença (modal a partir da home, mas também acessível direto)
/admin               → Login admin (não listado em nenhum menu)
/admin/dashboard     → Painel após login
```

A `/admin` **não tem link em lugar nenhum do site público** — só é acessível digitando `/admin` na URL. Adicionar `<meta name="robots" content="noindex,nofollow">` na rota.

---

## 5. Seções da home (one-page)

Ordem inspirada no Canva, com palavras escolhidas para refletir o tom do casal. Cada seção ocupa ~100vh em desktop e empilha bem em mobile.

### 5.1. Tela de abertura (intro animada)
Quando o site carrega, **antes** da home, mostra uma tela de abertura curta (~1.5s):
- Fundo cream com ornamento champagne suspirando para dentro.
- Texto: **"Vamos nos casar"** (`Cormorant`, 300, grande).
- Subtexto: **"Samara & Renan"** (italic, champagne-deep).
- Subtítulo: **"11 . 10 . 2026"** (Jost, uppercase, letter-spacing).
- Ao final, fade para a home. Com flag em sessionStorage para não repetir em navegações internas.

### 5.2. Hero
- Foto do casal (escolher a melhor de `fotos do casal/`) com leve overlay champagne para legibilidade.
- Título **"Samara & Renan"** em Cormorant italic.
- **Contagem regressiva** até 11/10/2026 10:30 (dias / horas / minutos / segundos), em pílulas champagne.
- Versículo: *"Isto é obra do Senhor, e é maravilhosa aos nossos olhos." — Salmos 118:23*
- CTAs: `Confirmar Presença` (primário) + `Lista de Presentes` (outline).

### 5.3. Menu fixo (sticky top)
Aparece após scrollar a hero. Itens: **Início · Nossa História · O Grande Dia · Galeria · RSVP · Presentes**. Em mobile, vira hambúrguer com drawer pela direita. Background cream com 90% opacidade + backdrop-blur.

### 5.4. Nossa História
- Texto curto inspirado na seção "Nossa História" do Canva (não copiar literal — adaptar).
- Foto `foto para nossa história.png` ao lado (em desktop) ou acima (em mobile).
- Estilo: card discreto com borda champagne, parágrafo em Cormorant italic 17px, `line-height: 1.7`.

### 5.5. O Grande Dia
Três blocos lado a lado (em desktop) / empilhados (mobile):
- **Cerimônia** — 11 de outubro de 2026 · 10:30 · Igreja Assembleia de Deus – Jardim Catuaí · *R. Joaquim Ferreira Sobrinho, 281 – Núcleo Hab. Parigot de Souza, Apucarana-PR, 86802-610* · botão "Ver no mapa" → link Google Maps.
- **Recepção** — Logo após a cerimônia · Recanto Vô Coruja, Apucarana-PR · botão "Ver no mapa".
- **Traje** — Esporte fino / a critério do convidado (texto a definir com o casal).

Links Google Maps:
- Cerimônia: `https://www.google.com/maps/place/R.+Joaquim+Ferreira+Sobrinho,+281+-+Nucleo+Hab.+Parigot+de+Souza,+Apucarana+-+PR,+86802-610/@-23.5663586,-51.4390709,14z/data=!4m5!3m4!1s0x94ec9bc0d637a1f7:0xe0809663c30c6f4b!8m2!3d-23.5763053!4d-51.4567949`
- Recepção: `https://www.google.com/maps/place/Recanto+Vô+Coruja/@-23.5793603,-51.4745808,17z/data=!4m14!1m7!3m6!1s0x94ec9bf8df08f519:0x55e24e14152c5f94!2sRecanto+Vô+Coruja!8m2!3d-23.5793652!4d-51.4720059`

### 5.6. Galeria
Grid responsivo (3 colunas desktop / 2 tablet / 1 mobile) com fotos de `/public/fotos-do-casal/`. Lightbox simples ao clicar. Fotos atuais: `image.png`, `image copy.png`, `image2.png`, `image3.png`, `image 4.png`. **Mais fotos serão adicionadas pelo casal posteriormente** — deixar a montagem do grid genérica para aceitar N imagens.

### 5.7. RSVP — Confirmação de Presença
Botão grande champagne **"Confirmar Presença"** que abre um **modal/sheet** com o formulário **idêntico em comportamento** ao `lista_presença.html`:
- Pergunta "Você irá ao casamento?" (Sim / Não) — radio.
- Busca por nome (autocomplete) → carrega o **grupo familiar** correspondente do banco.
- Lista de membros do grupo com checkbox (todos pré-marcados se "Sim", para o convidado desmarcar quem não vai).
- Telefone (obrigatório), email (obrigatório), comentário (opcional, com placeholder dinâmico baseado em Sim/Não).
- Submit envia para `POST /api/rsvp` (Route Handler), que:
  1. Persiste no Supabase (`rsvp_responses`).
  2. Envia email via Brevo para `renangada@gmail.com` com todos os campos preenchidos (template em React Email).
  3. Retorna sucesso → modal mostra overlay de agradecimento (mesma copy do HTML — 💍 / 🙏).

### 5.8. Lista de Presentes (CTA + link)
Bloco breve com a copy: *"Sua presença é nosso maior presente. Mas se quiser nos abençoar..."* + botão **"Ver Lista de Presentes"** que leva para `/presentes`.

### 5.9. Mensagem final / agradecimento
Foto do casal + frase emotiva curta + assinatura *"Com amor, Samara & Renan"*.

### 5.10. Rodapé
Discreto, champagne sobre cream: data + local + © 2026.

---

## 6. Página `/presentes`

Estrutura inspirada no Moroni, **mas estilizada** com a paleta champagne/cream + acentos pastel. **Não usar o tema bordô escuro do Moroni** — substituir pelo cream/champagne.

### 6.1. Topo da página
- Título **"Lista de Presentes"** (Cormorant grande).
- Copy: *"Sua presença é o maior presente. Mas se quiser nos ajudar a construir nossa nova vida..."*
- Caixa destaque com **PIX direto**: QR Code (`qrcode.png`) clicável → abre `https://nubank.com.br/cobrar/5sjpz/69fa538e-109a-4606-b408-0fa284a5938d` em nova aba.
- Botões secundários abaixo do QR:
  - **"Copiar código PIX"** → copia o copia-e-cola PIX para clipboard, mostra toast "Copiado!". Código:
    ```
    00020126580014BR.GOV.BCB.PIX0136d8c6c7af-56da-4630-a769-8bfe6a4b97005204000053039865802BR5925Renan Goncalves de Almeid6009SAO PAULO62140510RCygUpW3rq63047A2B
    ```
  - **"PIX por email"** → mostra o email `renan_gs14@hotmail.com` em destaque com botão de copiar.
  - **"Pagar com cartão"** → abre `https://link.mercadopago.com.br/samaraerenan` em nova aba.

### 6.2. Cards de presentes — "Ou escolha um presente"

Grid de cards (3 colunas desktop / 2 tablet / 1 mobile). Cada card:
- Imagem (lazy-loaded, aspect 4:3, hover com leve scale).
- Nome do presente.
- Valor (`text-champagne-deep`, fonte 20px).
- Botão **"Adicionar"** (champagne, pequeno).

**Itens fixos sempre presentes (valor livre — input numérico ao adicionar):**
1. **Ajuda para Mobiliar** — "qualquer valor"
2. **Primeiros Meses Juntos** — "qualquer valor"

**Demais itens**: copiar lista do site Moroni (nomes, valores, imagens). Salvar imagens em `/public/presentes/` e popular um JSON estático em `src/data/presentes.ts` com `{ id, nome, valor, imagem, descricao? }`. **Não preciso fazer admin de presentes nesta versão** — lista é estática.

### 6.3. Carrinho

Estado global com Zustand (`useCartStore`), persistido em localStorage.

**Comportamento (igual `carrinho.png` + `icone no canto direito...png`):**
- Ao adicionar item, abre **drawer lateral direito** (cor cream com header champagne).
- Drawer mostra: lista de itens, quantidade ajustável, total, botões `FINALIZAR PRESENTE` (primário champagne) e `ESCOLHER MAIS ITENS` (secundário, fecha drawer).
- Ao fechar o drawer, aparece **ícone flutuante** (sacola) no canto inferior direito com **badge** mostrando a quantidade de itens. Clicar reabre o drawer.

### 6.4. Tela `/presentes/resumo` (Resumo do Presente)

**Visual:** fundo escuro champagne-deep (`#3d2818` — adaptação do bordô do print mantendo a temperatura quente). Conteúdo centralizado, tipografia Cormorant clara. Espelhar o print `tela_resumo_do_presente.png`.

Conteúdo:
- Label uppercase "RESUMO DO PRESENTE"
- "X itens selecionados"
- **Total em destaque** (Cormorant, ~80px, champagne claro)
- Form: **Nome completo** + **WhatsApp** (com máscara `(00) 0 0000-0000`).
- Botão **"CONTINUAR PARA PAGAMENTO"** → leva para `/presentes/pagar` com state preservado (passar via `searchParams` codificados ou Zustand persistido).
- Link discreto **"← Voltar para a lista"**.
- Linha divisória champagne.
- Texto: *"Após pagar, envie o comprovante por WhatsApp"* + botão `ENVIAR COMPROVANTE` → abre WhatsApp do Renan com mensagem pré-preenchida.

### 6.5. Tela `/presentes/pagar` (Pagamento)

Espelhar print `resumo_tela_pagamento.png`. Toggle entre **PIX** e **CARTÃO**:

**PIX:**
- Botão grande **"PAGAR R$ XX,XX VIA PIX"** → abre o link do Nubank `https://nubank.com.br/cobrar/5sjpz/69fa538e-109a-4606-b408-0fa284a5938d`.
- Texto: *"Ou use a chave manualmente:"*
- **Chave PIX (email):** `renan_gs14@hotmail.com` (clicar → copia + toast).
- **QR Code** (`qrcode.png`) embaixo, clicável (abre o link do Nubank).
- Botão pequeno: **"Copiar código copia-e-cola"** → copia o BRcode.

**CARTÃO:**
- Botão grande **"PAGAR R$ XX,XX VIA CARTÃO"** → abre `https://link.mercadopago.com.br/samaraerenan`.

Em ambas as abas: rodapé com `ENVIAR COMPROVANTE` (WhatsApp) e `← Voltar`.

### 6.6. Registro do presente (envio para admin)

**Antes** de redirecionar para o pagamento (PIX ou cartão), enviar `POST /api/presentes/registrar` com `{ nome, whatsapp, itens: [{id, nome, valor, qtd}], total, metodo }`. Backend:
1. Persiste em `gift_purchases` no Supabase.
2. Envia email para `renangada@gmail.com` via Brevo: *"Novo presente registrado por [Nome] – R$ XX,XX – [lista de itens]"*.
3. Não bloqueia o redirect (envio "fire-and-forget" com pequeno timeout). O pagamento é responsabilidade do convidado; o registro é informativo.

> Nota: não é checkout real. O convidado pode registrar e nunca pagar. O admin tem que confirmar manualmente o pagamento depois (campo `status` no admin).

---

## 7. Lista de presença (RSVP) — Dados

### 7.1. Modelo de dados (Supabase)

```sql
-- Famílias / grupos
create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,            -- ex: "Família Adalberto"
  notes text,
  created_at timestamptz default now()
);

-- Convidados (ligados a uma família)
create table guests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  is_child boolean not null default false,
  created_at timestamptz default now()
);

-- Respostas RSVP
create table rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id),
  confirmed boolean not null,        -- true = vai, false = não vai
  attending_guest_ids uuid[] not null,
  phone text not null,
  email text not null,
  comment text,
  created_at timestamptz default now()
);

-- Compras de presentes
create table gift_purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_whatsapp text not null,
  items jsonb not null,              -- [{id, nome, valor, qtd}]
  total numeric(10,2) not null,
  payment_method text,               -- 'pix' | 'cartao' | null
  status text default 'aguardando',  -- 'aguardando' | 'confirmado'
  created_at timestamptz default now()
);
```

RLS: ligar tudo, e criar policies que **só permitem leitura/escrita autenticada** para `families`, `guests`, `rsvp_responses`, `gift_purchases` (admin). Endpoints públicos (`/api/rsvp`, busca de convidado) usam **service-role key apenas no server**, nunca expõem ao cliente.

### 7.2. Busca pública de convidado

`GET /api/guests/search?q=joao` → retorna a família inteira do primeiro match (até 5 sugestões). Não expor IDs internos sensíveis.

---

## 8. Painel admin (`/admin`)

### 8.1. Login (`/admin`)

Tela simples, mesmo estilo do site:
- Título "Área do Casal".
- Inputs email + senha.
- Botão "Entrar".
- Sem link de "esqueci a senha" (resetar manualmente no Supabase).
- Sem link de "criar conta" (Renan e Samara são cadastrados manualmente no Supabase pelo Renan).

Após login, redirect para `/admin/dashboard`. Sessão via cookie HTTP-only do Supabase (já tratado pelo SDK).

### 8.2. Dashboard (`/admin/dashboard`)

Layout com sidebar + área principal. Abas:

**Visão Geral**
- Cards de métricas: total de famílias, total de convidados, confirmados (verde), recusados (vermelho), **pendentes** (cinza — quem ainda não respondeu).
- Gráfico simples (barras) de respostas por dia.

**Famílias e Convidados**
- Lista de famílias (tabela / cards expansíveis).
- Botão **"+ Adicionar Família"** → modal com nome + lista dinâmica de convidados (campo nome + checkbox criança), pode adicionar/remover linhas.
- Em cada família, ações: editar, adicionar pessoa, remover família.
- Em cada pessoa: editar nome, marcar como criança, remover.
- Indicador visual: ✅ confirmado / ❌ não vai / ⏳ pendente, baseado em `rsvp_responses` mais recente da família.

**Respostas RSVP**
- Tabela de todas as respostas, ordenada por data desc.
- Colunas: data, família, confirmado?, quem vem (nomes), telefone, email, comentário.
- Filtros: confirmado/não confirmado/pendente.
- Botão **"Exportar CSV"**.

**Presentes recebidos**
- Tabela de `gift_purchases`.
- Colunas: data, comprador, WhatsApp (clicável), itens, total, método, status.
- Botão para alternar status entre `aguardando` ↔ `confirmado` (quando o casal validar o comprovante).
- Total geral arrecadado no topo.

### 8.3. Segurança

- Todas as rotas `/admin/*` protegidas por middleware Next.js que verifica sessão Supabase. Sem sessão → redirect `/admin` (login).
- `noindex,nofollow` em todas as páginas admin.
- Service-role key **só** em Route Handlers do server, nunca em Client Components. Anon key OK no cliente.
- Validação de tudo com Zod nos Route Handlers.

---

## 9. Emails (Brevo + React Email)

Templates em `src/emails/`:

1. **`RsvpEmail.tsx`** — enviado para `renangada@gmail.com` em qualquer resposta (Sim ou Não), conteúdo varia pela flag `confirmed`.
2. **`GiftPurchaseEmail.tsx`** — enviado para `renangada@gmail.com` quando alguém finaliza um presente.

Estilo dos emails: cream/champagne, mesma identidade do site, footer "Site dos noivos · Samara & Renan".

Fluxo de envio: o helper `src/lib/brevo.ts` renderiza o componente React para HTML com `@react-email/components` (`render`) e faz `POST https://api.brevo.com/v3/smtp/email` direto via `fetch` — não usa SDK do Brevo (uma dep a menos). Se `BREVO_API_KEY` ou `BREVO_FROM_EMAIL` não estiverem configuradas, o helper retorna sem erro e a route apenas loga (com `redact`) — o RSVP/presente é persistido normalmente.

Variáveis de ambiente:
```
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=noreply@dominio-verificado.com   # precisa ser sender verificado no Brevo
BREVO_FROM_NAME="Casamento Samara & Renan"        # opcional (default já é esse)
NOTIFICATION_EMAIL=renangada@gmail.com
```

Setup no Brevo: criar conta em brevo.com → *Senders, Domains & Dedicated IPs* → verificar o email "from" (ou domínio inteiro via DNS) → *SMTP & API → API Keys* → gerar nova chave.

---

## 10. Variáveis de ambiente

Criar `.env.example` documentando:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Só usar no server

# Brevo (email transacional)
BREVO_API_KEY=
BREVO_FROM_EMAIL=                  # Sender verificado no painel Brevo
BREVO_FROM_NAME="Casamento Samara & Renan"
NOTIFICATION_EMAIL=renangada@gmail.com

# WhatsApp do Renan (para botão "Enviar Comprovante")
NEXT_PUBLIC_WHATSAPP_NUMBER=55XXXXXXXXXXX

# Pagamento
NEXT_PUBLIC_PIX_QR_LINK=https://nubank.com.br/cobrar/5sjpz/69fa538e-109a-4606-b408-0fa284a5938d
NEXT_PUBLIC_PIX_COPIA_COLA=00020126580014BR.GOV.BCB.PIX0136d8c6c7af-56da-4630-a769-8bfe6a4b97005204000053039865802BR5925Renan Goncalves de Almeid6009SAO PAULO62140510RCygUpW3rq63047A2B
NEXT_PUBLIC_PIX_EMAIL=renan_gs14@hotmail.com
NEXT_PUBLIC_MERCADO_PAGO_LINK=https://link.mercadopago.com.br/samaraerenan
```

`.env.local` real **fica fora do git** (`.gitignore` já cobre).

---

## 11. Estrutura de pastas (sugestão)

```
casamento/
├── public/
│   ├── fotos-do-casal/        # imagens do hero/galeria
│   ├── presentes/             # imagens dos cards de presentes
│   ├── nossa-historia.png
│   └── qrcode.png
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # home one-page
│   │   │   ├── presentes/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── resumo/page.tsx
│   │   │   │   └── pagar/page.tsx
│   │   │   └── rsvp/page.tsx      # fallback (modal é o caminho normal)
│   │   ├── admin/
│   │   │   ├── page.tsx           # login
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx     # protegido
│   │   │       ├── page.tsx       # visão geral
│   │   │       ├── familias/page.tsx
│   │   │       ├── rsvp/page.tsx
│   │   │       └── presentes/page.tsx
│   │   ├── api/
│   │   │   ├── rsvp/route.ts
│   │   │   ├── guests/search/route.ts
│   │   │   └── presentes/registrar/route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── sections/          # Hero, NossaHistoria, OGrandeDia, ...
│   │   ├── rsvp/              # RsvpModal, GuestSearch, ...
│   │   ├── presentes/         # GiftCard, CartDrawer, CartFab, ...
│   │   ├── admin/
│   │   └── ui/                # shadcn
│   ├── emails/                # React Email templates
│   ├── lib/
│   │   ├── supabase/          # clients (browser, server, middleware)
│   │   ├── brevo.ts
│   │   ├── cart-store.ts      # Zustand
│   │   └── utils.ts
│   ├── data/
│   │   └── presentes.ts       # JSON estático dos itens
│   ├── styles/globals.css
│   └── middleware.ts          # protege /admin/dashboard/*
├── design-references/         # prints originais (não vai pro deploy)
├── claude.md                  # este arquivo
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 12. Conteúdo (copy) — fonte de verdade

| Item | Texto |
|---|---|
| Casal | Samara & Renan |
| Data | 11 de outubro de 2026 |
| Horário | 10h30 |
| Cerimônia | Igreja Assembleia de Deus – Jardim Catuaí |
| Endereço cerimônia | R. Joaquim Ferreira Sobrinho, 281 – Núcleo Hab. Parigot de Souza, Apucarana-PR, 86802-610 |
| Recepção | Recanto Vô Coruja, Apucarana-PR |
| Versículo | "Isto é obra do Senhor, e é maravilhosa aos nossos olhos." — Salmos 118:23 |
| Frase de boas-vindas | "Sua presença é o maior presente que poderíamos receber!" |
| PIX – chave (email) | renan_gs14@hotmail.com |
| PIX – titular | Renan Gonçalves de Almeida |
| PIX – cidade | São Paulo |
| Email notificações | renangada@gmail.com |

A copy de "Nossa História" é livre — escrever um parágrafo curto inspirado na voz do Canva quando esta seção for implementada (Renan revisa).

---

## 13. Checklist de implementação (ordem sugerida)

1. `npx create-next-app@latest casamento --typescript --tailwind --app --eslint`
2. Configurar Tailwind v4 com tokens da paleta + fontes via `next/font`
3. Adicionar shadcn/ui (`npx shadcn@latest init`) e instalar só Dialog, Sheet, Form, Input, Button, Tabs, Toast
4. Criar `lib/supabase/{client,server,middleware}.ts`
5. Criar tabelas no Supabase + RLS + migrations versionadas
6. Implementar home (seções estáticas) — começar pela Hero e descer
7. Implementar modal de RSVP com busca por nome + persistência
8. Implementar página de presentes + carrinho Zustand + drawer
9. Implementar fluxo `/presentes/resumo` e `/presentes/pagar`
10. Implementar Route Handlers + emails Brevo
11. Implementar `/admin` (login) + middleware
12. Implementar `/admin/dashboard` (4 abas)
13. Polir animações Framer Motion (entradas e drawer)
14. Testes manuais em mobile (iOS Safari + Android Chrome) e desktop
15. Lighthouse: alvo Performance ≥90, Accessibility ≥95
16. Push para GitHub → Renan faz deploy no Netlify

---

## 14. Pontos abertos (a confirmar com o casal antes da implementação)

- **Traje** dos convidados (esporte fino? esporte? livre?).
- **Texto de "Nossa História"** — Renan envia, ou autoriza Claude a redigir um draft.
- **Lista exata de presentes do Moroni** a copiar (quais itens, valores). Plano: na fase de implementação, Claude lista os itens propostos para Renan validar.
- **Sender verificado no Brevo** (definir o email "from" e verificar no painel — pode ser o próprio `renan_gs14@hotmail.com` ou um domínio próprio quando houver).
- **Foto principal da Hero** (qual das 5 da pasta `fotos do casal`).
- **Número de WhatsApp** do Renan (para botão "Enviar Comprovante").

---

## 15. Notas finais para o agente implementador

- **Antes de criar componentes novos**, verifique `src/components/ui/`. Reutilize.
- **Antes de criar utilitários novos**, verifique `src/lib/utils.ts`.
- Imagens: nunca usar `<img>` cru — sempre `next/image`. Compactar em build.
- Animações: nada de `setInterval` para parallax; só `whileInView` do Framer Motion.
- Acessibilidade: todo card clicável tem `role="button"` + `aria-label` descritivo.
- Idioma: pt-BR. `<html lang="pt-BR">`.
- SEO: `<title>Samara & Renan · 11.10.2026</title>`, OG image com a foto do casal.
- **Não inventar dados** (datas, valores, presentes) — pedir ao Renan se faltar algo.
- **Não criar README ou docs extras** sem o Renan pedir.
- Deploy é manual no Netlify pelo Renan — **não tentar fazer push ou deploy automaticamente**.
