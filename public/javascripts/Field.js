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