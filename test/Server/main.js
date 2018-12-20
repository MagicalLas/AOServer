/** INFORMATION --
Networking with Node.js (BASED GMSIO)
Author: yuto
(C) YUTO SOFT, 2018
*/

//{ //Basic setting
	//{ //Setup server information
		var tcp_port = 19184; //TCP port
		var ip = '198.13.36.114'; //IP address
	//}
	//{ //Import classes
		var User = require('./classes/user.js');
		var UserBox = require('./classes/user_box.js');
		var Colors = require('colors');
		var mysql = require('mysql');
		var async = require('async');
		var isUndefined = require("is-undefined");
	//}
	//{ //Set console colors
		Colors.setTheme({
			asome:'rainbow',
			input:'gray',
			verbose:'cyan',
			prompt:'gray',
			info:'green',
			data: 'gray',
			help:'cyan',
			warn:'yellow',
			debug: 'blue',
			error: 'red'
		});
	//}
	//{ //Set variables


	//}
	//{ //Runtime tables
		var authenticated_users = UserBox.create();
	//}
//}
//{ Signal setting
	//Client-bound signal IDs
	const outsig_login_refused = 0;
	const outsig_login_accepted = 1;
	const outsig_ping = 2;
	const outsig_get_item = 3;
	const outsig_get_info = 4;
	const outsig_logins = 5;
	const outsig_register = 6;
	const outsig_mine = 7;

	//Server-bound signal IDs
	const insig_login = 0;
	const insig_ping = 1;
	const insig_request_item = 2;
	const insig_request_info = 3;
	const insig_logins = 4;
	const insig_register = 5;
	const insig_mine = 6;
//}
//{ //Server information
	console.log("Networking with Node.js".data);
	console.log(" - Node.js Server".data, "version 1.0");
//}
//{ //Server run
	var server = require('./classes/server.js').createServer();
//}
//{ //Send message
	function send_id_message(sock, id, msg) {
	const json_string = JSON.stringify({
		id: id,
		msg: msg
	});
	
	sock.send("㏆" + json_string.length + "®" + json_string);
}
//}

//{ //Server event - step
	! function step() {
		//Send all
		//authenticated_users.each(function(user) {
			//send_id_message(user.socket, [OUTSIG], [MSG]);
		//});
		
		//While
		setTimeout(function() {
			step();
		}, 14);
	}()
//}

var connection = mysql.createConnection({
	insecureAuth: true,
	host: '45.76.222.210',
	port: '9099',
	user: 'root',
	password: 'des123',
	database: 'gsmarket'
});
connection.connect();


//{ //Message processing
	server.onConnection(function(dsocket) {
		// When get the messages
		dsocket.onMessage(function(data) {
			
			var temp_buffer = "";
			var buffer_string = "";
			var buffer_reading_string = "";
			var i = 0;

			try{
				//Set the operation
				buffer_string = data.toString();
				buffer_reading_string = temp_buffer + buffer_reading_string;
				temp_buffer = "";
				
				for(i = 0; i < buffer_string.length; i++)
				{
					if(buffer_string.charAt(i) != "#")
					{
						buffer_reading_string += buffer_string.charAt(i);
						if(buffer_string.length-1 == i)
						{
							temp_buffer += buffer_reading_string;
						}
					}

					if(buffer_string.charAt(i) == "#")
					{
						string_process(buffer_reading_string,dsocket,authenticated_users);
						buffer_reading_string = "";
					}
					
				}
			} catch(e){
				temp_buffer = "";
				buffer_reading_string = "";
				console.log("Error processing message :".error, e);
			}
		});
		// When client disconnect
		dsocket.onClose(function() {
		//Respond for authenticated users only
		var quitter;
		if ((quitter = authenticated_users.findUserBySocket(dsocket)) != null) {
			console.log("Removing user   :".data, quitter.name, "(" + quitter.uuid + ")");
			//Let everyone else know the user is leaving
			var logout_announcement = JSON.stringify({
				name: quitter.name,
				uuid: quitter.uuid
			});
			authenticated_users.each(function(user) {
				if (user.uuid != quitter.uuid) {
					send_id_message(user.socket, outsig_user_leave, logout_announcement);
				}
			});
			//Remove the user
			authenticated_users.removeUser(quitter.uuid);
		}
	});
});
//}
//{ //Boot the server
	server.listen(tcp_port, ip);
//}


function string_process(buffer_string,dsocket,authenticated_users) {
	//Parse incoming JSON
	var json_data = JSON.parse(buffer_string);
	var id = json_data.id;
	var msg = json_data.msg;
	//console.log("Message :".data + buffer_reading_string);
	//Route into different functions
//	Process(id,json_data,msg,dsocket,authenticated_users);
	if(id==0){
		send_id_message(dsocket,1,msg);
	}
}

function Process(id,json_data,msg,dsocket,authenticated_users) {
	switch (id) {
		//Ping
		case insig_ping:
			send_id_message(dsocket, outsig_ping, msg);
		break;

		//Sign-in request
		case insig_login:
			insig_login_(authenticated_users,dsocket,msg,outsig_login_refused,outsig_login_accepted);
		break;
		
		case insig_request_item:
			insig_request_item_(authenticated_users, dsocket, outsig_get_item);	
		break;
		
		case insig_request_info:
			insig_request_info_(authenticated_users,dsocket, msg, outsig_get_info);
		break;
		
		case insig_logins:
			insig_logins_(authenticated_users,json_data,dsocket,outsig_logins);
		break;
		
		case insig_register:
		insig_register_(authenticated_users,dsocket,json_data,outsig_register);
		break;

		case insig_mine:
			insig_mine_(authenticated_users, dsocket, msg, outsig_mine);
		break;
		// --

		//Invalid message ID
		default:
			console.log("Invaild ID".error);
			break;
	}
}

function insig_request_info_(user, dsocket, message, info) {
	var from_user;
	if ((from_user = user.findUserBySocket(dsocket)) != null) {
		// 데이터베이스에 접근
		const sql = 'select * from item where name ="' + message + '"';
		connection.query(sql, function (error, results) {
			if (error) {
				console.log("쿼리문을 정상적으로 처리하지 못했습니다");
			} else {

				if (!(isUndefined(results[0]))) {
					const result = results[0];
					const inmsg = result.interduce;
					const image = results[0].image;
					const file = results[0].file;
					const developer = results[0].developer;
					const messages = JSON.stringify({
						text: inmsg,
						developer: developer,
						img: image,
						zip: file
					});
					send_id_message(from_user.socket, info, messages);
				}
			}
		});
	}
};
function insig_login_(users, dsocket, message, refused, accepted) {
	//Unauthenticated users only
	if (users.findUserBySocket(dsocket) == null) {
		//Name already taken
		if (users.findUserByName(message) != null) {
			send_id_message(dsocket, refused, "");
		}
		//Name OK
		else {
			const new_user = User.create(message, 0, dsocket);
			users.addUser(new_user);
			console.log("New user joined :".data, new_user.name, "(" + new_user.uuid + ")");
			//Tell user to come in
			const new_user_announcement = JSON.stringify({
				name: new_user.name,
				uuid: new_user.uuid
			});
			send_id_message(dsocket, accepted, new_user_announcement);
		}
	}
};

function insig_mine_(user, dsocket, message, outsig_mine) {
	var from_user;
	if ((from_user = user.findUserBySocket(dsocket)) != null) {
		// 데이터베이스에 접근
		console.log(message);
		const sql = 'select * from item where developer ="' + message + '"';
		connection.query(sql, function (error, results) {
			if (error) {
				console.log("쿼리문을 정상적으로 처리하지 못했습니다");
			} else {

				var name = "";

				for (var i = 0; i < results.length; i++) {
					name += results[i].name
					if (i != results.length - 1)
						name += "/";
				}

				const messages = JSON.stringify({
					name: name
				});

				send_id_message(from_user.socket, outsig_mine, messages);
			}
		});
	}

};

function insig_logins_(user, json_data, dsocket, outsig_logins) {

	var from_user;
	var name = "";
	if ((from_user = user.findUserBySocket(dsocket)) != null) {
		const sql = 'select * from user where id ="' + json_data._id + '"';
		connection.query(sql, function (error, results) {

			if (error) {
				console.log("쿼리문을 정상적으로 처리하지 못했습니다");
			} else {

				var temp;
				if (!(isUndefined(results[0]))) {
					if (json_data._pass == results[0].pass) {
						// sucess
						temp = 1;
						name = results[0].name;
					} else {
						//fail
						temp = 0;
					}
				} else {
					temp = 0;
				}

				const messages = JSON.stringify({
					trigger: temp,
					name: name
				});
				send_id_message(from_user.socket, outsig_logins, messages);
			}
		});
	}
};

function insig_request_item_(user, dsocket, outsig_get_item) {
	var from_user;
	var lists = "";
	if ((from_user = user.findUserBySocket(dsocket)) != null) {
		connection.query("select * from item", function (error, results) {
			if (error) {
				console.log("쿼리문을 정상적으로 처리하지 못했습니다");
			} else {

				for (var i = 0; i < results.length; i++) {
					lists += results[i].name;
					//console.log(lists);	
					//console.log(results[i].name); // 값
					if (i + 1 != results.length) {
						lists += "/";
					}
				}
				var messages = JSON.stringify({
					msg: lists
				});
				send_id_message(from_user.socket, outsig_get_item, messages);
			}
		});
	}
};
function insig_register_(authenticated_users, dsocket, json_data, outsig_register) {
	var from_user;
	if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {
		var sql = 'insert into user(id, pass, name) values("' + json_data._id + '", "' + json_data._pass + '" ,"' + json_data._name + '")';
		connection.query(sql, function (error) {
			if (error) {
				console.log("쿼리문을 정상적으로 처리하지 못했습니다_" + error);
				const messages = JSON.stringify({
					trigger: 0
				});
				send_id_message(from_user.socket, outsig_register, messages);
			} else {
				const messages = JSON.stringify({
					trigger: 1
				});
				send_id_message(from_user.socket, outsig_register, messages);
			}
		});
	}

}