-- Add position column for drag-and-drop reordering
alter table public.note add column if not exists position int not null default 0;

-- Create a trigger function to auto-set position on insert
create or replace function public.set_note_position()
returns trigger as $$
begin
  if new.position = 0 then
    select coalesce(max(position), 0) + 1 into new.position
    from public.note
    where user_id = new.user_id and note_date = new.note_date;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_note_position on public.note;
create trigger trg_note_position
  before insert on public.note
  for each row execute function public.set_note_position();
