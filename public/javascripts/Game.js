define(function(require) {
	'use strict';

	var socketHandler = require('./SocketHandler'),
		enums = require('./shared/enums'),
		Field = require('./Field'),
		GameController = require('./GameController'),
		$ = require('jquery');

	function Game (options) {
		this.gameController = new GameController(); 
		var self = this;

		var el_ = {};
		el_.gameCells = $('.game-cell');
		el_.gameFields = $('.game-field');
		el_.newGameButton = $('#new-game-button');

		initializeGame();

		el_.gameCells.on('click', onCellClick_);
		el_.newGameButton.on('click', newGame_);

		function initializeGame(){
			self.globalField = [];	
			self.availableField = undefined;

			for (var i = 0; i <= 8; i++) {
				self.globalField.push(new Field(i));
			}
		}

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

			el_.gameFields
				.off('click')
				.removeClass('current-field');

			$(".game-field-" + cell).addClass('current-field');
			self.globalField[field].toggleStateByNumber(cell, self.gameController.currentPlayer);
		}

		function determineLocalWinner_(field) {

			var winnerResult = self.globalField[field].determineWinner();

			if(typeof winnerResult !== 'undefined') {
				var currentField = $(".game-field-" + field);
				var winnerClass = winnerResult.winner === enums.CellStates.Cross ? 'cross' : 'zero';

				currentField.addClass('winner-' + winnerClass + '-field');
				
				$('.global-game-cell[data-cell=' + field + ']')
							.addClass('cell-filled')
							.append('<div class=\"'+winnerClass+'-cell\"></div>');
			}
		}

		function newGame_(){
			if (self.gameController.getState()){
				initializeGame();
				revertChanges();
			}
		}

		function revertChanges(){
			el_.gameFields
						.removeClass('current-field')
						.removeClass('winner-zero-field')
						.removeClass('winner-cross-field');
			el_.gameCells.each(function(idx, it){
				$(it).attr('class', 'game-cell');
				$(it).empty();
			});
		}
	}

	return new Game();
});