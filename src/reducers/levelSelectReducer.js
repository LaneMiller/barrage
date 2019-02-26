import { CREATE_LEVEL_SELECT, UPDATE_LEVEL_SELECT } from '../actions/types';

const INIT_STATE = {}

export default function levelSelectReducer(state = INIT_STATE, action) {
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
