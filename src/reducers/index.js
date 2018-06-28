 // level.catch.enemies format: [ {type: 'baddie',  health: 10, damage: 5, x: 780,
 // y: 100}, {type: 'baddie', health: 10, damage: 5, x: 900,
 // y: 11,}, {type: 'bigBaddie', health: 20, damage: 10, x: 1000,
 // y: 170,} ]

const initialState = {
  level: {
    bounds: {top: 9, bottom: 179, left: 770, right: 1132},
    exits: [],
    enemies: {
      1: {mobId: 1, type: 'patroller', health: 1, damage: 5, x: 780, y: 100, height: 15, width: 15, rotation: 0, walking: false,},
      2: {mobId: 2, type: 'patroller', health: 2, damage: 5, x: 900, y: 11, height: 15, width: 15, rotation: 90, walking: false,},
      3: {mobId: 3, type: 'follower', health: 2, damage: 10, x: 1000, y: 170,height: 20, width: 20, rotation: 270, walking: false,}
    }
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

  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYER_POS':
      return {...state, player:{...state.player, positioning:{...state.player.positioning, ...action.payload}}}

    case 'UPDATE_PLAYER_WALKING':
      return {...state, player:{...state.player, positioning:{...state.player.positioning, ...action.payload}}}

    case 'UPDATE_ENEMY_POS':
      return {...state, level:{...state.level, enemies:{...state.level.enemies, ...action.payload}}}

    case 'DAMAGE_PLAYER':
      return {...state, player:{...state.player, health:state.player.health - action.payload}}

    default:
      console.log("Returned state, no changes")
      return state
  }
}

export default reducer
