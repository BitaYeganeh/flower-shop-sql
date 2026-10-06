-- Creates the database and the app's user. Run as an admin user, e.g.:
--   mariadb -u root -p < database/create-database.sql
-- WARNING: this deletes an existing kukkakauppa database.

drop database if exists kukkakauppa;
create database kukkakauppa;
create database if not exists kukkakauppa_test;  -- used by the automated tests

drop user if exists 'kauppias'@'localhost';
create user 'kauppias'@'localhost' identified by '1234';  -- local practice password only
grant all privileges on kukkakauppa.* to 'kauppias'@'localhost';
grant all privileges on kukkakauppa_test.* to 'kauppias'@'localhost';
