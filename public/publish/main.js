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
	};

}());
var app = app || {};

(function() {
	'use strict';

	app.Field = function (number) {
		var _number;

		this.cellsArray = [];
		this.rows = 3;
		this.columns = 3;


		if(typeof number === 'number') {
			_number = number;
		}

		for (var i = 9; i >= 0; i--) {
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
					if(item.getNumber() === number) {
						return item;
					}
				}
			}

			throw new Error('The cell with number ' + number + 
							' was not found in ' + this.getNumber() + 
							' field!');
		},

		toggleStateByNumber: function(state) {
			this.GetCellByNumber.toggleState(state);
		},

		determineWinner: function() {
			var currentSelect = this.cellsArray[0];
			for(var i = 0, len = this.cellsArray.length - 1; i < len; i+=this.columns) {
				
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

		for (var i = 9; i >= 0; i--) {
			this.globalField.push(new app.Field(i));
		}

		gameCells.on('mouseover', function (item) {
			$(item.target).css('box-shadow', '0 0 15px #767664');
		});

		gameCells.on('mouseout', function (item) {
			$(item.target).css('box-shadow', 'initial');
		});

		gameCells.on('click', function (item) {
			// var field = $(item.target).data('field');
			var cell = $(item.target).data('cell');
			// console.log('field: ' + field + '; cell: ' + cell);

			var className = self.currentPlayer === app.CellStates().Cross ? 'cross'	: 'zero';
			
			$(item.target)
					.append('<div class=\"'+className+'\"></div>')
					.off('click mouseout mouseover');

			if(self.currentPlayer === app.CellStates().Cross) {
				self.currentPlayer = app.CellStates().Zero;
			} else {
				self.currentPlayer = app.CellStates().Cross;
			}

			this.availableField = cell;

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