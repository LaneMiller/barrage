import React, { Component } from 'react';
import { connect } from 'react-redux';
import GunPickup from '../components/GunPickup';
import HealthPickup from '../components/HealthPickup';
import PointsPickup from '../components/PointsPickup';
import { changeAmmoValue, changePlayerGun, updateLevelPickups, updatePlayerValue } from '../actions';

class Pickups extends Component {
  constructor(props) {
    super(props);

    this.pickupId = 1;
  }

  componentDidMount() {
    setTimeout(this.spawnGunPickup, 5000);
    setTimeout(this.spawnPickup, 7000)
  }
  shouldComponentUpdate(nextProps) {
    return (this.props.pickups !== nextProps.pickups);
  }

  iconOffsets = () => {
    const { top, bottom, left, right } = this.props.levelBounds;

    const adjTop = top + 8;
    const adjBottom = bottom + 5;
    const adjLeft = left - 20;
    const adjRight = right - 40;

    return {adjTop, adjBottom, adjLeft, adjRight};
  }

  randomIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  spawnGunPickup = () => {
    const { adjTop, adjBottom, adjLeft, adjRight } = this.iconOffsets();
    const x = this.randomIntInRange(adjLeft, adjRight);
    const y = this.randomIntInRange(adjTop, adjBottom);

    const guns = [
      {type: 'shotgun', damage: 10, ammo: 20, rate: 300},
      {type: 'particle', damage: 5, ammo: 100, rate: 50},
    ]
    const i = Math.floor(Math.random() * (guns.length))

    this.props.dispatch( updateLevelPickups([...this.props.pickups, <GunPickup key={this.pickupId++} pickupId={this.pickupId} derenderPickup={this.derenderPickup} pickupGun={this.getPickup} {...guns[i]} x={x} y={y} />]) )

    const delay = this.randomIntInRange(1, 2) * 10000
    setTimeout(this.spawnGunPickup, delay);
  }

  spawnPickup = () => {
    const { adjTop, adjBottom, adjLeft, adjRight } = this.iconOffsets();
    const x = this.randomIntInRange(adjLeft, adjRight);
    const y = this.randomIntInRange(adjTop, adjBottom);

    const i = Math.round(Math.random())
    let pickup;

    if (i === 0) {
      pickup = <HealthPickup key={this.pickupId++}
          pickupId={this.pickupId}
          derenderPickup={this.derenderPickup}
          pickupHealth={this.getPickup}
          healing={10} x={x} y={y} />
    } else {
      pickup = <PointsPickup key={this.pickupId++}
          pickupId={this.pickupId}
          derenderPickup={this.derenderPickup}
          pickupPoints={this.getPickup}
          points={150} x={x} y={y} />
    }

    this.props.dispatch(
      updateLevelPickups([...this.props.pickups, pickup])
    )

    const delay = this.randomIntInRange(1, 2) * 10000
    setTimeout(this.spawnPickup, delay);
  }

  derenderPickup = (id) => {
    const pickups = this.props.pickups.filter(pickup => pickup.props.pickupId !== id);

    this.props.dispatch( updateLevelPickups(pickups) );
  }

  getPickup = (object, cat) => {
    const { playerScore } = this.props;
    this.derenderPickup(object.props.pickupId)

    if (cat === 'gun') {
      const { type, damage, ammo, rate } = object.props;

      if (this.props.gun.type === type) {
        this.props.dispatch( changeAmmoValue(ammo) );
      } else {
        this.props.dispatch( changePlayerGun({type, damage, ammo, rate}) );
      }
      this.props.dispatch(
        updatePlayerValue({score: playerScore + 25})
      );
    } else if (cat === 'health') {
      const { healing } = object.props;
      let health,
          score = playerScore + 25;

      if ((this.props.playerHealth + healing) > 100) {
        health = 100;
      } else {
        health = this.props.playerHealth + healing;
      }

      this.props.dispatch(
        updatePlayerValue({health, score})
      );
    } else if (cat === 'points') {
      const { points } = object.props;
      this.props.dispatch(
        updatePlayerValue({score: playerScore + points})
      );
    };
  }

 render() {
   const pickups = this.props.pickups.length > 0 ? this.props.pickups : null;

   return (
     <div id="pickups">
       {pickups}
     </div>
   )
 }
}

const mapStateToProps = (state) => {
  return {
    pickups: state.level.pickups,
    playerHealth: state.player.health,
    playerScore: state.player.score,
    gun: state.player.gun,
    levelBounds: state.level.bounds,
  }
}

export default connect(mapStateToProps)(Pickups);
