export function updatePlayerPos(pos) {
  return {type: 'UPDATE_PLAYER_POS', payload: pos};
}

export function updatePlayerWalking(bool) {
  return {type: 'UPDATE_PLAYER_WALKING', payload: {walking: bool} };
}

export function updateEnemyPos(pos) {
  return {type: 'UPDATE_ENEMY_POS', payload: pos};
}

export function damagePlayer(int) {
  return {type: 'DAMAGE_PLAYER', payload: int};
}

export function damageEnemy(int) {
  return {type: 'DAMAGE_ENEMY', payload: int};
}

export function removeEnemy(remaining) {
  return {type: 'REMOVE_ENEMY', payload: remaining};
}

export function increaseScore(int) {
  return {type: 'INCREASE_SCORE', payload: int};
}

export function increaseKillScore(int) {
  return {type: 'INCREASE_KILL_SCORE', payload: int};
}
