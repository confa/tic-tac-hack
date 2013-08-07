define(function(require){
	'use strict';

	var mediator = require('libs/mediator'),
		_ = require('underscore');

	function GamesList () {
		var self = this;
		this.list = [];

		var el_ = {};
		el_.joinButtons = $('.join-button');
		el_.joinButtons.on('click', onJoin_);
		mediator.on('socket:games-list', onGamesList_);
		mediator.on('socket:games-add', onGameAdd_);

		function onJoin_(){
			/*jshint validthis:true */
			var container = $(this);
			var id = container.data('id');
			if (typeof id !== 'undefined'){

			}
		}

		function onGamesList_(list){
			self.list = list;
		}

		function onGameAdd_(game){
			self.list.push(game);
		}

		function onGameRemove_(game){
			var index = _.indexOf(self.list, game);
			if (index !== -1){
				$('[data-id="' +  index + '"]').remove();
				self.list.splice(index, 1);
			}
		}
	}

	return GamesList;

});