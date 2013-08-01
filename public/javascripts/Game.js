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
		el_.gameOverLayer = $('#game-over-container');

		initializeGame();

		el_.gameCells.on('click', onCellClick_);
		el_.newGameButton.on('click', newGame_);

		function initializeGame(){
			self.fieldGrid = [];
			self.availableField = undefined;

			for (var i = 0; i <= 8; i++) {
				self.fieldGrid.push(new Field(i));
			}

			self.globalField = new Field(++i);
		}

		function onCellClick_(item) {
			var field = $(item.target).data('field');
			var cell = $(item.target).data('cell');

			if(field !== self.availableField && typeof self.availableField !== 'undefined') 
				return;

			//console.log('field: ' + field + '; cell: ' + cell);
			
			makeTurn_(item.target, field, cell);
			var winner = determineLocalWinner_(field);	

			if(typeof winner !== 'undefined') {
				this.gameOver = true;
				el_.gameOverLayer.show();
			}

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
			self.fieldGrid[field].toggleStateByNumber(cell, self.gameController.currentPlayer);
		}

		function determineLocalWinner_(field) {

			var current = self.fieldGrid[field];
			var winnerResult = current.determineWinner();

			if(typeof winnerResult !== 'undefined') {

				if(current.isWinnerDefined())
					return;

				var currentField = $(".game-field-" + field);
				var winnerClass = winnerResult.winner === enums.CellStates.Cross ? 'cross' : 'zero';

				currentField.addClass('winner-' + winnerClass + '-field');
				
				$('.global-game-cell[data-cell=' + field + ']')
							.addClass('cell-filled')
							.append('<div class=\"'+winnerClass+'-cell\"></div>');

				current.setWinnerDefine();

				var winner = winnerResult.winner;
				self.globalField.toggleStateByNumber(field, self.gameController.currentPlayer);
				return self.globalField.determineWinner();
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
			el_.gameOverLayer.hide();
		}
	}

	return new Game();
});