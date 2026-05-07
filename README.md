# Site de Casamento — Samara & Renan

Site oficial do casamento de Samara e Renan (11/10/2026).

> 📖 Para o briefing completo do projeto, veja [claude.md](./claude.md).

## Stack
Next.js 15 · React 19 · TypeScript · Tailwind v4 · Framer Motion · Supabase · Resend · Zustand.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # depois preencha com suas chaves
npm run dev
```

Abra `http://localhost:3000`. Sem Supabase configurado, o site usa um banco em memória (apenas para desenvolvimento) — perfeito para visualizar tudo sem setup.

## Páginas

- `/` — home one-page (intro, hero, história, grande dia, galeria, RSVP, presentes)
- `/presentes` — lista de presentes com carrinho
- `/presentes/resumo` — dados do comprador (nome + WhatsApp)
- `/presentes/pagar` — escolha PIX ou cartão e paga
- `/admin` — login do casal (não indexado)
- `/admin/dashboard` — painel com famílias, RSVPs e presentes recebidos

## Configurando Supabase em produção

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Rode o SQL em [`src/lib/supabase/schema.sql`](./src/lib/supabase/schema.sql) no SQL Editor
3. Em Authentication → Users, **crie manualmente** os usuários do Renan e da Samara
4. Copie as chaves para `.env.local` (URL, anon, service_role)

## Configurando Resend

1. Crie conta em [resend.com](https://resend.com), pegue a API key
2. (Opcional) verifique o domínio que vai mandar emails
3. Coloque a key em `RESEND_API_KEY` e o "from" em `RESEND_FROM_EMAIL`

## Deploy no Netlify

1. Suba o repositório para o GitHub
2. Conecte ao Netlify, selecione o repo
3. Build command: `npm run build` · Publish directory: `.next`
4. Adicione todas as variáveis de ambiente no painel do Netlify
5. Deploy 🎉
