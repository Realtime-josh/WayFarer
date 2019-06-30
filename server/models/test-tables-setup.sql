\connect wayfarer
CREATE TABLE IF NOT EXISTS USER
 (
   user_id serial PRIMARY KEY,
   user_email text UNIQUE NOT NULL, 
   user_email text NOT NULL,
   first_name text NOT NULL,
   last_name text NOT NULL,
   password text NOT NULL,
   is_admin boolean DEFAULT false,
);


