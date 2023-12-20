CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION citext;
CREATE SCHEMA users;

CREATE TABLE users.user_data(
   id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   uuid TEXT NOT NULL DEFAULT uuid_generate_v4(),
   first_name TEXT NOT NULL ,
   last_name TEXT NOT NULL ,
   email TEXT NOT NULL UNIQUE,
   mobile TEXT NOT NULL UNIQUE,
   salted_password TEXT NOT NULL,
   address TEXT,
   profession TEXT,
   user_role TEXT NOT NULL DEFAULT 'user',
   created_time TIMESTAMP NOT NULL DEFAULT TIMEZONE('UTC',NOW()),
   edited_time TIMESTAMP
);
