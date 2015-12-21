var BattleshipGame = React.createClass({
	getInitialState: function() {
		return {
			'p1target': this.props.game.player1.targetBoard,
			'p2target': this.props.game.player2.targetBoard,
			'p1own': this.props.game.player1.shipBoard,
			'p2own': this.props.game.player2.shipBoard,
			'labels': this.props.game.labels,
			'current': this.props.game.current
		};
	},
	componentDidMount: function() {
		this.placeShips();
	},
	onAnyBoardUpdate: function() {
		this.setState(this.getInitialState());
	},
	placeShips: function() {
		this.props.game.player1.placeAllShipsRandomly();
		this.props.game.player2.placeAllShipsRandomly();
		this.onAnyBoardUpdate();
	},
	newGame: function() {
		this.props.game.newGame();
		document.getElementById('battleship-game').innerHTML = '';
		ReactDOM.render(<BattleshipGame game={game}/>, document.getElementById('battleship-game'));
	},
	render: function() {
		return (
			<div>
				<div className="player-board">
					<h2 className="title">{this.props.game.player1.name}</h2>
					<BoardView onUpdate={this.onAnyBoardUpdate} board={this.state.p1target} player={this.props.game.player1} />
					<BoardView onUpdate={this.onAnyBoardUpdate} board={this.state.p1own} />
				</div>
				<div className="player-board">
					<h2 className="title">{this.props.game.player2.name}</h2>
					<BoardView onUpdate={this.onAnyBoardUpdate} board={this.state.p2target} player={this.props.game.player2}  />
					<BoardView onUpdate={this.onAnyBoardUpdate} board={this.state.p2own}  />
				</div>
				<div className="buttons">
					<Button buttonEvent={this.newGame} label="New Game" />
				</div>
				<h2 className="label label-turn">{this.state.labels[1]}</h2>
				<hr />
				<h2 className="label label-result">{this.state.labels[0][0]}</h2>
				<div>
					{
						this.state.labels[0].map(function(label, i) {
							if (i > 0)
								return <h4 className="label label-history">{label}</h4>
						})
					}
				</div>
			</div>
		);
	}
});

var BoardView = React.createClass({
	getInitialState: function() {
		return {
			'board': this.props.board
		};
	},
	onBoardUpdate: function() {
		this.props.onUpdate();
		this.setState({
			'board': this.props.board
		});
	},
	render: function() {
		var self = this;
		var cover = '';
		if (!this.props.player)
			cover = <div className="board-cover"><div className="board-cover-text label">Hover to view your ships</div></div>;
		return (
			<div id="battleship-board" className="board">
				{cover}
				{
					this.props.board.grid.map(function(row, y) {
						return <BoardRow onUpdate={self.onBoardUpdate} row={row} y={y} player={self.props.player}  />
					})
				}
			</div>
		);
	}
});

var BoardRow = React.createClass({
	render: function() {
		var self = this;
		var icons = {
			'O': 'img/water_miss.png',
			'X': 'img/water_hit.png',
			'S': 'img/boat_hit.png',
			0: 'img/water_empty.png'
		};
		return (
		  <div id="battleship-row" className="tile-row">
			  {
		  		this.props.row.map(function(state, x) {
		  			if (state in icons)
		  				state = icons[state];
		  			else
		  				state = 'img/boat_empty.png';
		  			return <BoardTile onFire={self.props.onUpdate} icon={state} x={x} y={self.props.y} player={self.props.player}  />;
		  		})
		  	}
  		<br />
  		</div>
		);
	}
});

var BoardTile = React.createClass({
	handleClick: function() {
		if (this.props.player && game.current === this.props.player)
			this.props.onFire(game.fire(this.props.x, this.props.y));
	},
	render: function() {
		return (
    	<img src={this.props.icon} className="tile" onClick={this.handleClick} />
    );
	}
})

var Button = React.createClass({
	propTypes: {
		buttonEvent: React.PropTypes.func.isRequired
	},
	handleClick: function() {
		this.props.buttonEvent();
	},
	render: function() {
		return (
    	<button onClick={this.handleClick} className="button">{this.props.label}</button>
		);
	}
});

ReactDOM.render(<BattleshipGame game={game}/>, document.getElementById('battleship-game'));
