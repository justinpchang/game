import Game from '../game/game';

class IoGame {
  constructor(io, playerManager) {
    this.io = io;
    this.playerManager = playerManager;

    // Create a new game (TODO: move to a room manager)
    const game = new Game();
    playerManager.setGame(game);

    io.on('connection', async (socket) => {
      console.log('Socket connected: ', socket.id);

      // Create a new player
      playerManager.addPlayer(socket.id, {
        flipX: false,
        x: 200,
        y: 200,
        playerId: socket.id,
      });
      socket.broadcast.emit('pleaseSync');

      // Send player snapshot of current world
      socket.on('sync', () => {
        this.handleSync(socket);
      });

      // When a player disconnects, remove from players list
      socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
        playerManager.removePlayer(socket.id);
        socket.emit('disconnect', socket.id);
      });

      // When a player moves, update world
      socket.on('update', (payload) => {
        playerManager.updatePlayer(socket.id, payload);
        this.handleSync(socket);
      });
    });
  }

  handleSync(socket) {
    if (!this.playerManager?.game?.scene) {
      return;
    }

    const objects = this.playerManager.game.scene.keys['GameScene'].getInitialState();

    socket.emit('sync', objects);
  }
}

export default IoGame;