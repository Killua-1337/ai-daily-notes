-- AI Daily Notes — Initial Schema

-- Note
create table public.note (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Без названия',
  content     text not null default '',
  note_date   date not null default current_date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Tag
create table public.tag (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now(),
  unique(user_id, name)
);

-- Note-Tag (M:M)
create table public.note_tag (
  note_id     uuid not null references public.note(id) on delete cascade,
  tag_id      uuid not null references public.tag(id) on delete cascade,
  primary key (note_id, tag_id)
);

-- Indexes
create index idx_note_user_date on public.note(user_id, note_date desc);
create index idx_tag_user on public.tag(user_id);
create index idx_note_tag_tag on public.note_tag(tag_id);

-- RLS
alter table public.note enable row level security;
alter table public.tag enable row level security;
alter table public.note_tag enable row level security;

-- RLS Policies
create policy user_owns_note on public.note
  for all using (auth.uid() = user_id);

create policy user_owns_tag on public.tag
  for all using (auth.uid() = user_id);

create policy user_owns_note_tag on public.note_tag
  for all using (
    exists (
      select 1 from public.note
      where id = note_id and user_id = auth.uid()
    )
  );

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_note_updated_at
  before update on public.note
  for each row execute function public.set_updated_at();
