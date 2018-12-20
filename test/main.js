function Rsocket(socket, socket_id) {
    const id = socket_id;
    function Send(data) {
        const json_string = JSON.stringify(data);
        socket.write("㏆" + json_string.length + "®" + json_string);
    }
    function Raw_send(data) {
        socket.write("㏆" + data.length + "®" + data);
    }
    function Is_same(rsocket) {
        return socket.id == id;
    }
    return {
        Send:Send,
        socket:socket,
        Raw_send:Raw_send,
        id:id
    };
}

function Game() {
    var Rsockets = new Array();
    function Add_socket(rsocket) {
        Rsockets.push(rsocket);
    }
    function Send_all(rsocket,data) {
        Rsockets.forEach(lsocket => {
            if(lsocket.id==rsocket.id) {

            }
            else{
                lsocket.Send(data);
            }
        });
    }
    function Raw_send_all(rsocket,data) {
        Rsockets.forEach(lsocket => {
            if(lsocket.id==rsocket.id) {

            }
            else{
                console.log('moving');
                lsocket.Raw_send(data);
            }
        });
    }
    return {
        Add_socket:Add_socket,
        Raw_send_all:Raw_send_all,
        Send_all:Send_all
    };
}

const tcp = require('net');

const server = tcp.createServer(() => {
    console.log("서버 생성");
});
server.listen({
    host: '198.13.36.114',
    port: 19182,
    exclusive: true
});

server.on('listening', () => {
    console.log("서버 리스닝 시작");
});




var user_count=0;
var game = Game();

server.on('connection',(socket)=>{
    console.log('유저 접속');
    const rsocket = Rsocket(socket,user_count);
    game.Add_socket(rsocket);
    socket.on('data',(data)=>{
        const list = data.toString().split('#');
        const one = JSON.parse(list[0]);
        if(one.id==0){
            rsocket.Send(one);
        }
        if(one.id==1){
            const moving_data = process_moving_data(data);
            game.Raw_send_all(rsocket,moving_data);
        }
    });
    socket.on('connect',()=>{
        console.log('소켓 연결되었습니다.');
    });
    socket.on('end',()=>{
        console.log('소켓 끝났습니다.');
    });
    socket.on('error',()=>{
        console.log('소켓에서 에러가 발생했습니다.');
    });
    socket.on('timeout',()=>{
        console.log('소켓과 연결이 되지 않습니다.');
    });
});

function process_moving_data(json) {
    var jsondata = JSON.stringify({ user_id: json.user_id, x: json.x, y: json.y, z: json.z, type: json.type });
    var result = JSON.stringify({ id: json.id, msg: jsondata });
    return result;
}