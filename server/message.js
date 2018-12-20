function SocketSend(socket) {
    function Sender(data) {
        socket.write("㏆" + data.length + "®" + data);
        socket.push();
    };
    return {Sender:Sender};
}

module.exports.SocketSend = SocketSend;