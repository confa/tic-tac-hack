module.exports = Games;

var _ = require('underscore');

function Games(){
	this.list = [];
}

Games.prototype.add = function(data) {
	var game = {
		id: this.list.length,
		full: false,
		started: false,
		finished: false
	};
	game = _.extend(game, data);
	this.list.push(game);
	return game;
};

Games.prototype.start = function(id) {
	var game = this.getById(id);
	if (game){
		game.started = true;
		return game;
	} else{
		return false;
	}
};

Games.prototype.getById = function(id) {
	var game = _.findWhere(this.list, {id: id});
	var result;
	if (typeof game !== 'undefined'){
		result = game;
	} else {
		result = false;
	}
	return result; 
};

Games.prototype.getPending = function() {
	return _.where(this.list, {started: false});
};

Games.prototype.join = function(data) {
	var game = this.getById(data.id);
	if (game){
		if (!game.full){
			game.player2 = data.name;
			game.full = true;
			game = this.start(data.id);
			return game;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

Games.prototype.remove = function(data) {
	var game = this.getById(data.id);
	this.list = _.without(this.list, game);
};

Games.prototype.finish = function(data) {
	var game = this.getById(data.id);
	game.finished = true;
};