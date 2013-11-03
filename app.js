var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	GameStateHandler =  require('./GameStateHandler');

server.listen(1414);

app.use(express.static(__dirname + '/public'));

var gameStateHandler = new GameStateHandler(server);