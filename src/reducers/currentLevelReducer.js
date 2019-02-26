import { SET_LEVEL, READY_NEXT_LEVEL } from '../actions/types';

const INIT_STATE = 1;

export default function currentLevelReducer(state = INIT_STATE, action) {
  switch (action.type) {
    // currentLevel => Integer
    case SET_LEVEL:
      return action.payload.levelId;
    case READY_NEXT_LEVEL:
      return action.payload.levelId;

    default:
      return state;
  }
}
