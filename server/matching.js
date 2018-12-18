function createMatch() {
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
module.exports.createMatch = createMatch;
module.exports.SendAll = SendAll;