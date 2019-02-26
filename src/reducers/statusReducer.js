import { CHANGE_GAME_STATUS } from '../actions/types';

const INIT_STATE = 'title';

export default function statusReducer(state = INIT_STATE, action) {
  switch (action.type) {
    // status => String
    case CHANGE_GAME_STATUS:
      return action.payload;

    default:
      return state;
  }
}
