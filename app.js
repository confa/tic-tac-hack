var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs');

server.listen(1414);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
	socket.on('turn', function (data) {
		console.log(data);
	});
});