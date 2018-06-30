const initialState = {
  level: {
    bounds: {top: 25, bottom: 192, left: 758, right: 1145},
    exits: [],
    enemies: {
      1: {mobId: 1, type: 'patroller', health: 20, damage: 5, x: 780, y: 100, height: 24, width: 13, rotation: 0, walking: false,},
      2: {mobId: 2, type: 'patroller', health: 20, damage: 5, x: 900, y: 35, height: 24, width: 13, rotation: 90, walking: false,},
      3: {mobId: 3, type: 'follower', health: 20, damage: 10, x: 1000, y: 170, height: 24, width: 13, rotation: 270, walking: false,}, 4: {mobId: 4, type: 'follower', health: 20, damage: 10, x: 900, y: 170, height: 24, width: 13, rotation: 180, walking: false,}
    }
  },
  player: {
    health: 100,
    positioning: {
      x: 952,
      y: 111,
      rotation: 0,
      walking: false,
    },
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

    case 'DAMAGE_ENEMY':
      return {...state, level:{...state.level, enemies:{...state.level.enemies, ...action.payload}}}

    default:
      console.log("Returned state, no changes")
      return state
  }
}

export default reducer
