CREATE database Heroes;
USE Heroes;
CREATE table Users(
    id varchar(20) not null,
    name varchar(10) not null,
    password varchar(50) not null,
    point int,
    primary key(id)
);

CREATE table Trys(
    id varchar(50) not null,
    userid varchar(20) not null,
    champ varchar(15) not null,
    win int not null,
    team varchar(5) not null,
    game_id varchar(50) not null,
    primary key(id),
    FOREIGN KEY(userid)
    REFERENCES Users(id) ON UPDATE CASCADE
);
