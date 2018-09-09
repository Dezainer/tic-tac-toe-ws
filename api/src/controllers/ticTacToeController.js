import TicTacToeModel from '../models/ticTacToeModel'

const handleConnection = (url, client) => {
	let initialMessage

	try {
		initialMessage = TicTacToeModel.connect(getIdFromUrl(url), client)
	} catch(err) {
		initialMessage = { error: true, errorData: err }
	}

	client.send(JSON.stringify(initialMessage))
}

const getIdFromUrl = url => (
	url.split('id=')[1]
)

const handlePlay = payload => {
	let { id, play } = JSON.parse(payload)
	if(!TicTacToeModel.isOnTurn(id, play)) return

	TicTacToeModel.play(id, play)
	
	if(TicTacToeModel.isMatchWon(id)) 
		TicTacToeModel.setAsWon(id, play.symbol)

	if(TicTacToeModel.isMatchDraw(id))
		TicTacToeModel.setAsDraw(id)

	TicTacToeModel.changeTurn(id)
	TicTacToeModel.notifyPlayers(id, { game: TicTacToeModel.getGame(id) })
}

const pub = { handleConnection, handlePlay }
export default pub