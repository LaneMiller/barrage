import { READY_NEXT_LEVEL, UPDATE_PLAYER_POS, UPDATE_PLAYER_WALKING, DAMAGE_PLAYER, INCREASE_SCORE, INCREASE_KILL_SCORE, CHANGE_AMMO_VALUE, CHANGE_GUN, UPDATE_PLAYER_VALUE, UPDATE_PLAYER_LEVEL_STATUS } from '../actions/types';

const INITIAL_STATE = {
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
                      }

export default playerReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    // player => {...player}
    case READY_NEXT_LEVEL:
      return {...state.player,
                level_id: action.payload.levelId,
                positioning: {...state.player.positioning,
                x: action.payload.startingX,
                y: action.payload.startingY},
              };
    case SET_PLAYER:
      return action.payload;
    case UPDATE_PLAYER_POS:
      return {...state.player,
                positioning: {...state.player.positioning, ...action.payload},
              };
    case UPDATE_PLAYER_WALKING:
      return {...state.player,
                positioning: {...state.player.positioning, ...action.payload},
              };
    case DAMAGE_PLAYER:
      return {...state.player,
                health: state.player.health - action.payload,
              };
    case INCREASE_SCORE:
      return {...state.player,
                score: state.player.score + action.payload,
              };
    case INCREASE_KILL_SCORE:
      return {...state.player,
                score: state.player.score + action.payload,
                kills: state.player.kills + 1,
              };
    case CHANGE_AMMO_VALUE:
      return {...state.player,
                gun: {...state.player.gun, ammo: action.payload},
              };
    case CHANGE_GUN:
      return {...state.player,
                gun: action.payload,
              };
    case UPDATE_PLAYER_VALUE:
      return {...state.player,
                ...action.payload,
              };
    case UPDATE_PLAYER_LEVEL_STATUS:
      return {...state.player,
                levelStatus: action.payload
              };

    default:
      return state;
  }
}
