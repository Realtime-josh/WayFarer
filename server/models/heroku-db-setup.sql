CREATE TABLE IF NOT EXISTS user_account
 (
    user_id serial NOT NULL,
    user_email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password text NOT NULL,
    is_admin boolean DEFAULT false,
    CONSTRAINT user_account_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_account_user_email_key UNIQUE (user_email)
 );

CREATE TABLE IF NOT EXISTS bus_account
 (
    number_plate text NOT NULL,
    manufacturer text NOT NULL,
    model text NOT NULL,
    year text NOT NULL,
    capacity integer NOT NULL,
    bus_id serial NOT NULL,
    CONSTRAINT bus_account_pkey PRIMARY KEY (bus_id),
    CONSTRAINT bus_account_number_plate_key UNIQUE (number_plate)
 );
 
 CREATE TABLE IF NOT EXISTS trip_account
 (
 	trip_id serial NOT NULL,
    bus_id integer NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    trip_date bigint NOT NULL DEFAULT 0,
    fare bigint NOT NULL,
    status boolean NOT NULL DEFAULT true,
    CONSTRAINT trip_account_pkey PRIMARY KEY (trip_id),
    CONSTRAINT trip_account_bus_id_fkey FOREIGN KEY (bus_id)
    REFERENCES bus_account (bus_id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
 );

  CREATE TABLE IF NOT EXISTS booking_account
 (
    booking_id serial NOT NULL,
    trip_id integer NOT NULL,
    user_id integer NOT NULL,
    created_on bigint NOT NULL DEFAULT 0,
    seat_number integer NOT NULL,
    CONSTRAINT booking_account_pkey PRIMARY KEY (booking_id),
    CONSTRAINT booking_account_trip_id_fkey FOREIGN KEY (trip_id)
    REFERENCES trip_account (trip_id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT booking_account_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES user_account (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION  
 );


