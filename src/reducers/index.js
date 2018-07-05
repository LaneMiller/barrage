const initialState = {
  level: {
    levelId: 1,
    bounds: {top: 25, bottom: 192, left: 758, right: 1145},
    exits: [],
    killedEnemies: 0,
    enemies: {
      1: {mobId: 1, type: 'green', health: 20, damage: 5, speed: 2, points: 100, height: 24, width: 13, rotation: 0, walking: false,},
      2: {mobId: 2, type: 'green', health: 20, damage: 5, speed: 2, points: 100, height: 24, width: 13, rotation: 90, walking: false,},
      3: {mobId: 3, type: 'green', health: 20, damage: 5, speed: 2, points: 100, height: 24, width: 13, rotation: 315, walking: false,},
      4: {mobId: 4, type: 'green', health: 20, damage: 5, speed: 2, points: 100, height: 24, width: 13, rotation: 180, walking: false,},
      5: {mobId: 5, type: 'green', health: 20, damage: 5, speed: 2, points: 100, height: 24, width: 13, rotation: 270, walking: false,},
      6: {mobId: 6, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      7: {mobId: 7, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 45, walking: false,},
      8: {mobId: 8, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      9: {mobId: 9, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      10: {mobId: 10, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      11: {mobId: 11, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      12: {mobId: 12, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      13: {mobId: 13, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
      14: {mobId: 14, type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, rotation: 0, walking: false,},
    }
  },
  player: {
    health: 100,
    lives: 0,
    score: 0,
    kills: 0,
    cash: 0,
    prizes: 0,
    gun: {type: 'pistol', damage: 5},
    positioning: {
      x: 952,
      y: 111,
      rotation: 0,
      walking: false,
    },
  },
  enemy: {

  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
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

    case 'CHANGE_AMMO_VALUE':
      return {...state, player:{...state.player, gun:{...state.player.gun, ammo: action.payload}}};

    case 'CHANGE_GUN':
      return {...state, player:{...state.player, gun: action.payload}};

    default:
      console.log("Returned state, no changes")
      return state;
  }
}

export default reducer
