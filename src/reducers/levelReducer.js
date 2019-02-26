import { SET_LEVEL, READY_NEXT_LEVEL, UPDATE_ENEMY_POS, DAMAGE_ENEMY, REMOVE_ENEMY, UPDATE_LEVEL_PICKUPS, INCREMENT_WAVE } from '../actions/types';

export default function levelReducer(state = {}, action) {
  switch (action.type) {
    // level => {...level}
    case SET_LEVEL:
      return action.payload;
    case READY_NEXT_LEVEL:
      return action.payload.level;
    case UPDATE_ENEMY_POS:
      return {...state.level,
                enemies: {...state.level.enemies, ...action.payload},
              };
    case DAMAGE_ENEMY:
      return {...state.level,
                enemies: {...state.level.enemies, ...action.payload},
              };
    case REMOVE_ENEMY:
      return {...state.level,
                killedEnemies: state.level.killedEnemies + 1,
                enemies: {...action.payload},
              };
    case UPDATE_LEVEL_PICKUPS:
      return {...state.level,
                pickups: action.payload
              };
    case INCREMENT_WAVE:
      return {...state.level,
                wave: state.level.wave + 1
              };

    default:
      return state;
  }
}
