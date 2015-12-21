// create a fresh battleship game
var Game = function(player1Name, player2Name) {
	if (!player1Name)
		player1Name = 'Player 1';
	if (!player2Name)
		player2Name = 'Player 2';
	this.player1 = new Player(player1Name);
	this.player2 = new Player(player2Name);
	this.current = this.player1;
	this.target = this.player2;
	this.labels = [[], this.current.name + "'s turn"];	// array of labels, [0] is all hits/misses/etc, [1] is the current turn
};

Game.prototype.endTurn = function() {
	// check for a winner
	if (this.target.shipsRemaining() === 0) {
		this.labels[1] = this.current.name + ' Wins!';
		this.current = null;
		return;
	}
	var p = this.current;
	this.current = this.target;
	this.target = p;
	this.labels[1] = this.current.name + "'s turn"
};

Game.prototype.fire = function(x, y) {
	var res = this.current.fire(this.target, x, y);
	if (res === -1) {
		this.labels[0].unshift(this.current.name + ': You have already fired there!');
		return false;
	}
	if (res === 0)
		this.labels[0].unshift(this.current.name + ': Miss!');
	else if (res === 1)
		this.labels[0].unshift(this.current.name + ': Hit!');
	else
		this.labels[0].unshift(this.current.name + ': Hit! You sank ' + this.target.name + "'s " + this.target.ships[res].name + '!');
	this.endTurn();
	return true;
};

// We're going to pass in the Game to React and need to be able to start a new game (hence the bind to global this)
Game.prototype.newGame = function(player1Name, player2Name) {
	this.game = new Game(player1Name, player2Name);
}.bind(this);

var game = new Game();


