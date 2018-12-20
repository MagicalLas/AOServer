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

var game = new Array();


server.on('connection', (s) => {
    console.log("Socket ip is " + s.address().address);
    Game = Game(s);
    const so = message.SocketSend(s);
    game.push({sender:so,id:userCount});
    const cc = userCount;
    userCount += 1;
    s.on('data', (data) => {
        const list = data.toString().split('#');
        console.log(list);
        const json = JSON.parse(list[0]);
        if (json.id == 0) {
            const jsondata = JSON.stringify(json);
            so.Sender(jsondata);
        }
        if (json.id == 1) {
            const user = hash.makeHash(json.user_id);
            const jsondata = JSON.stringify({ user_id: user, x: json.x, y: json.y, z: json.z, type: json.type });
            const result = JSON.stringify({id:json.id ,msg: jsondata });
            game.filter(x=>(x.id!==cc)).forEach(x=>x.sender.Sender(result));
        }
    });
    

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