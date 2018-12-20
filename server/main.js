const tcp = require('net');
const match = require('./matching');
const hash = require('./database/hash');

const server = tcp.createServer(() => {
    console.log("user connected");
});

let GameRoom = new Array(100);
let Game = match.createMatch();
let userCount = 0;
let gameCount = 0;
server.listen({
    host: 'localhost',
    port: 19182,
    exclusive: true
});

server.on('listening', () => {
    console.log("Server will Started");
});

server.on('connection', (s) => {
    console.log("Socket ip is " + s.address().address);
    Game = Game(s);
    userCount += 1;
    if (userCount == 2) {
        console.log('2명이 들어와서 매칭되었습니다.');
        match.AddOnMessageAll(Game,hash.makeHash('game number'+gameCount));

        GameRoom[gameCount%10] = Game;
        gameCount += 1;
        userCount = 0;
        Game = match.createMatch();
    }
});

server.on('error', (e) => {
    console.log(e);
});