alter table public.quiz_sessions
  add column if not exists session_mode text not null default 'practice'
  check (session_mode in ('practice', 'full_exam'));

create or replace function public.get_quiz_data(session_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'session', s,
    'questions', (
      select json_agg(question_row order by question_row.position)
      from (
        select q.*, ordered.position
        from unnest(s.question_ids) with ordinality as ordered(id, position)
        join public.questions q on q.id = ordered.id
      ) as question_row
    ),
    'answers', (
      select json_agg(a)
      from public.quiz_answers a
      where a.quiz_session_id = s.id
    )
  )
  into result
  from public.quiz_sessions s
  where s.id = session_id
    and s.user_id = (select auth.uid());

  return result;
end;
$$;

revoke all on function public.get_quiz_data(uuid) from public, anon;
grant execute on function public.get_quiz_data(uuid) to authenticated;
