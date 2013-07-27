
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