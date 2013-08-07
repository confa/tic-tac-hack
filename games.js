module.exports = function Games(){
	this.list = [];
}

Games.prototype.add = function(data) {
	var game = {
		id: this.list.length,
		started: false
	};
	if (typeof player1Name === 'string' && typeof player2Name === 'string'){
		_.extend(game, data);
		this.list.push(game);
	}
	return game;
}

Games.prototype.start = function(id) {
	this.getById(id).started = true;
	return true;
};

Games.prototype.getById = function(id) {
	return _.findWhere(this.list, {id: id});
};

Games.prototype.getPending = function() {
	return _.where(this.list, {started: false});
};