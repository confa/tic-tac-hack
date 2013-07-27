var app = app || {};

(function() {
	'use strict';
	app.CellStates =function () {
		return {
				Empty: 0,
				Cross: 1,
				Zero: 2
			};
	};
}());

var app = app || {};

(function() {
	'use strict';

	app.Cell = function (number) {

		var _state = 0,
			_number = 0,
			_self = this;

		if(typeof number === 'number') {
			_number = number;
		}

		this.toggleState = function (state) {
			if(typeof state === 'number' && state > 0 && state <= 3) {
				_state = state;
			}
		};

		this.getNumber = function () {
			return _number;
		};

		this.getState = function() {
			return _state;
		};
	};

}());
var app = app || {};

(function() {
	'use strict';

	app.Field = function (number) {
		var _number;

		this.cellsArray = [];
		this.dimensions = 3;


		if(typeof number === 'number') {
			_number = number;
		}

		for (var i = 0; i <= 8; i++) {
			this.cellsArray.push(new app.Cell(i));
		}

		this.getNumber = function () {
			return _number;
		};
	};

	app.Field.prototype = {

		getCellByNumber: function(number) {

			for(var item in this.cellsArray)
			{
				if(this.cellsArray.hasOwnProperty(item)) {
					if(this.cellsArray[item].getNumber() === number) {
						return this.cellsArray[item];
					}
				}
			}

			throw new Error('The cell with number ' + number + 
							' was not found in ' + this.getNumber() + 
							' field!');
		},

		toggleStateByNumber: function(number, state) {
			this.getCellByNumber(number).toggleState(state);
		},

		determineWinner: function() {
			
			this.checkHorizontals();
			this.checkVerticals();
			this.checkLeftDiagonal();
			this.checkRightDiagonal();
		},

		checkHorizontals: function () {
			for(var i = 0, len = this.cellsArray.length - 1; i < len; i+=this.dimensions) {
				var currentState = this.cellsArray[i].getState();
				var seria = true;
				
				if(currentState === 0)
					seria = false;

				for(var j = i; j < i + this.dimensions && seria; j++) {
					if(currentState !== this.cellsArray[j].getState()) {
						seria = false;
					}
				}

				if(seria === true) { 
					console.log('Horizontal: line from ' + i + ' to ' + (i + this.dimensions) + ' winner ' + currentState);
					return {from: i, to: i+this.dimensions, winner: currentState};
				} else {
					seria = true;
				}
			}
			return false;
		},

		checkVerticals: function() {
			for(var i = 0, len = this.dimensions; i < len; i++) {
				var currentState = this.cellsArray[i].getState();
				var seria = true;
				
				if(currentState === 0)
					seria = false;

				for(var j = i; j < this.cellsArray.length && seria; j+=this.dimensions) {
					if(currentState !== this.cellsArray[j].getState()) {
						seria = false;
					}
				}

				if(seria === true) { 
					console.log('Vertical: line from ' + i + ' to ' + (i + this.dimensions) + ' winner ' + currentState);
					return {from: i, to: i+this.dimensions, winner: currentState};
				} else {
					seria = true;
				}
			}
		},

		checkLeftDiagonal: function() {
			var last = this.cellsArray.length-1;
			var currentState = this.cellsArray[last].getState();
			var seria = true;

			if(currentState === 0)
				seria = false;

			for (var i = last; i >= 0; i-=(this.dimensions + 1)) {
				if(currentState !==this.cellsArray[i].getState()) {
					seria = false;
				}
			}

			if(seria === true) { 
				console.log('Left diagonal: line from 0 to 8' + ' winner ' + currentState);
				return {from: 0, to: 8, winner: currentState};
			} else {
				seria = true;
			}
		},

		checkRightDiagonal: function() {
			var currentState = this.cellsArray[this.dimensions-1].getState();
			var seria = true;

			if(currentState === 0)
				seria = false;

			for (var i = this.dimensions-1; i < this.cellsArray.length-1; i+=(this.dimensions - 1)) {
				if(currentState !==this.cellsArray[i].getState()) {
					seria = false;
				}
			}

			if(seria === true) { 
				console.log('Right diagonal: line from 2 to 6' + ' winner ' + currentState);
				return {from: 0, to: 8, winner: currentState};
			} else {
				seria = true;
			}
		}
	};

}());
var app = app || {};

(function() {
	'use strict';
	app.Game = function (options) {
		this.globalField = [];	
		this.availableField = undefined;
		var self = this;

		var gameCells = $(".game-cell");
		this.currentPlayer = app.CellStates().Cross;

		for (var i = 0; i <= 8; i++) {
			this.globalField.push(new app.Field(i));
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

			var className = self.currentPlayer === app.CellStates().Cross ? 'cross'	: 'zero';
			
			$(item.target)
					.append('<div class=\"'+className+'\"></div>')
					.off('click mouseout mouseover');

			if(self.currentPlayer === app.CellStates().Cross) {
				self.currentPlayer = app.CellStates().Zero;
			} else {
				self.currentPlayer = app.CellStates().Cross;
			}

			self.availableField = cell;

			$(".game-field").removeClass('current-cell');
			$(".game-field-" + cell).addClass('current-cell');
		});
	};

}());

var Game = new app.Game();
// var app = app || {};

// (function() {
// 	'use strict';
// 	app.CellStates =function () {
// 		return {
// 				Empty: 0,
// 				Cross: 1,
// 				Zero: 2
// 			};
// 	};
// }());