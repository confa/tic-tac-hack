define(function(require) {
	'use strict';

	var enums = require('./shared/enums'),
		utils = require('./shared/utils'),
		Field = require('./Field'),
		GameController = require('./GameController'),
		mediator = require('libs/mediator'),
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

			var winner = determineLocalWinner_(options.field);	

			if(typeof winner !== 'undefined') {
				//this.gameOver = true;
				el_.gameOverLayer.show();
			}

			self.gameController.switchPlayer();
			self.availableField = options.cell;

			self.fieldGrid[options.field].toggleStateByNumber(options.cell, self.gameController.currentPlayer);
			
			if (!self.gameController.isLocal()){
				self.gameController.turnAllowed = !self.gameController.turnAllowed;
			}
		};

		initializeSubscriptions();

		function initializeGame(){
			self.fieldGrid = [];
			self.availableField = undefined;

			for (var i = 0; i <= 8; i++) {
				self.fieldGrid.push(new Field(i));
			}

			self.globalField = new Field(++i);
		}

		function initializeSubscriptions(){
			mediator.on('turn:network', self.makeTurn);
		}

		function onCellClick_(item) {
			if (self.gameController.turnAllowed){
				var field = $(item.target).data('field');
				var cell = $(item.target).data('cell');

				if(field !== self.availableField && typeof self.availableField !== 'undefined') 
					return;

				//console.log('field: ' + field + '; cell: ' + cell);
				var options = {
					player: self.gameController.currentPlayer,
					field: field,
					cell: cell,
					cellDiv: item.target
				};
				if (self.gameController.isLocal()){
					self.makeTurn(options);
				} else {
					mediator.publish('turn:local', options);
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
				
				$('.global-game-cell[data-cell={0}]'.format(field))
							.addClass('cell-filled')
							.append('<div class=\"{0}-cell\"></div>'.format(winnerClass));

				current.setWinnerDefine();

				var winner = winnerResult.winner;
				self.globalField.toggleStateByNumber(field, self.gameController.currentPlayer);
				return self.globalField.determineWinner();
			}
		}

		function newGame_(){
			if (self.gameController.isLocal()){
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