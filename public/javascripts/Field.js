define(function(require) {
	'use strict';

	var Cell = require('./Cell');

	function Field (number) {
		var _number,
			_winnerDefined = false;

		this.cellsArray = [];
		this.dimensions = 3;

		if(typeof number === 'number') {
			_number = number;
		}

		for (var i = 0; i <= 8; i++) {
			this.cellsArray.push(new Cell(i));
		}

		this.getNumber = function () {
			return _number;
		};

		this.setWinnerDefine = function () {
			_winnerDefined = true;
		};

		this.isWinnerDefined = function () {
			return _winnerDefined;
		};
	}

	Field.prototype = {

		getCellByNumber: function(number) {

			for(var item in this.cellsArray)
			{
				if(this.cellsArray.hasOwnProperty(item)) {
					if(this.cellsArray[item].getNumber() === number) {
						return this.cellsArray[item];
					}
				}
			}

			throw new Error('The cell with number {0} was not found in {1} field!'.format(number, this.getNumber()));
		},

		toggleStateByNumber: function(number, state) {
			this.getCellByNumber(number).toggleState(state);
		},

		determineWinner: function() {
			
			var leftDiagonal = this.checkLeftDiagonal_();

			if(leftDiagonal)
				return leftDiagonal;

			var rightDiagonal = this.checkRightDiagonal_();

			if(rightDiagonal)
				return rightDiagonal;

			var horizontals = this.checkHorizontals_();

			if(horizontals)
				return horizontals;

			var vertials = this.checkVerticals_();

			if(vertials)
				return vertials;
		},

		checkHorizontals_: function () {
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
					//console.log('Horizontal: line from ' + i + ' to ' + (i + this.dimensions) + ' winner ' + currentState);
					return {from: i, to: i + this.dimensions, winner: currentState};
				} else {
					seria = true;
				}
			}
			return false;
		},

		checkVerticals_: function() {
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
					//console.log('Vertical: line from ' + i + ' to ' + (i + this.dimensions) + ' winner ' + currentState);
					return {from: i, to: i + this.dimensions, winner: currentState};
				} else {
					seria = true;
				}
			}
		},

		checkLeftDiagonal_: function() {
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
				//console.log('Left diagonal: line from 0 to 8' + ' winner ' + currentState);
				return {from: 0, to: 8, winner: currentState};
			} else {
				seria = true;
			}
		},

		checkRightDiagonal_: function() {
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
				//console.log('Right diagonal: line from 2 to 6' + ' winner ' + currentState);
				return {from: 0, to: 8, winner: currentState};
			} else {
				seria = true;
			}
		}
	};

	return Field;
});