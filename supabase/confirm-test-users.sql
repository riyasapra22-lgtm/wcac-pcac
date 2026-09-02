-- One-off: manually confirm the test accounts created during development,
-- bypassing the email confirmation flow (useful while the project's
-- "Confirm email" toggle is being sorted out, or free-tier email rate limits are hit).
update auth.users
set email_confirmed_at = now()
where email in ('wcacpcac.reviewer@gmail.com', 'wcacpcac.reviewer2@gmail.com')
  and email_confirmed_at is null;
