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

export function updateLevelPickups(pickups) {
  return {type: 'UPDATE_LEVEL_PICKUPS', payload: pickups}
}

export function changeAmmoValue(int) {
  return {type: 'CHANGE_AMMO_VALUE', payload: int};
}

export function changePlayerGun(gunObj) {
  return {type: 'CHANGE_GUN', payload: gunObj};
}

export function updatePlayerLevelStatus(status) {
  return {type: 'UPDATE_PLAYER_LEVEL_STATUS', payload: status}
}

export function incrementWaveCount() {
  return {type: 'INCREMENT_WAVE'}
}

export function readyNextLevel({levelId, level, startingX, startingY}) {
  return {type: 'READY_NEXT_LEVEL', payload: {levelId, level, startingX, startingY}}
}
