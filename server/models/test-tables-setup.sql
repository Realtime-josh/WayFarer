CREATE DATABASE wayfarer;
\connect wayfarer
DROP TABLE  IF EXISTS  users CASCADE;
\connect wayfarer
CREATE TABLE IF NOT EXISTS users_account
(
   user_id serial PRIMARY KEY,
   user_email text UNIQUE NOT NULL, 
   first_name text NOT NULL,
   last_name text NOT NULL,
   password text NOT NULL,
   is_admin boolean default(false)
);


