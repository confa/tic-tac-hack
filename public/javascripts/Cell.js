define(function(require) {
	'use strict';

	function Cell (number) {

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
	}

	return Cell;
});
