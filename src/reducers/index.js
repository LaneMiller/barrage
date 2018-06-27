 // level.catch.enemies format: [ {type: 'baddie',  health: 10, damage: 5, x: 780,
 // y: 100}, {type: 'baddie', health: 10, damage: 5, x: 900,
 // y: 11,}, {type: 'bigBaddie', health: 20, damage: 10, x: 1000,
 // y: 170,} ]

const initialState = {
  level: {
    bounds: {top: 9, bottom: 179, left: 770, right: 1132},
    exits: [],
    enemies: [ {type: 'baddie', health: 10, damage: 5, x: 780,
    y: 100}, {type: 'baddie', health: 10, damage: 5, x: 900,
    y: 11,}, {type: 'bigBaddie', health: 20, damage: 10, x: 1000,
    y: 170,} ]
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
    positioning: {
      height: 25,
      width: 25,
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

    case 'DAMAGE_PLAYER':
      return {...state, player:{...state.player, health:state.player.health - action.payload}}

    default:
      console.log("Returned state, no changes")
      return state
  }
}

export default reducer
