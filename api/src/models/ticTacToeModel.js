let data = {}

const connect = (id, client) => {
	if(data[id] && data[id].players && data[id].players.length == 1) {
		if(data[id].players.length == 2) {
			throw { code: 'FULL', message: 'Room is full' }
		}
		
		data[id].game.isReadyToPlay = true
		notifyPlayers(id, { game: data[id].game })
		return addPlayer(id, client)
	}

	initializeGame(id)
	return addPlayer(id, client)
}

const gameExists = id => {
	return data[id] && data[id].players
}

const addPlayer = (id, client) => {
	client.on('close', () => handleDisconnect(id, client))
	data[id].players.push(client)
	
	return Object.assign({ 
		game: data[id].game 
	}, { 
		symbol: data[id].players.length == 1 ? 'X' : 'O'
	})
}

const handleDisconnect = (id, disconnectedClient) => {
	if(!data[id]) return

	let players = data[id].players.filter(client => client != disconnectedClient)
	deleteGame(id)

	players.length != 0 &&
		notifyPlayers(id, connect(id, players[0]))
}

const deleteGame = id => {
	delete data[id]
}

const initializeGame = id => {
	data[id] = {
		players: [],
		game: {
			turn: 'X',
			isReadyToPlay: false,
			winner: null,
			plays: [
				[null, null, null],
				[null, null, null],
				[null, null, null]
			]
		}
	}
}

const isOnTurn = (id, play) => {
	return data[id].game.isReadyToPlay && data[id].game.turn == play.symbol
}

const play = (id, play) => {
	let { i, j, symbol } = play

	if(data[id].game.plays[i][j] == null) {
		data[id].game.plays[i][j] = symbol
	}
}

const changeTurn = id => {
	data[id].game.turn = data[id].game.turn == 'X' ? 'O' : 'X'
}

const notifyPlayers = (id, msg) => {
	data[id].players.map(client => client.send(JSON.stringify(msg)))
}

const isMatchWon = id => {
	let { plays } = data[id].game
	return wonHorizontally(plays) || wonVertically(plays) || wonDiagonally(plays)
}

const wonHorizontally = plays => {
	return plays.map((row, i) => areAllEqual(row)).includes(true)
}

const wonVertically = plays => {
	return plays.map((row, i) => 
		areAllEqual(row.map((item, j) => plays[j] [i]))
	).includes(true)
}

const wonDiagonally = plays => {
	return (
		areAllEqual(plays.map((row, i) => row[i])) ||
		areAllEqual(plays.map((row, i) => row[row.length - 1 - i]))
	)
}

const isMatchDraw = id => {
	let { plays } = data[id].game
	return ![].concat(...plays).includes(null)
}

const areAllEqual = data => {
	return data.filter(item => item && item == data[0]).length == data.length
}

const setAsWon = (id, winner) => {
	data[id].game.winner = winner
}

const setAsDraw = id => {
	data[id].game.winner = 'none'
}

const getGame = id => {
	return data[id].game
}

const pub = { 
	connect,
	play,
	isMatchWon,
	isMatchDraw,
	notifyPlayers,
	changeTurn,
	isOnTurn,
	setAsWon,
	setAsDraw,
	getGame
}

export default pub