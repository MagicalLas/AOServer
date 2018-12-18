CREATE database Heroes;
USE Heroes;
CREATE table Users(
    id varchar(20) not null,
    name varchar(10) not null,
    password varchar(50) not null,
    point int,
    primary key(id)
);