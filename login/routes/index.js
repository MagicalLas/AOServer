const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'ika.today',
    port: '4000',
    user: 'root',
    password: 'jin123',
    database: 'Heroes',
});

connection.connect();

router.get('/', function(req,res){
    res.render('basic.pug');
});
router.get('/login', function(req,res){
    res.render('login.pug');
});
router.get('/register', function(req,res){
    res.render('register.pug');
});
router.get('/account_management', function(req,res){
    res.render('account_management.pug');
});
router.get('/id_find', function(req,res){
    res.render('id_find.pug');
});
router.get('/password_find', function(req,res){
    res.render('password_find.pug');
});

router.post('/login', async function(req,res){
    const body = req.body;
    const login_id = body.login_id;
    const login_password = body.login_password;

    await new Promise((a,b)=>{
        connection.query(`select * from Users where id='${login_id}'`,(err,row)=>{
            if( row.length === 0 )
                console.log('없는 아이디 입니다.');
            else if( row[0].password === login_password )
                console.log('로그인 성공!');
            else if( row[0].password !== login_password)
                console.log('비밀번호가 올바르지 않습니다.');
            a();
        });
    });
});

router.post('/register', async function(req,res) {
    const body = req.body;
    const register_id = body.register_id;
    const register_name = body.register_name;
    const register_password = body.register_password;
    const point = 0;
    const sql = `insert into Users values('${register_id}','${register_name}','${register_password}','${point}')`;

    await new Promise((a, b) => {
        connection.query(sql, (err) => {
            if (err) {
            }
            a();
        });
    });
});

module.exports = router;