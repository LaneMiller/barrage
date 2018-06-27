const initialState = {
  level: {
    bounds: {top: 9, bottom: 179, left: 770, right: 1132},
    exits: [],
    enemies: [],
  },
  player: {
    health: 100,
    positioning: {
      x: 953,
      y: 90,
      rotation: 0,
      walking: false,
    }
  },
  enemy: {
    health: 100,
    positioning: {
      height: 25,
      width: 25,
      x: 900,
      y: 90,
      rotation: 0,
      walking: false,
    },
  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYER_POS':
      return {...state, player:{...state.player, positioning:{...state.player.positioning, ...action.payload}}}

    case 'UPDATE_PLAYER_WALKING':
        return {...state, player:{...state.player, positioning:{...state.player.positioning, ...action.payload}}}

    default:
      console.log("Returned state, no changes")
      return state
  }
}

export default reducer
