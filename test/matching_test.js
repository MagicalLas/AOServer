const assert = require('assert');
const match = require('../server/matching')
describe('매칭 시스템', function() {
    it('매칭 방 만들기',()=>{
        var room = match.createMatch();
    });
    it('방에 소켓 넣기',()=>{
        var room = match.createMatch();
        room = room('socket1');
        room = room('socket2');
        room = room('socket3');
        room = room('socket4')('socket5')('socket6');
        assert.equal(room[1],'socket2');
        assert.notEqual(room[3],'socket2');
    });
    it('소켓들에게 데이터 보내기',()=>{
        var room = match.createMatch();
        const socket1 = {write:(data)=>{}}
        room = room(socket1)(socket1)(socket1)(socket1)(socket1)(socket1);
        const sender = match.SendAll(room);
        sender('Data');
    })
});