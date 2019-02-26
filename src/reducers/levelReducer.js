import { SET_LEVEL, READY_NEXT_LEVEL, UPDATE_ENEMY_POS, DAMAGE_ENEMY, REMOVE_ENEMY, UPDATE_LEVEL_PICKUPS, INCREMENT_WAVE } from '../actions/types';

const INIT_STATE = {}

export default function levelReducer(state = INIT_STATE, action) {
  switch (action.type) {
    // level => {...level}
    case SET_LEVEL:
      return action.payload;
    case READY_NEXT_LEVEL:
      return action.payload.level;
    case UPDATE_ENEMY_POS:
      return {...state,
                enemies: {...state.enemies, ...action.payload},
              };
    case DAMAGE_ENEMY:
      return {...state,
                enemies: {...state.enemies, ...action.payload},
              };
    case REMOVE_ENEMY:
      return {...state,
                killedEnemies: state.killedEnemies + 1,
                enemies: {...action.payload},
              };
    case UPDATE_LEVEL_PICKUPS:
      return {...state,
                pickups: action.payload
              };
    case INCREMENT_WAVE:
      return {...state,
                wave: state.wave + 1
              };

    default:
      return state;
  }
}
