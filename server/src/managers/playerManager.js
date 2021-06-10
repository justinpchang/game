class PlayerManager {
  constructor() {
    this.players = {};
  }

  addPlayer(id, newPlayerInfo) {
    this.players[id] = newPlayerInfo;
  }

  removePlayer(id) {
    delete this.players[id];
  }

  updatePlayer(id, updatedPlayerInfo) {
    this.players[id] = {
      ...this.players[id],
      ...updatedPlayerInfo,
    };
  }
}

export default PlayerManager;