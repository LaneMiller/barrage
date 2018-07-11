import enemyTypes from './enemyTypes'

const levelSelect = {
  2: {
    levelId: 2,
    bounds: {top: 25, bottom: 192, left: 758, right: 1145},
    exits: [],
    pickups: [],
    waveSize: Math.floor(12 / 3),
    wave: 1,
    killedEnemies: 0,
    enemies: {
      1: {mobId: 1, rotation: 0, ...enemyTypes.green},
      2: {mobId: 2, rotation: 90, ...enemyTypes.green},
      3: {mobId: 3, rotation: 315, ...enemyTypes.green},
      4: {mobId: 4, rotation: 180, ...enemyTypes.green},
      5: {mobId: 5, rotation: 270, ...enemyTypes.purple},
      6: {mobId: 6, rotation: 0, ...enemyTypes.purple},
      7: {mobId: 7, rotation: 45, ...enemyTypes.green},
      8: {mobId: 8, rotation: 0, ...enemyTypes.green},
      9: {mobId: 9, rotation: 0, ...enemyTypes.purple},
      10: {mobId: 10, rotation: 0, ...enemyTypes.green},
      11: {mobId: 11, rotation: 0, ...enemyTypes.purple},
      12: {mobId: 12, rotation: 0, ...enemyTypes.purple},
    }
  },

  3: {
    levelId: 3,
    bounds: {top: 25, bottom: 192, left: 758, right: 1145},
    exits: [],
    pickups: [],
    waveSize: Math.floor(14 / 2.5),
    wave: 1,
    killedEnemies: 0,
    enemies: {
      1: {mobId: 1, rotation: 0, ...enemyTypes.green},
      2: {mobId: 2, rotation: 90, ...enemyTypes.green},
      3: {mobId: 3, rotation: 315, ...enemyTypes.green},
      4: {mobId: 4, rotation: 180, ...enemyTypes.green},
      5: {mobId: 5, rotation: 270, ...enemyTypes.purple},
      6: {mobId: 6, rotation: 0, ...enemyTypes.purple},
      7: {mobId: 7, rotation: 45, ...enemyTypes.green},
      8: {mobId: 8, rotation: 0, ...enemyTypes.purple},
      9: {mobId: 9, rotation: 0, ...enemyTypes.purple},
      10: {mobId: 10, rotation: 0, ...enemyTypes.green},
      11: {mobId: 11, rotation: 0, ...enemyTypes.purple},
      12: {mobId: 12, rotation: 0, ...enemyTypes.purple},
      13: {mobId: 13, rotation: 0, ...enemyTypes.purple},
      14: {mobId: 14, rotation: 0, ...enemyTypes.purple},
    }
  },
  4: {
    levelId: 4,
    bounds: {top: 25, bottom: 192, left: 758, right: 1145},
    waveSize: 1,
    wave: 1,
    killedEnemies: 0,
    pickups: [],
    enemies: {
     1: {mobId: 1, rotation: 0, ...enemyTypes.boss}
    }
  },
}

export default levelSelect;
