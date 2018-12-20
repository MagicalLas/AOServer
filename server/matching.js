const message = require('./message');

function createMatch() {
    console.log('새로운 매칭이 되는 중입니다.');
    return socket1 =>
    socket2 =>
    [socket1,socket2];
}

function _createMatch() {
    return socket1 =>
    socket2 => 
    socket3 => 
    socket4 => 
    socket5 => 
    socket6 => 
    [socket1,socket2,socket3,socket4,socket5,socket6];
}

function SendAll(socket_array) {
    return (data)=>{
        socket_array.forEach(socket => {
            socket.write(data);
        });
    }
}
var count = 0
var test1 = 0;
var test2 = 0;
function AddOnMessageAll(socket_array,game_id) {
    var gamedata = {
        game_id:game_id,
        user1:{
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

    const Message1 = message.SocketSend(socket_array[0]);
    const Message2 = message.SocketSend(socket_array[1]);
    const c = count;

    socket_array[0].on("data", (data1) => {
        gamedata.user1.x += 1;
        gamedata.user1.y += 0.2;
        const data = JSON.stringify(gamedata);
        console.log(c +"번째 방 1번 소켓    :   "+"㏆" + data.length + "®" + data);
        Message1.Sender(data)
    });
    
    socket_array[1].on("data", (data2) => {
        const data = JSON.stringify(gamedata);
        console.log(c +"번째 방 2번 소켓    :   "+"㏆" + data.length + "®" + data);
        Message2.Sender(data)
    });
    socket_array.forEach(element => {
        element.on('error',()=>{
            console.log('socker out');
        });
    });
    count += 1;
}

function _AddOnMessageAll(socket_array) {
    socket_array[0].on("data",(data1)=>{
        socket_array[1].on("data",(data2)=>{
            socket_array[2].on("data",(data3)=>{
                socket_array[3].on("data",(data4)=>{
                    socket_array[4].on("data",(data5)=>{
                        socket_array[5].on("data",(data6)=>{
                            SendAll(socket_array,data1+data2+data3+data4+data5+data6);
                        });
                    });
                });
            });
        });
    });
}
module.exports.createMatch = createMatch;
module.exports.SendAll = SendAll;
module.exports.AddOnMessageAll = AddOnMessageAll;