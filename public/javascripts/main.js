require.config({
	baseUrl: 'javascripts',

	shim:{
		'socketio': {
			exports: 'io'
		}
	},

	paths: {
		jquery: 'libs/jquery',
		socketio: '../socket.io/socket.io'
	}

});

require(['GameController', 'SocketHandler']);