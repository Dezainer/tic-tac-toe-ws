import WebSocket from 'ws'
import TicTacToeController from './src/controllers/ticTacToeController'

const wss = new WebSocket.Server({ port: 3000 })

wss.on('connection', (ws, req) => {
	TicTacToeController.handleConnection(req.url, ws)
	ws.on('message', TicTacToeController.handlePlay)
})