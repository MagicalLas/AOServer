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

CREATE table Games(
    gameid varchar(50) not null,
    start_time DATETIME not null,
    end_time DATETIME not null,
    try1 varchar(50) not null,
    try2 varchar(50) not null,
    try3 varchar(50) not null,
    try4 varchar(50) not null,
    try5 varchar(50) not null,
    try6 varchar(50) not null,
    primary key(gameid),
        FOREIGN KEY(try1)
    REFERENCES Trys(id) ON UPDATE CASCADE,
        FOREIGN KEY(try2)
    REFERENCES Trys(id) ON UPDATE CASCADE,
        FOREIGN KEY(try3)
    REFERENCES Trys(id) ON UPDATE CASCADE,
        FOREIGN KEY(try4)
    REFERENCES Trys(id) ON UPDATE CASCADE,
        FOREIGN KEY(try5)
    REFERENCES Trys(id) ON UPDATE CASCADE,
        FOREIGN KEY(try6)
    REFERENCES Trys(id) ON UPDATE CASCADE
);