define(function(require) {
	'use strict';

	var socketHandler = require('./SocketHandler'),
		enums = require('./shared/enums'),
		Field = require('./Field'),
		GameController = require('./GameController'),
		$ = require('jquery');

	function Game (options) {
		this.globalField = [];	
		this.availableField = undefined;
		this.gameController = new GameController(); 
		var self = this;

		var gameCells = $('.game-cell');
		var gameFields = $('.game-field');

		for (var i = 0; i <= 8; i++) {
			this.globalField.push(new Field(i));
		}

		gameCells.on('click', onCellClick_);

		function onCellClick_(item) {
			var field = $(item.target).data('field');
			var cell = $(item.target).data('cell');

			if(field !== self.availableField && typeof self.availableField !== 'undefined') 
				return;

			//console.log('field: ' + field + '; cell: ' + cell);
			
			makeTurn_(item.target, field, cell);
			determineLocalWinner_(field);			
			self.gameController.switchPlayer();

			self.availableField = cell;
		}

		function makeTurn_(cellDiv, field, cell) {
			var className = self.gameController.currentPlayer === enums.CellStates.Cross ? 'cross-cell' : 'zero-cell';
			
			$(cellDiv)
				.addClass('cell-filled')
				.append('<div class=\"'+className+'\"></div>')
				.off('click');

			gameFields
				.off('click')
				.removeClass('current-field');

			$(".game-field-" + cell).addClass('current-field');
			self.globalField[field].toggleStateByNumber(cell, self.gameController.currentPlayer);
		}

		function determineLocalWinner_(field) {

			var winnerResult = self.globalField[field].determineWinner();

			if(typeof winnerResult !== 'undefined') {
				var currentField = $(".game-field-" + field);
				var winnerClass = winnerResult.winner === enums.CellStates.Cross ? 'cross-field' : 'zero-field';

				currentField.addClass('winner-' + winnerClass);		
			}
		}

	}

	return new Game();
});