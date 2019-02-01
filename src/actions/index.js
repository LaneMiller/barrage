export function changeGameStatus(status) {
  return {type: 'CHANGE_GAME_STATUS', payload: status};
}

export function createLevelSelect(levelSelect) {
  return {type: 'CREATE_LEVEL_SELECT', payload: levelSelect};
}

export function setLevel(levelData) {
  return {type: 'SET_LEVEL', payload: levelData};
}

export function updateLevelSelect(levelSelectData) {
  return {type: 'UPDATE_LEVEL_SELECT', payload: levelSelectData};
}

export function readyNextLevel(nextLevelData) {
  return {type: 'READY_NEXT_LEVEL', payload: nextLevelData}
}

export function setPlayArea(dimensions) {
  return {type: 'SET_PLAY_AREA', payload: dimensions};
}

export function setEntrances(entryPoints) {
  return {type: 'SET_ENTRANCES', payload: entryPoints};
}

export function setPlayer(playerData) {
  return {type: 'SET_PLAYER', payload: playerData};
}

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

export function updatePlayerValue(valueObj) {
  return {type: 'UPDATE_PLAYER_VALUE', payload: valueObj}
}

export function updatePlayerLevelStatus(status) {
  return {type: 'UPDATE_PLAYER_LEVEL_STATUS', payload: status}
}

export function incrementWaveCount() {
  return {type: 'INCREMENT_WAVE'}
}
