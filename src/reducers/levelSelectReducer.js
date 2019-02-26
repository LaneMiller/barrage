import { CREATE_LEVEL_SELECT, UPDATE_LEVEL_SELECT } from '../actions/types';

export default function levelSelectReducer(state = {}, action) {
  switch (action.type) {
    // levelSelect => {...levelSelect}
    case CREATE_LEVEL_SELECT:
      return action.payload;
    case UPDATE_LEVEL_SELECT:
      return action.payload;

    default:
      return state;
  }
}
