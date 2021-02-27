### db

docker run --name main-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD="qx*70LF9h6Leh5#nr6D5i" -d mysql
docker exec -it a sh
mysql -u root -p
create database briochefood_db;
create user 'briochefood_api'@'%' identified by 'Wy1v@Dg20CIfQS';
grant CREATE, DELETE, INSERT, SELECT, UPDATE, ALTER, REFERENCES on briochefood_db.* to 'briochefood_api'@'%';
show grants for 'briochefood_api'@'%';
