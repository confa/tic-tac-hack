module.exports = Games;

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
	if (typeof player1Name === 'string'){
		_.extend(game, data);
		this.list.push(game);
	}
	return game;
};

Games.prototype.start = function(id) {
	var game = this.getById(id);
	if (game.length === 1){
		started = true;
		return game;
	} else{
		return false;
	}
};

Games.prototype.getById = function(id) {
	return _.findWhere(this.list, {id: id});
};

Games.prototype.getPending = function() {
	return _.where(this.list, {started: false});
};

Games.prototype.join = function(id, playerName) {
	var game = this.getById(id);
	if (game.length === 1){
		if (!game.full){
			game.player2Name = playerName;
			game.full = true;
			game = this.start(id);
			return game;
		} else {
			return false;
		}
	} else {
		return false;
	}
};