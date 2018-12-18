const assert = require('assert');
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
        const name='test_name_1';
        const id='test_id_1';
        const password='test_password_1';
        const point=0;
        const sql = `insert Users values('${id}','${name}','${password}','${point}')`;
        await new Promise((a,b)=>{
            connection.query(sql,(err)=>{
                assert.notEqual(err,true); // not error
                a();
            });
        });
        await new Promise((a,b)=>{
            connection.query(sql,(err)=>{
                assert.notEqual(err,false); // error
                a();
            });
        });

        // 테스트용 유저 정보 삭제
        await new Promise((a,b)=>{
            connection.query('delete from Users where id = test_id_1',(err)=>{
                assert.notEqual(err,true); // not error
                a();
            });
        });
    });

    after(() => {
        connection.destroy();
    });
});