import { SET_LEVEL, READY_NEXT_LEVEL } from '../actions/types';

export default function currentLevelReducer(state = 1, action) {
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
