define(function(require){
	'use strict';

	var mediator = require('libs/mediator'),
		$ = require('jquery'),
		_ = require('underscore'),
		utils = require('shared/utils');

	function GamesList () {
		var self = this;
		this.list = [];
		
		var el_ = {};
		el_.gamesList = $('#games-list');
		el_.gameTemplate = $('#game-in-list-template');

		bindListeners_();

		var templateCompiled = _.template(el_.gameTemplate.html());
		var list = $('.game-list-wait-time');

		var interval = setInterval(function () {
			_.each(list, function (it) {
				var item = $(it);
				var seconds = item.data('time');
				item.data('time', ++seconds);
				var minutes = utils.prependZero(Math.floor(seconds / 60), 2);
				var hours = utils.prependZero(Math.floor(minutes / 60), 2);

				seconds %= 60;
				seconds = utils.prependZero(seconds, 2);

				minutes %= 60;
				minutes = utils.prependZero(minutes, 2);

				item.text(hours + ':' + minutes + ':' + seconds);
			});
		}, 1000);

		$(document).on('click', '.join-button', onJoin_);
		mediator.on('socket:games-list', onGamesList_);
		mediator.on('socket:game-added', onGameAdd_);
		mediator.on('socket:game-removed', onGameRemoved_);

		function onJoin_(){
			/*jshint validthis:true */
			var container = $(this);
			var id = container.data('id');
			if (typeof id !== 'undefined'){
				mediator.publish('game-list:join', { id: id, name: self.playerName});
			}
		}

		function onGamesList_(list){
			_.each(list, function(it, idx){
				onGameAdd_(it);
			});
		}

		function onGameAdd_(game){
			self.list.push(game);
			game.waitTime =  Math.floor(((new Date()).valueOf() - (new Date(game.timestamp)).valueOf()) / 1000);
			var html = templateCompiled(game);
			el_.gamesList.append(html);
			list = $('.game-list-wait-time');
		}

		function onGameRemoved_(game){
			var index = _.findWhere(self.list, {id: game.id});
			if (typeof index !== 'undefined'){
				index = index.id;
				$('.join-button[data-id="' +  index + '"]').parent().remove();
				self.list.splice(index, 1);
			}
		}

		function bindListeners_(){
			mediator.on('game=-controller:player1', function(name){
				self.playerName = name;
			});
		}
	}

	return new GamesList();

});