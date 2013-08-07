define(function (require)
{
	'use strict';

	// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
				return (typeof args[number] !== 'undefined') ? args[number] : match;
			});
		};
	}

	return {
		prependZero : function(source, minLength) {
				var length = source.toString().length;
				return (length > minLength ? source : new Array(minLength - length + 1).join('0') + source);
			}
	};
});