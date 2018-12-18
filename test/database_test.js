const assert = require('assert');
const hash = require('../server/database/hash.js');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'ika.today',
    user: 'root',
    password: 'jin123',
    port: '4000',
    database: 'Heroes',
    insecureAuth: true
});
describe('데이터베이스 테스트', function() {
    
    it('데이터베이스 연결',()=>{
        assert.doesNotThrow(async()=>{
            await new Promise((a,n)=>{
                connection.connect((err)=>{
                    assert.notEqual(err,true);
                    a();
                });
            });
        });
    });

    it('유저 데이터 불러오기',async function(){
        await new Promise((a,b)=>{
            connection.query('select * from Users',(err)=>{
                assert.notEqual(err,true);
                a();
            });
        });
    });

    it('유저 데이터 저장',async function(){
        const name='test_name';
        const id='test_id_1';
        const password=hash.makeHash('my_password');
        const point=0;
        const sql = `insert into Users values('${id}','${name}','${password}','${point}')`;

        await new Promise((a,b)=>{
            connection.query(sql,(err)=>{
                if(err){
                    assert.fail("database insert user err");
                }
                a();
            });
        });

        // 테스트용 유저 정보 삭제
        await new Promise((a,b)=>{
            connection.query('delete from Users where id = "test_id_1"',(err)=>{
                assert.notEqual(err,true); // not error
                a();
            });
        });
        
    });

    after(() => {
        connection.destroy();
    });
});

describe('hash function test', function() {
    describe('hash calc', function() {
        it('해쉬함수는 언제나 다른 값을 내보내야합니다.', function() {
            assert.notEqual(hash.makeHash('a'),hash.makeHash('b'));
            assert.notEqual(hash.makeHash('b'),hash.makeHash('c'));
        });
        it('해쉬함수는 숫자를 받을 수 없습니다.',()=>{
            assert.throws(()=>{
                hash.makeHash(1);
            })
        });
        it('해쉬함수의 입력이 같다면 결과는 같습니다.',()=>{
            assert.equal(hash.makeHash('a'),hash.makeHash('a'));
        });
    });
});