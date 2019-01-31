import enemyTypes from '../dependencies/enemyTypes'

const initialState = {
  playArea: {
    width: 402,
    height: 183,
  },
  entrances: {
    top: [402/2, -1],
    left: [-1, 183/2],
    bottom: [402/2, 183+1],
    right: [402+1, 183/2],
  },
  currentLevel: 1,
  // level: {
  //   levelId: 1,
  //   bounds: {top: 25, bottom: 192, left: 758, right: 1145},
  //   exits: [],
  //   pickups: [],
  //   waveSize: Math.floor(13 / 3),
  //   wave: 0,
  //   killedEnemies: 0,
  //   enemies: {
  //     1: {mobId: 1, rotation: 0, ...enemyTypes.green},
  //     2: {mobId: 2, rotation: 90, ...enemyTypes.green},
  //     3: {mobId: 3, rotation: 315, ...enemyTypes.green},
  //     4: {mobId: 4, rotation: 180, ...enemyTypes.green},
  //     5: {mobId: 5, rotation: 270, ...enemyTypes.purple},
  //     6: {mobId: 6, rotation: 0, ...enemyTypes.green},
  //     7: {mobId: 7, rotation: 45, ...enemyTypes.purple},
  //     8: {mobId: 8, rotation: 0, ...enemyTypes.purple},
  //     9: {mobId: 9, rotation: 0, ...enemyTypes.green},
  //     10: {mobId: 10, rotation: 0, ...enemyTypes.green},
  //     11: {mobId: 11, rotation: 0, ...enemyTypes.green},
  //     12: {mobId: 12, rotation: 0, ...enemyTypes.purple},
  //     13: {mobId: 13, rotation: 0, ...enemyTypes.purple},
  //   }
  // },
  player: {
    health: 100,
    lives: 1,
    score: 0,
    kills: 0,
    bonus: 0,
    gun: {type: 'pistol', damage: 5, rate: 300},
    positioning: {
      x: 201,
      y: 91,
      rotation: 0,
      walking: false,
    },
    level_id: 1,
    levelStatus: 'active',
  },
  enemy: {

  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_LEVEL_SELECT':
      return {...state, levelSelect: action.payload};

    case 'SET_LEVEL':
      return {...state, currentLevel: action.payload.levelId, level: action.payload};

    case 'READY_NEXT_LEVEL':
      return {...state,
        currentLevel: action.payload.levelId,
        level: action.payload.level,
        player: {...state.player,
          level_id: action.payload.levelId,
          positioning: {...state.player.positioning,
            x: action.payload.startingX,
            y: action.payload.startingY}
          }
        };

    case 'SET_PLAY_AREA':
      return {...state, playArea: action.payload}

    case 'SET_ENTRANCES':
      return {...state, entrances: action.payload}

    case 'SET_PLAYER':
      return {...state, player: action.payload};

    case 'UPDATE_PLAYER_POS':
      return {...state, player:{...state.player, positioning:{...state.player.positioning, ...action.payload}}};

    case 'UPDATE_PLAYER_WALKING':
      return {...state, player:{...state.player, positioning:{...state.player.positioning, ...action.payload}}};

    case 'UPDATE_ENEMY_POS':
      return {...state, level:{...state.level, enemies:{...state.level.enemies, ...action.payload}}};

    case 'DAMAGE_PLAYER':
      return {...state, player:{...state.player, health:state.player.health - action.payload}};

    case 'DAMAGE_ENEMY':
      return {...state, level:{...state.level, enemies:{...state.level.enemies, ...action.payload}}};

    case 'INCREASE_SCORE':
      return {...state, player:{...state.player, score: state.player.score + action.payload}};

    case 'INCREASE_KILL_SCORE':
      return {...state, player:{...state.player, score: state.player.score + action.payload, kills: state.player.kills + 1}};

    case 'REMOVE_ENEMY':
      return {...state, level:{...state.level, killedEnemies: state.level.killedEnemies + 1, enemies: {...action.payload}}};

    case 'UPDATE_LEVEL_PICKUPS':
      return {...state, level: {...state.level, pickups: action.payload}};

    case 'CHANGE_AMMO_VALUE':
      return {...state, player:{...state.player, gun:{...state.player.gun, ammo: action.payload}}};

    case 'CHANGE_GUN':
      return {...state, player:{...state.player, gun: action.payload}};

    case 'UPDATE_PLAYER_VALUE':
      return {...state, player:{...state.player, ...action.payload}}

    case 'UPDATE_PLAYER_LEVEL_STATUS':
      return {...state, player:{...state.player, levelStatus: action.payload}};

    case 'INCREMENT_WAVE':
      return {...state, level: {...state.level, wave: state.level.wave + 1}}

    default:
      console.log("Returned state, no changes")
      return state;
  }
}

export default reducer
