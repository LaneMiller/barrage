import { SET_ENTRANCES } from '../actions/types';

const INIT_STATE = {
                      top: [402/2, -1],
                      left: [-1, 183/2],
                      bottom: [402/2, 183+1],
                      right: [402+1, 183/2],
                    }

export default entrancesReducer(state = INIT_STATE, action) {
  switch (action.type) {
    // entrances => { top: [], bottom: [], left: [], right: [] }
    case SET_ENTRANCES:
      return action.payload;

    default:
      return state;
  }
}
