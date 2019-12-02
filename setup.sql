\c postgres
drop database workshops;

drop user shop1;
create user shop1;

\password shop1

CREATE DATABASE workshops;
\c workshops

CREATE TABLE attendees(
	id serial PRIMARY KEY,
	name text,
	shop text
);

GRANT SELECT, INSERT on attendees to shop1;
GRANT USAGE ON attendees_id_seq to shop1;


