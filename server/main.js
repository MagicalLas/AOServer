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

var user_position = new Array();

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
!function step(){
    if(user_position.length == 0){
    }
    else{
        const commit = user_position.shift();
        
        commit.array.forEach(x=>{x.sender.Sender(commit.data);});
    }
}()
server.on('connection', (s) => {
    console.log("Socket ip is " + s.address().address);
    const so = message.SocketSend(s);
    game.push({sender:so,id:userCount});
    game.forEach(x=>console.log(x.id));
    const cc = userCount;
    userCount += 1;
    s.on('data', (data) => {
        const list = data.toString().split('#');
        for (let ii = 0; ii < list.length-1; ii++) {
            try {
                const json = JSON.parse(list[ii]);
                if (json.id == 0) {
                    const jsondata = JSON.stringify(json);
                    so.Sender(jsondata);
                
                }
                if (json.id == 1) {
                    var user = json.user_id;
                    var jsondata = JSON.stringify({ user_id: user, x: json.x, y: json.y, z: json.z, type: json.type });
                    var result = JSON.stringify({id:json.id ,msg: jsondata });
                    user_position.push({data:result,array:game.filter(x=>(x.id!==cc))});
                }
            } catch (error) {
                console.log('입력 데이터가 json이 아닙니다.'+error);
            }   
        }
    });
    s.on('error',()=>{
        game = game.filter(x=>x.id!==cc);
        console.log(cc+"번째 소켓이 뒤졌습니다. 다행이 잘 초리 했을꺼에요");
    });
    s.on('close',()=>{
        game = game.filter(x=>x.id!==cc);
        console.log(cc+"번째 소켓이 닫혔습니다. 다행이 잘 초리 했을꺼에요");
    });
    s.on('end',()=>{
        game = game.filter(x=>x.id!==cc);
        console.log(cc+"번째 소켓이 끝났습니다. 다행이 잘 초리 했을꺼에요");
    });
    /*
    Game = Game(s);
    Game = match.createMatch();
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