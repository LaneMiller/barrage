import { SET_PLAY_AREA } from '../actions/types';

const INIT_STATE = { width: 402, height: 183 };

export default function playAreaReducer(state = INIT_STATE, action) {
  switch (action.type) {
    // playArea => { width: Integer, height: Integer}
    case SET_PLAY_AREA:
      return action.payload;

    default:
      return state;
  }
}
