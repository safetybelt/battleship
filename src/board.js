// Ships are simple objects with the ship name and size
var Ship = function(name, size) {
	this.name = name;
	this.size = size;
	this.placed = false;
	this.damage = 0;
};

Ship.HORIZONTAL = 0;
Ship.VERTICAL = 1;

// "hit" the ship; return true iff ship is sunk
Ship.prototype.hit = function() {
	this.damage += 1;
	if (this.damage >= this.size) {
		return true;
	}
	return false;
};

// object storing each ship and an id (used on grid)
var ships = {
	10: new Ship('Aircraft Carrier', 5),
	11: new Ship('Battleship', 4),
	12: new Ship('Submarine', 3),
	13: new Ship('Cruiser', 3),
	14: new Ship('Destroyer', 2)
};


var Board = function(size) {
	if (!size)
		size = 10;
	this.size = size;
	this.grid = this.createGrid(size);
};

// Tile types
Board.EMPTY = 0;
Board.HIT = 'X';
Board.MISS = 'O';
Board.SHIP_HIT = 'S';

Board.prototype.createGrid = function(size) {
	var g = [];
	for (var i = 0; i < size; i++) {
		g.push([]);
		for (var j = 0; j < size; j++) {
			g[i].push(Board.EMPTY);
		}
	}
	return g;
};

// ugly console board for testing purposes
Board.prototype.printGrid = function() {
	var r = '  ';
	for (var i = 0; i < this.size; i++) {
		r += i + '  ';
	}
	console.log(r);
	for (var y = 0; y < this.size; y++) {
		r = y + ' ';
		for (var x = 0; x < this.size; x++) {
			var t = ''+this.grid[y][x];
			if (t.length < 2)
				t += ' ';
			r += t + ' ';
		}
		console.log(r);
	}
};

Board.prototype.placeShipsRandomly = function(ships) {
	for (var i in ships) {
		if (ships[i]['placed']) {
			return false;
		}
		var x = Math.floor(Math.random() * this.size);
		var y = Math.floor(Math.random() * this.size);
		var o = Math.round(Math.random());
		while (!this.placeShip(i, x, y, o)) {
			x = Math.floor(Math.random() * this.size);
			y = Math.floor(Math.random() * this.size);
			o = Math.round(Math.random());
		}
		ships[i]['placed'] = true;
	}
	return true;
};

// places given ship starting at x, y in given orientation; returns true iff placed
Board.prototype.placeShip = function(shipId, x, y, orientation) {
	var ship = ships[shipId];
	if (orientation === Ship.HORIZONTAL && ship.size + x > this.size)
		return false;
	else if (orientation === Ship.VERTICAL && ship.size + y > this.size)
		return false;

	// TODO: this shouldn't need to loop twice
	// check to make sure the ship location is valid
	for (var i = 0; i < ship.size; i++) {
		if (this.grid[y][x] !== Board.EMPTY)
			return false;
		orientation === Ship.HORIZONTAL ? x += 1 : y += 1;
	}

	// place the ship)
	for (i = 0; i < ship.size; i++) {
		orientation === Ship.HORIZONTAL ? x -= 1 : y -= 1;
		this.grid[y][x] = shipId;
	}

	return true;
};

// takes fire at the given coordiante; returns shipId if hit, 0 if miss, -1 if unable to fire (already fired there, not valid coord, etc)
Board.prototype.takeFire = function(x, y) {
	if (x < 0 || x >= this.size || y < 0 || y >= this.size)
		return -1;
	switch (this.grid[y][x]) {
		case Board.EMPTY:
			this.grid[y][x] = Board.MISS;
			return 0;
		case Board.HIT:
		case Board.MISS:
		case Board.SHIP_HIT:
			return -1;
		default:
			var sId = this.grid[y][x];
			this.grid[y][x] = Board.SHIP_HIT;
			return sId;
	}
};

Board.prototype.setHitMiss = function(x, y, hit) {
	if (hit === true)
		this.grid[y][x] = Board.HIT;
	else
		this.grid[y][x] = Board.MISS;
}
