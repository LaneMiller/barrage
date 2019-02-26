import { SET_PLAY_AREA } from '../actions/types';

export default playAreaReducer(state = { width: 402, height: 183 }, action) {
  switch (action.type) {
    // playArea => { width: Integer, height: Integer}
    case SET_PLAY_AREA:
      return action.payload;

    default:
      return state;
  }
}
