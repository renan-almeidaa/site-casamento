-- =====================================================================
-- Site de Casamento — Samara & Renan
-- Schema do banco. Rode no SQL Editor do Supabase em produção.
-- =====================================================================

-- Famílias / grupos
create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  created_at timestamptz default now()
);
create index if not exists families_name_idx on families using gin (to_tsvector('portuguese', name));

-- Convidados
create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  is_child boolean not null default false,
  nicknames text[] not null default '{}',
  created_at timestamptz default now()
);
create index if not exists guests_family_idx on guests(family_id);
create index if not exists guests_name_idx on guests using gin (to_tsvector('portuguese', name));

-- Migration para bancos já existentes (idempotente):
alter table guests add column if not exists nicknames text[] not null default '{}';

-- Respostas RSVP
create table if not exists rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  confirmed boolean not null,
  attending_guest_ids uuid[] not null,
  phone text not null,
  email text not null,
  comment text,
  created_at timestamptz default now()
);
create index if not exists rsvp_family_idx on rsvp_responses(family_id);
create index if not exists rsvp_created_idx on rsvp_responses(created_at desc);

-- Compras de presentes
create table if not exists gift_purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_whatsapp text not null,
  items jsonb not null,
  total numeric(10, 2) not null,
  payment_method text,
  status text default 'aguardando',
  created_at timestamptz default now()
);
create index if not exists gift_status_idx on gift_purchases(status);
create index if not exists gift_created_idx on gift_purchases(created_at desc);

-- =====================================================================
-- RLS — apenas autenticados (admins) leem e escrevem.
-- Endpoints públicos (busca de convidado, RSVP, registro de presente)
-- usam SUPABASE_SERVICE_ROLE_KEY e bypass RLS.
-- =====================================================================
alter table families enable row level security;
alter table guests enable row level security;
alter table rsvp_responses enable row level security;
alter table gift_purchases enable row level security;

drop policy if exists "admin all on families" on families;
create policy "admin all on families" on families
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin all on guests" on guests;
create policy "admin all on guests" on guests
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin all on rsvp_responses" on rsvp_responses;
create policy "admin all on rsvp_responses" on rsvp_responses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin all on gift_purchases" on gift_purchases;
create policy "admin all on gift_purchases" on gift_purchases
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
