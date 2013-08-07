define(function(require){
	'use strict';

	var mediator = require('libs/mediator'),
		$ = require('jquery'),
		_ = require('underscore');

	function GamesList () {
		var self = this;
		this.list = [];
		
		var el_ = {};
		el_.gamesList = $('#games-list');
		el_.gameTemplate = $('#game-in-list-template');

		var templateCompiled = _.template(el_.gameTemplate.html());

		$(document).on('click', '.join-button', onJoin_);
		mediator.on('socket:games-list', onGamesList_);
		mediator.on('socket:games-added', onGameAdd_);

		function onJoin_(){
			/*jshint validthis:true */
			var container = $(this);
			var id = container.data('id');
			if (typeof id !== 'undefined'){

			}
		}

		function onGamesList_(list){
			_.each(list, function(it, idx){
				onGameAdd_(it);
			});
		}

		function onGameAdd_(game){
			self.list.push(game);
			var html = templateCompiled(game);
			el_.gamesList.append(html);
		}

		function onGameRemove_(game){
			var index = _.indexOf(self.list, game);
			if (index !== -1){
				$('[data-id="' +  index + '"]').remove();
				self.list.splice(index, 1);
			}
		}
	}

	return new GamesList();

});