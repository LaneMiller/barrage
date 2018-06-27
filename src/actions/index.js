export function updatePlayerPos(pos) {
  return {type: 'UPDATE_PLAYER_POS', payload: pos }
}

export function updatePlayerWalking(bool) {
  return {type: 'UPDATE_PLAYER_WALKING', payload: {walking: bool} }
}
