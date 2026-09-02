-- One-off migration: repoint posts.user_id / responses.user_id from auth.users
-- to profiles, so PostgREST can embed `profiles` when querying posts/responses.
-- Safe to run even though posts/responses already have rows, since every
-- existing user_id already has a matching profiles row (created by the
-- handle_new_user trigger on signup).

alter table posts drop constraint if exists posts_user_id_fkey;
alter table posts
  add constraint posts_user_id_fkey
  foreign key (user_id) references profiles(id) on delete cascade;

alter table responses drop constraint if exists responses_user_id_fkey;
alter table responses
  add constraint responses_user_id_fkey
  foreign key (user_id) references profiles(id) on delete cascade;
