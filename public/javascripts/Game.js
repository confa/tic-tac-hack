define(function(require) {
	'use strict';

	var enums = require('./shared/enums'),
		utils = require('./shared/utils'),
		Field = require('./Field'),
		mediator = require('libs/mediator'),
		$ = require('jquery');

	function Game (options) {
		var self = this,
			isLocal_ = options.isLocal,
			el_ = {};

		el_.gameCells = $('.game-cell');
		el_.gameFields = $('.game-field');
		el_.gameOverLayer = $('#game-over-container');
		el_.rivalName = $('#rival-game-label');
		el_.crossTurnIcon = $('#cross-game-current-turn');
		el_.zeroTurnIcon = $('#zero-game-current-turn');
		el_.body = $('body');

		initializeGame(options);

		el_.gameCells.on('click', onCellClick_);

		this.makeTurn = function (options) {
			var className = options.player === enums.CellStates.Cross ? 'cross-cell' : 'zero-cell';
			
			if (typeof options.cellDiv === 'undefined'){
				options.cellDiv = $('[data-field="{0}"][data-cell="{1}"]'.format(options.field, options.cell));
			}

			$(options.cellDiv)
				.addClass('cell-filled')
				.append('<div class=\"{0}\"></div>'.format(className))
				.off('click');

			el_.gameFields
				.off('click')
				.removeClass('current-field');

			$(".game-field-{0}".format(options.cell)).addClass('current-field');

			self.fieldGrid[options.field].toggleStateByNumber(options.cell, !isLocal_ ? options.player : self.currentPlayer);
			var winner = determineLocalWinner_(options.field);	
			
			switchPlayer();
			self.availableField = options.cell;			

			if (!isLocal_){
				self.turnAllowed = !self.turnAllowed;
			}
		};
		
		if(!isLocal_) {
			initializeSubscriptions();
		}

		function initializeGame(options){
			self.fieldGrid = [];
			self.availableField = undefined;

			for (var i = 0; i <= 8; i++) {
				self.fieldGrid.push(new Field(i));
			}

			self.globalField = new Field(++i);

			self.currentPlayer = options.shape;
			self.turnAllowed = self.currentPlayer === enums.CellStates.Cross;
			if (!isLocal_ && !self.turnAllowed){
				el_.body.toggleClass('turn-not-allowed', true);
			} else {
				el_.body.toggleClass('turn-allowed', true);
			}

			mediator.on('reset-markup', resetMarkup_);
		}

		function switchPlayer() {
			if (isLocal_){
					self.currentPlayer = +!self.currentPlayer;
			} else {
				el_.body.toggleClass('turn-not-allowed');
			}
			el_.crossTurnIcon.toggleClass('active');
			el_.zeroTurnIcon.toggleClass('active');
			el_.body.toggleClass('turn-allowed', false);
		}

		function initializeSubscriptions(){
			mediator.on('socket:turn-network', self.makeTurn);
		}

		function resetMarkup_(){
			el_.rivalName.text('');
			el_.gameCells.removeClass('cell-filled');
			el_.gameFields.removeClass('winner-zero-field winner-cross-field current-field');
			el_.gameCells.find('.cross-cell,.zero-cell').remove();

			var globalCells = $('.global-game-cell');
			globalCells.removeClass('cell-filled');
			globalCells.find('.cross-cell,.zero-cell').remove();
		}

		function onCellClick_(item) {
			if (self.turnAllowed){
				var field = $(item.target).data('field');
				var cell = $(item.target).data('cell');

				if(field !== self.availableField && typeof self.availableField !== 'undefined') 
					return;

				var options = {
					player: self.currentPlayer,
					field: field,
					cell: cell,
					cellDiv: item.target
				};
				if (isLocal_){
					self.makeTurn(options);
				} else {
					mediator.publish('game:turn-local', options);
				}
			}
		}

		function determineLocalWinner_(field) {

			var current = self.fieldGrid[field];
			var winnerResult = current.determineWinner();

			if(typeof winnerResult !== 'undefined') {

				if(current.isWinnerDefined())
					return;

				var currentField = $(".game-field-{0}".format(field));
				var winnerClass = winnerResult.winner === enums.CellStates.Cross ? 'cross' : 'zero';

				currentField.addClass('winner-{0}-field'.format(winnerClass));
				
				$('.global-game-cell[data-field={0}]'.format(field))
							.addClass('cell-filled')
							.append('<div class=\"{0}-cell\"></div>'.format(winnerClass));

				current.setWinnerDefine();

				var winner = winnerResult.winner;
				self.globalField.toggleStateByNumber(field, self.currentPlayer);
				return self.globalField.determineWinner();
			}
		}

	}

	return Game;
});