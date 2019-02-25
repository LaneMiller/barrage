import { combineReducers } from 'redux';

// const rootReducer = combineReducers({
//   status,
//   currentLevel,
//   playArea,
//   entrances,
//   player
// })

const initialState = {
  status: 'title',
  currentLevel: 1,
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
    case 'CHANGE_GAME_STATUS':
      return {...state, status: action.payload};

    case 'CREATE_LEVEL_SELECT':
      return {...state, levelSelect: action.payload};

    case 'SET_LEVEL':
      return {...state, currentLevel: action.payload.levelId, level: action.payload};

    case 'UPDATE_LEVEL_SELECT':
      return {...state, levelSelect: action.payload}

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
