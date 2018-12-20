const tcp = require('net');
const match = require('./matching');
const hash = require('./database/hash');
const message = require('./message');

const server = tcp.createServer(() => {
    console.log("user connected");
});

let GameRoom = new Array(100);
let Game = match.createMatch();
let userCount = 0;
let gameCount = 0;
server.listen({
    host: '198.13.36.114',
    port: 19182,
    exclusive: true
});

server.on('listening', () => {
    console.log("Server will Started");
});

var gamedata = {
    game_id:game_id,
    name:{
        name:"player1",
        x:0,
        y:0
    },
    user2:{
        name:"player2",
        x:0,
        y:0
    }
};
server.on('connection', (s) => {
    console.log("Socket ip is " + s.address().address);
    Game = Game(s);
    const so = message.SocketSend(s);
    const data = JSON.stringify(gamedata);
    so.Sender(data);
    userCount += 1;
    Game = match.createMatch();
    /*
    if (userCount == 2) {
        console.log('2명이 들어와서 매칭되었습니다.');
        match.AddOnMessageAll(Game,hash.makeHash('game number'+gameCount));

        GameRoom[gameCount%10] = Game;
        gameCount += 1;
        userCount = 0;
    }
    */
});

server.on('error', (e) => {
    console.log(e);
});