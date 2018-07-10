const enemyTypes = {
  green: {
    type: 'green', health: 20, damage: 5, speed: 2, points: 100, height: 24, width: 13, walking: false,
  },
  purple: {
    type: 'purple', health: 50, damage: 10, speed: 3, points: 200, height: 24, width: 13, walking: false,
  },
  boss: {
    type: 'boss', health: 150, damage: 8, speed: 3, points: 1000, height: 100, width: 100, walking: false,
  },
}

export default enemyTypes;
