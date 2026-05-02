-- Function
create or replace function fn_set_video_completed()
returns trigger as $$
begin
  if new.video_url is not null and new.video_url <> '' then
    new.status := 'completed';
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger
drop trigger if exists trg_set_video_completed on video_requests;

create trigger trg_set_video_completed
before update on video_requests
for each row
execute function fn_set_video_completed();