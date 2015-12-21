var Player = function(name) {
	if (!name)
		name = 'Default Player';
	this.name = name;
	this.shipBoard = new Board(10);
	this.targetBoard = new Board(10);
	this.ships = {
		10: new Ship('Aircraft Carrier', 5),
		11: new Ship('Battleship', 4),
		12: new Ship('Submarine', 3),
		13: new Ship('Cruiser', 3),
		14: new Ship('Destroyer', 2)
	};
}

// fire at the target's shipBoard, returns 1 if hit, 2 if hit and sunk, 0 if miss, -1 if unable to fire
Player.prototype.fire = function(target, x, y) {
	var res = target.takeFire(x, y);
	switch (res) {
		case 0:
			this.targetBoard.setHitMiss(x, y, false);
		case -1:
			break;
		default:
			this.targetBoard.setHitMiss(x, y, true);
	}
	return res;
};

// take fire from an opponent; checks player's shipBoard and sets damage to the ship if necessary
//	returns 1 if hit, shipId if sunk, 0 if miss, -1 if unable to fire
Player.prototype.takeFire = function(x, y) {
	var f = this.shipBoard.takeFire(x, y);
	if (f > 0) {
		if (this.ships[f].hit())
			return f;
		return 1;
	}
	return f;
};

Player.prototype.placeAllShipsRandomly = function() {
	this.shipBoard.placeShipsRandomly(this.ships);
};

Player.prototype.placeShip = function(shipId, x, y, orientation) {
	if (this.shipBoard.placeShip(shipId, x, y, orientation)) {
		ships[shipId].place(x, y, orientation);
		return true;
	}
	return false;
};

Player.prototype.shipsRemaining = function() {
	var count = 0;
	for (s in this.ships) {
		if (this.ships[s].damage < this.ships[s].size)
			count++;
	}
	return count;
}
