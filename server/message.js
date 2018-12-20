function SocketSend(socket) {
    function Sender(data) {
        socket.write("㏆" + data.length + "®" + data);
        console.log(data);
    };
    return {Sender:Sender};
}

module.exports.SocketSend = SocketSend;