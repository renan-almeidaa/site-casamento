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
  email text, -- legado: o RSVP não pede mais email
  comment text,
  created_at timestamptz default now()
);
create index if not exists rsvp_family_idx on rsvp_responses(family_id);
-- Migration para bancos já existentes (idempotente):
alter table rsvp_responses alter column email drop not null;
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

-- =====================================================================
-- Chá de casa nova
-- Rode este bloco inteiro no SQL Editor (é idempotente).
-- =====================================================================

-- Uma resposta por família.
create table if not exists cha_rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null unique references families(id) on delete cascade,
  attending_guest_ids uuid[] not null default '{}',
  whatsapp text not null,
  gives_pix boolean not null default false,
  comment text,
  created_at timestamptz default now()
);
create index if not exists cha_rsvp_created_idx on cha_rsvp_responses(created_at desc);

-- item_id como PK garante que cada item tem um dono só.
create table if not exists cha_gift_claims (
  item_id text primary key,
  response_id uuid not null references cha_rsvp_responses(id) on delete cascade,
  created_at timestamptz default now()
);
create index if not exists cha_claims_response_idx on cha_gift_claims(response_id);

alter table cha_rsvp_responses enable row level security;
alter table cha_gift_claims enable row level security;

drop policy if exists "admin all on cha_rsvp_responses" on cha_rsvp_responses;
create policy "admin all on cha_rsvp_responses" on cha_rsvp_responses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin all on cha_gift_claims" on cha_gift_claims;
create policy "admin all on cha_gift_claims" on cha_gift_claims
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Grava resposta + itens numa transação só. Se outra pessoa pegou algum
-- item no meio do caminho, nada é gravado e a função devolve quais itens
-- já têm dono.
create or replace function submit_cha_rsvp(
  p_family_id uuid,
  p_attending uuid[],
  p_whatsapp text,
  p_gives_pix boolean,
  p_comment text,
  p_item_ids text[]
) returns json
language plpgsql
as $$
declare
  v_id uuid;
begin
  begin
    insert into cha_rsvp_responses (family_id, attending_guest_ids, whatsapp, gives_pix, comment)
    values (p_family_id, p_attending, p_whatsapp, p_gives_pix, p_comment)
    returning id into v_id;

    insert into cha_gift_claims (item_id, response_id)
    select unnest(p_item_ids), v_id;
  exception when unique_violation then
    if exists (select 1 from cha_rsvp_responses where family_id = p_family_id) then
      return json_build_object('ok', false, 'error', 'family_exists');
    end if;
    return json_build_object(
      'ok', false,
      'error', 'taken',
      'taken', (select coalesce(json_agg(item_id), '[]'::json)
                from cha_gift_claims where item_id = any(p_item_ids))
    );
  end;
  return json_build_object('ok', true, 'id', v_id);
end;
$$;

-- Só o servidor (service role) pode chamar a função.
revoke execute on function submit_cha_rsvp(uuid, uuid[], text, boolean, text, text[]) from public, anon, authenticated;
grant execute on function submit_cha_rsvp(uuid, uuid[], text, boolean, text, text[]) to service_role;

-- =====================================================================
-- Cotas dos presentes grandes
-- Rode este bloco inteiro no SQL Editor (é idempotente).
-- =====================================================================

-- Uma linha por presente em cada compra. Apagar a compra libera as cotas.
create table if not exists gift_quota_claims (
  id uuid primary key default gen_random_uuid(),
  presente_id text not null,
  purchase_id uuid not null references gift_purchases(id) on delete cascade,
  qtd int not null check (qtd > 0),
  created_at timestamptz default now(),
  unique (presente_id, purchase_id)
);
create index if not exists gift_quota_claims_presente_idx on gift_quota_claims(presente_id);
create index if not exists gift_quota_claims_purchase_idx on gift_quota_claims(purchase_id);

alter table gift_quota_claims enable row level security;

drop policy if exists "admin all on gift_quota_claims" on gift_quota_claims;
create policy "admin all on gift_quota_claims" on gift_quota_claims
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Grava o presente + cotas numa transação só. A trava por presente garante
-- que a soma nunca passa do total; se faltar cota, nada é gravado e a função
-- devolve quanto resta. p_cotas = [{presente_id, qtd, total}]. p_previous_id é
-- o registro anterior da mesma sessão (convidado voltou e reenviou).
create or replace function register_gift_with_quotas(
  p_buyer_name text,
  p_buyer_whatsapp text,
  p_items jsonb,
  p_total numeric,
  p_payment_method text,
  p_cotas jsonb,
  p_previous_id uuid
) returns json
language plpgsql
as $$
declare
  v_id uuid;
  v_short jsonb := '[]'::jsonb;
  v_usado int;
  r record;
begin
  begin
    perform pg_advisory_xact_lock(hashtext(x.presente_id))
    from (
      select distinct presente_id
      from jsonb_to_recordset(p_cotas) as c(presente_id text)
      order by presente_id
    ) x;

    if p_previous_id is not null then
      delete from gift_purchases where id = p_previous_id and status = 'aguardando';
    end if;

    for r in select * from jsonb_to_recordset(p_cotas) as c(presente_id text, qtd int, total int) loop
      select coalesce(sum(qtd), 0) into v_usado from gift_quota_claims where presente_id = r.presente_id;
      if v_usado + r.qtd > r.total then
        v_short := v_short || jsonb_build_object('presente_id', r.presente_id, 'restante', r.total - v_usado);
      end if;
    end loop;

    if jsonb_array_length(v_short) > 0 then
      raise exception 'cotas_insuficientes' using errcode = 'QU001';
    end if;

    insert into gift_purchases (buyer_name, buyer_whatsapp, items, total, payment_method, status)
    values (p_buyer_name, p_buyer_whatsapp, p_items, p_total, p_payment_method, 'aguardando')
    returning id into v_id;

    insert into gift_quota_claims (presente_id, purchase_id, qtd)
    select c.presente_id, v_id, c.qtd
    from jsonb_to_recordset(p_cotas) as c(presente_id text, qtd int);
  exception when sqlstate 'QU001' then
    return json_build_object('ok', false, 'short', v_short);
  end;
  return json_build_object('ok', true, 'id', v_id);
end;
$$;

-- Só o servidor (service role) pode chamar a função.
revoke execute on function register_gift_with_quotas(text, text, jsonb, numeric, text, jsonb, uuid) from public, anon, authenticated;
grant execute on function register_gift_with_quotas(text, text, jsonb, numeric, text, jsonb, uuid) to service_role;

-- Formato antigo (lotes numerados).
-- CLEANUP
drop function if exists register_gift_purchase(text, text, jsonb, numeric, text, text[], uuid);
drop table if exists gift_lot_claims;

-- =====================================================================
-- Itens de dono único (coisas de casa) e registro do presente
-- Rode este bloco inteiro no SQL Editor (é idempotente).
-- =====================================================================

-- item_id como PK garante um dono só. Apagar a compra libera o item.
create table if not exists gift_item_claims (
  item_id text primary key,
  purchase_id uuid not null references gift_purchases(id) on delete cascade,
  created_at timestamptz default now()
);
create index if not exists gift_item_claims_purchase_idx on gift_item_claims(purchase_id);

alter table gift_item_claims enable row level security;

drop policy if exists "admin all on gift_item_claims" on gift_item_claims;
create policy "admin all on gift_item_claims" on gift_item_claims
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Grava o presente, as cotas e os itens de dono único numa transação só. Se
-- faltar cota ou o item já tiver dono, nada é gravado e a função devolve o que
-- está indisponível. p_cotas = [{presente_id, qtd, total}]. p_previous_id é o
-- registro anterior da mesma sessão (convidado voltou e reenviou).
create or replace function register_gift_checkout(
  p_buyer_name text,
  p_buyer_whatsapp text,
  p_items jsonb,
  p_total numeric,
  p_payment_method text,
  p_cotas jsonb,
  p_item_ids text[],
  p_previous_id uuid
) returns json
language plpgsql
as $$
declare
  v_id uuid;
  v_short jsonb := '[]'::jsonb;
  v_taken jsonb := '[]'::jsonb;
  v_usado int;
  r record;
begin
  begin
    -- Trava por presente/item, sempre na mesma ordem, para evitar deadlock.
    perform pg_advisory_xact_lock(hashtext(x.chave))
    from (
      select distinct chave from (
        select presente_id as chave from jsonb_to_recordset(p_cotas) as c(presente_id text)
        union all
        select unnest(p_item_ids)
      ) t
      order by chave
    ) x;

    if p_previous_id is not null then
      delete from gift_purchases where id = p_previous_id and status = 'aguardando';
    end if;

    for r in select * from jsonb_to_recordset(p_cotas) as c(presente_id text, qtd int, total int) loop
      select coalesce(sum(qtd), 0) into v_usado from gift_quota_claims where presente_id = r.presente_id;
      if v_usado + r.qtd > r.total then
        v_short := v_short || jsonb_build_object('presente_id', r.presente_id, 'restante', r.total - v_usado);
      end if;
    end loop;

    select coalesce(jsonb_agg(item_id), '[]'::jsonb) into v_taken
    from gift_item_claims where item_id = any(p_item_ids);

    if jsonb_array_length(v_short) > 0 or jsonb_array_length(v_taken) > 0 then
      raise exception 'indisponivel' using errcode = 'QU001';
    end if;

    insert into gift_purchases (buyer_name, buyer_whatsapp, items, total, payment_method, status)
    values (p_buyer_name, p_buyer_whatsapp, p_items, p_total, p_payment_method, 'aguardando')
    returning id into v_id;

    insert into gift_quota_claims (presente_id, purchase_id, qtd)
    select c.presente_id, v_id, c.qtd
    from jsonb_to_recordset(p_cotas) as c(presente_id text, qtd int);

    insert into gift_item_claims (item_id, purchase_id)
    select unnest(p_item_ids), v_id;
  exception when sqlstate 'QU001' then
    return json_build_object('ok', false, 'short', v_short, 'taken', v_taken);
  end;
  return json_build_object('ok', true, 'id', v_id);
end;
$$;

-- Só o servidor (service role) pode chamar a função.
revoke execute on function register_gift_checkout(text, text, jsonb, numeric, text, jsonb, text[], uuid) from public, anon, authenticated;
grant execute on function register_gift_checkout(text, text, jsonb, numeric, text, jsonb, text[], uuid) to service_role;

-- Compras feitas antes desta regra: reserva os itens de dono único delas.
insert into gift_item_claims (item_id, purchase_id, created_at)
select it->>'id', p.id, p.created_at
from gift_purchases p, jsonb_array_elements(p.items) it
where it->>'id' in (
  'comoda', 'rack-tv', 'forno-eletrico', 'filtro-agua', 'espelho-corpo',
  'chuveiro-eletrico', 'mesa-cabeceira', 'kit-ferramentas', 'aspirador-po',
  'furadeira', 'seguranca-lar', 'ventilador', 'escada-domestica', 'prateleiras',
  'instalacao-cortinas', 'iluminacao', 'cantinho-verde'
)
on conflict (item_id) do nothing;

-- Função anterior: só apagar depois que o site publicado usar a nova.
-- CLEANUP
drop function if exists register_gift_with_quotas(text, text, jsonb, numeric, text, jsonb, uuid);
