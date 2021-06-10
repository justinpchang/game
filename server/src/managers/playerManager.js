class PlayerManager {
  constructor() {
    this.players = {};
    this.game = null;
  }

  setGame(game) {
    this.game = game;
  }

  events() {
    return this.game.scene.keys['GameScene'].events;
  }

  addPlayer(id, newPlayerInfo) {
    this.players[id] = newPlayerInfo;
    this.events().emit('addPlayer', id);
  }

  removePlayer(id) {
    delete this.players[id];
    this.events().emit('removePlayer', id);
  }

  updatePlayer(id, updatedPlayerInfo) {
    this.events().emit('updatePlayer', {
      ...updatedPlayerInfo,
      clientId: id,
    });
  }
}

export default PlayerManager;