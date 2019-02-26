import * as Types from './types';

export function changeGameStatus(status) {
  return {type: Types.CHANGE_GAME_STATUS, payload: status};
}

export function createLevelSelect(levelSelect) {
  return {type: Types.CREATE_LEVEL_SELECT, payload: levelSelect};
}

export function setLevel(levelData) {
  return {type: Types.SET_LEVEL, payload: levelData};
}

export function updateLevelSelect(levelSelectData) {
  return {type: Types.UPDATE_LEVEL_SELECT, payload: levelSelectData};
}

export function readyNextLevel(nextLevelData) {
  return {type: Types.READY_NEXT_LEVEL, payload: nextLevelData}
}

export function setPlayArea(dimensions) {
  return {type: Types.SET_PLAY_AREA, payload: dimensions};
}

export function setEntrances(entryPoints) {
  return {type: Types.SET_ENTRANCES, payload: entryPoints};
}

export function setPlayer(playerData) {
  return {type: Types.SET_PLAYER, payload: playerData};
}

export function updatePlayerPos(pos) {
  return {type: Types.UPDATE_PLAYER_POS, payload: pos};
}

export function updatePlayerWalking(bool) {
  return {type: Types.UPDATE_PLAYER_WALKING, payload: {walking: bool} };
}

export function updateEnemyPos(pos) {
  return {type: Types.UPDATE_ENEMY_POS, payload: pos};
}

export function damagePlayer(int) {
  return {type: Types.DAMAGE_PLAYER, payload: int};
}

export function damageEnemy(int) {
  return {type: Types.DAMAGE_ENEMY, payload: int};
}

export function removeEnemy(remaining) {
  return {type: Types.REMOVE_ENEMY, payload: remaining};
}

export function increaseScore(int) {
  return {type: Types.INCREASE_SCORE, payload: int};
}

export function increaseKillScore(int) {
  return {type: Types.INCREASE_KILL_SCORE, payload: int};
}

export function updateLevelPickups(pickups) {
  return {type: Types.UPDATE_LEVEL_PICKUPS, payload: pickups}
}

export function changeAmmoValue(int) {
  return {type: Types.CHANGE_AMMO_VALUE, payload: int};
}

export function changePlayerGun(gunObj) {
  return {type: Types.CHANGE_GUN, payload: gunObj};
}

export function updatePlayerValue(valueObj) {
  return {type: Types.UPDATE_PLAYER_VALUE, payload: valueObj}
}

export function updatePlayerLevelStatus(status) {
  return {type: Types.UPDATE_PLAYER_LEVEL_STATUS, payload: status}
}

export function incrementWaveCount() {
  return {type: Types.INCREMENT_WAVE}
}
