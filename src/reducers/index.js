import { combineReducers } from 'redux';
// reducers
import status from './statusReducer';
import currentLevel from './currentLevelReducer';
import levelSelect from './levelSelectReducer';
import level from './levelReducer';
import playArea from './playAreaReducer';
import entrances from './entrancesReducer';
import player from './playerReducer';

const rootReducer = combineReducers({
                      status,
                      currentLevel,
                      levelSelect,
                      level,
                      playArea,
                      entrances,
                      player
                    });

export default rootReducer;
