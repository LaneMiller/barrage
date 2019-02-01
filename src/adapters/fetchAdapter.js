const fetchAdapter = {
  fetchLevels: function () {
    return fetch(`http://localhost:3000/api/v1/levels`)
      .then(res => res.json())
  },

  createPlayer: function () {
    const passphrase = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);

    return fetch(`http://localhost:3000/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        health: 100,
        lives: 2,
        score: 0,
        kills: 0,
        passphrase,
        level_id: 1,
        })
    })
      .then(res => res.json())
      .then(this.formatPlayer)
  },

  loadPlayer: function (passphrase) {
    return fetch(`http://localhost:3000/api/v1/users/load/${passphrase}`)
      .then(res => res.json())
      .then(this.formatPlayer)
  },

  savePlayer: function (player, level_id) {
    const { id, health, lives, score, kills, passphrase, difficulty } = player;

    return fetch(`http://localhost:3000/api/v1/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        health,
        lives,
        score,
        kills,
        passphrase,
        difficulty,
        level_id,
        })
    })
      .then(res => res.json())
      .then(this.formatPlayer)
  },

  formatPlayer: function (data) {
    if (data.error) {
      throw data.error;
    } else {
      const player = {
        ...data,
        bonus: 0,
        gun: {type: 'pistol', damage: 5, rate: 300},
        positioning: {
          x: 505,
          y: 500,
          rotation: 0,
          walking: false,
        },
        levelStatus: 'active',
      }

      return player;
    }
  }
}

export default fetchAdapter;
