define(function(require) {
	'use strict';

	var SocketHandler = require('./SocketHandler'),
		enums = require('./shared/enums'),
		Field = require('./Field'),
		$ = require('jquery');

	function Game (options) {
		this.socketHandler = new SocketHandler();
		this.globalField = [];	
		this.availableField = undefined;
		var self = this;

		var gameCells = $(".game-cell");
		this.currentPlayer = enums.CellStates.Cross;

		for (var i = 0; i <= 8; i++) {
			this.globalField.push(new Field(i));
		}

		gameCells.on('mouseover', function (item) {
			$(item.target).css('box-shadow', '0 0 15px #767664');
		});

		gameCells.on('mouseout', function (item) {
			$(item.target).css('box-shadow', 'initial');
		});

		gameCells.on('click', function (item) {
			var field = $(item.target).data('field');
			var cell = $(item.target).data('cell');
			//console.log('field: ' + field + '; cell: ' + cell);

			self.globalField[field].toggleStateByNumber(cell, self.currentPlayer);
			self.globalField[field].determineWinner();

			var className = self.currentPlayer === enums.CellStates.Cross ? 'cross'	: 'zero';
			
			$(item.target)
					.append('<div class=\"'+className+'\"></div>')
					.off('click mouseout mouseover');

			if(self.currentPlayer === enums.CellStates.Cross) {
				self.currentPlayer = enums.CellStates.Zero;
			} else {
				self.currentPlayer = enums.CellStates.Cross;
			}
			self.availableField = cell;

			$(".game-field").removeClass('current-cell');
			$(".game-field-" + cell).addClass('current-cell');
		});
	}

	return new Game();
});
	