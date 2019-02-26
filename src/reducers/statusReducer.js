import { CHANGE_GAME_STATUS } from '../actions/types';

export default statusReducer(state = 'title', action) {
  switch (action.type) {
    // status => String
    case CHANGE_GAME_STATUS:
      return action.payload;

    default:
      return state;
  }
}
