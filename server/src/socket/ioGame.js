class IoGame {
  constructor(io, playerManager) {
    io.on('connection', async (socket) => {
      console.log('a user connected: ', socket.id);
      
      // Create a new player
      playerManager.addPlayer(socket.id, {
        flipX: false,
        x: 200,
        y: 200,
        playerId: socket.id,
      });
      socket.emit('currentPlayers', playerManager.players);
      socket.broadcast.emit('newPlayer', playerManager.players[socket.id]);

      // When a player disconnects, remove from players list
      socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
        playerManager.removePlayer(socket.id);
        io.emit('disconnect', socket.id);
      })

      // When player moves, update player data
      socket.on('playerMovement', (movementData) => {
        playerManager.updatePlayer(socket.id, {
          x: movementData.x,
          y: movementData.y,
          flipX: movementData.flipX,
        });
        socket.broadcast.emit('playerMoved', playerManager.players[socket.id]);
      });
    });
  }
}

export default IoGame;