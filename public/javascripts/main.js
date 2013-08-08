require.config({
	baseUrl: 'javascripts',

	shim:{
		'socketio': {
			exports: 'io'
		},
		'underscore': {
			exports: '_',
			init: function(){
				this._.templateSettings = {
					evaluate: /\{\%(.+?)\}\}/g,
					interpolate: /\{\{(.+?)\}\}/g
				};
				return _;
			}
		}
	},

	paths: {
		jquery: 'libs/jquery.min',
		underscore: 'libs/underscore-min',
		socketio: '../socket.io/socket.io',
		flatUi: 'libs/flat-switch'
	}

});

require(['GameController', 'SocketHandler']);