// const API_URL = `http://localhost:3000/api/v1`; // development
const API_URL = `https://barrage-backend.herokuapp.com/api/v1`; // deployment

const fetchAdapter = {
  handleStatusErrors: function (response) {
    if (!response.ok) {
      throw Error(`${response.status} (${response.statusText})`);
    }
    return response;
  },

  attemptFetch: function (fetchCB, resolve) {
    return fetchCB()
      .then(this.handleStatusErrors)
      .then(resolve)
      .catch(() => {
        return fetchCB()
          .then(this.handleStatusErrors)
          .then(resolve)
      })
  },

  fetchLevels: function () {
    const fetchCB = () => ( fetch(`${API_URL}/levels`) );
    const resolveCB = res => res.json()

    return this.attemptFetch(fetchCB, resolveCB)
  },

  createPlayer: function () {
    const passphrase = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);

    const fetchCB = () => {
        return fetch(`${API_URL}/users`, {
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
    }

    const resolveCB = res => {
      return res.json().then(this.formatPlayer)
    }

    return this.attemptFetch(fetchCB, resolveCB)
  },

  loadPlayer: function (passphrase) {
    const fetchCB = () => ( fetch(`${API_URL}/users/load/${passphrase}`) );

    const resolveCB = res => {
      return res.json().then(this.formatPlayer);
    };

    return this.attemptFetch(fetchCB, resolveCB);
  },

  savePlayer: function (player, level_id) {
    const { id, health, lives, score, kills, passphrase, difficulty } = player;

    const fetchCB = () => (fetch(`${API_URL}/users/${id}`, {
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
    }));

    const resolveCB = res => {
      return res.json().then(this.formatPlayer);
    };

    return this.attemptFetch(fetchCB, resolveCB);
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
