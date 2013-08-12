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

		initializeGame();
		
		if(!isLocal_) {
			initializeSubscriptions();
		}

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

			self.fieldGrid[options.field].toggleStateByNumber(options.cell, self.currentPlayer);
			var winner = determineLocalWinner_(options.field);	
			
			switchPlayer();
			self.availableField = options.cell;			

			if (!isLocal_){
				self.turnAllowed = !self.turnAllowed;
			}
		};

		function initializeGame(){
			self.fieldGrid = [];
			self.availableField = undefined;

			for (var i = 0; i <= 8; i++) {
				self.fieldGrid.push(new Field(i));
			}

			self.globalField = new Field(++i);

			self.currentPlayer = enums.CellStates.Cross;
			self.turnAllowed = true;
			mediator.on('socket:shape',function(shape){
				self.currentPlayer = shape;
				self.turnAllowed = shape === enums.CellStates.Cross;
			});
		}

		function switchPlayer() {
			if (isLocal_){
				if(self.currentPlayer === enums.CellStates.Cross) {
					self.currentPlayer = enums.CellStates.Zero;
				} else {
					self.currentPlayer = enums.CellStates.Cross;
				}
			}
		}

		function initializeSubscriptions(){
			mediator.on('socket:turn-network', self.makeTurn);
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