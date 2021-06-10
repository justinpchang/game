class SyncManager {
  constructor() {}

  static prepareFromPhaserGroup(group, objects) {
    group.children.iterate((sprite) => {
      SyncManager.prepareFromPhaserSprite(sprite, objects);
    });
  }

  static prepareFromPhaserSprite(sprite, objects) {
    const obj = {
      ...sprite,
    };
    objects.push(SyncManager.cleanObjectToSync(obj));
  }

  static cleanObjectToSync(obj) {
    let objectToSync = {};

    const addObjectToSync = (key, prop) => {
      if (prop !== null) objectToSync = {
        ...objectToSync,
        [key]: prop,
      };
    };

    addObjectToSync('id', obj.id);
    addObjectToSync('clientId', obj.clientId);
    addObjectToSync('type', obj.type);
    addObjectToSync('active', obj.active);
    addObjectToSync('x', obj.x);
    addObjectToSync('y', obj.y);
    addObjectToSync('skin', obj.skin);

    return objectToSync;
  }

  // TODO: encode/decode better
  static decode(data) {
    return data;
  }

  static encode(objs) {
    return objs;
  }
}

export default SyncManager;