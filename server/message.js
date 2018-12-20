function SocketSend(socket) {
    function Sender(data) {
        socket.write("㏆" + data.length + "®" + data);
    };
    return {Sender:Sender};
}

module.exports.SocketSend = SocketSend;