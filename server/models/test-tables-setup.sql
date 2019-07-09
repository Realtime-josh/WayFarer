CREATE DATABASE wayfarer;
\connect wayfarer
DROP TABLE  IF EXISTS  users CASCADE;
\connect wayfarer
CREATE TABLE IF NOT EXISTS users
(
   user_id serial PRIMARY KEY,
   user_email text UNIQUE NOT NULL, 
   first_name text NOT NULL,
   last_name text NOT NULL,
   password text NOT NULL,
   is_admin boolean default(false)
);

DROP TABLE IF EXISTS  buses CASCADE;

CREATE TABLE IF NOT EXISTS buses
 (
    bus_id serial NOT NULL PRIMARY KEY,
    number_plate text UNIQUE NOT NULL,
    manufacturer text NOT NULL,
    model text NOT NULL,
    year text NOT NULL,
    capacity integer NOT NULL
 );

 DROP TABLE IF EXISTS  trips CASCADE;
 
 CREATE TABLE IF NOT EXISTS trips
 (
 	 trip_id serial NOT NULL PRIMARY KEY,
    bus_id integer NOT NULL REFERENCES buses(bus_id),
    origin text NOT NULL,
    destination text NOT NULL,
    trip_date text NOT NULL,
    trip_time text NOT NULL,
    fare bigint NOT NULL,
    status boolean NOT NULL DEFAULT true
 );

DROP TABLE IF EXISTS  bookings CASCADE;

CREATE TABLE IF NOT EXISTS bookings
 (
    booking_id serial NOT NULL PRIMARY KEY,
    trip_id integer NOT NULL REFERENCES trips(trip_id),
    user_id integer NOT NULL,
    created_on text NOT NULL,
    seat_number integer NOT NULL 
 );

INSERT INTO buses(bus_id,number_plate,manufacturer,model,year,capacity)
VALUES(1,'XQZ2013A','TOYOTA','CAMRY520',1991,3000);
 
INSERT INTO buses(bus_id,number_plate,manufacturer,model,year,capacity)
VALUES(2,'Q28HHZK','MERCEDEZ_BENZ','BENZ520',1994,3000);

INSERT INTO buses(bus_id,number_plate,manufacturer,model,year,capacity)
VALUES(3,'KH40834','BMW','BMW840',2008,8000);

INSERT INTO buses(bus_id,number_plate,manufacturer,model,year,capacity)
VALUES(4,'V2089TB','MAZDA','M440',2009,6000);

INSERT INTO buses(bus_id,number_plate,manufacturer,model,year,capacity)
VALUES(5,'KSQST5Q','VOLVO','S40',2000,6500);
