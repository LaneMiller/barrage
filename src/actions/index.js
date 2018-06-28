export function updatePlayerPos(pos) {
  return {type: 'UPDATE_PLAYER_POS', payload: pos}
}

export function updatePlayerWalking(bool) {
  return {type: 'UPDATE_PLAYER_WALKING', payload: {walking: bool} }
}

export function updateEnemyPos(pos) {
  return {type: 'UPDATE_ENEMY_POS', payload: pos}
}

export function damagePlayer(int) {
  return {type: 'DAMAGE_PLAYER', payload: int}
}
