import React, { Component } from 'react';
import { connect } from 'react-redux';
import GunPickup from '../components/GunPickup';
import HealthPickup from '../components/HealthPickup';
import { changeAmmoValue, changePlayerGun, updateLevelPickups, updatePlayerValue } from '../actions';

class Pickups extends Component {
  constructor(props) {
    super(props);

    this.pickupId = 1;
  }

  componentDidMount() {
    setTimeout(this.spawnGunPickup, 5000);
    setTimeout(this.spawnHealthPickup, 6000)
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

  randomXY = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  spawnGunPickup = () => {
    const { adjTop, adjBottom, adjLeft, adjRight } = this.iconOffsets();
    const x = this.randomXY(adjLeft, adjRight);
    const y = this.randomXY(adjTop, adjBottom);

    const guns = [
      {type: 'shotgun', damage: 10, ammo: 20, rate: 300},
      {type: 'particle', damage: 5, ammo: 100, rate: 50},
    ]
    const i = Math.floor(Math.random() * (guns.length))

    this.props.dispatch( updateLevelPickups([...this.props.pickups, <GunPickup pickupId={this.pickupId++} key={this.pickupId} derenderPickup={this.derenderPickup} pickupGun={this.getPickup} {...guns[i]} x={x} y={y} />]) )

    const delay = Math.floor(Math.random() * 2 + 1) * 10000
    setTimeout(this.spawnGunPickup, delay);
  }

  spawnHealthPickup = () => {
    const { adjTop, adjBottom, adjLeft, adjRight } = this.iconOffsets();

    const x = this.randomXY(adjLeft, adjRight);
    const y = this.randomXY(adjTop, adjBottom);

    this.props.dispatch( updateLevelPickups([...this.props.pickups, <HealthPickup pickupId={this.pickupId++} key={this.pickupId} derenderPickup={this.derenderPickup} pickupHealth={this.getPickup} healing={10} x={x} y={y} />]) )

    const delay = Math.floor(Math.random() * 3 + 1) * 10000
    setTimeout(this.spawnHealthPickup, delay);
  }

  derenderPickup = (id) => {
    const pickups = this.props.pickups.filter(pickup => pickup.props.pickupId !== id);

    this.props.dispatch( updateLevelPickups(pickups) );
  }

  getPickup = (object, cat) => {
    this.derenderPickup(object.props.pickupId)

    if (cat === 'gun') {
      const { type, damage, ammo, rate } = object.props;

      if (this.props.gun.type === type) {
        this.props.dispatch( changeAmmoValue(ammo) );
      } else {
        this.props.dispatch( changePlayerGun({type, damage, ammo, rate}) );
      }
    } else if (cat === 'health') {
      const { healing } = object.props;
      if ((this.props.playerHealth + healing) > 100) {
        this.props.dispatch( updatePlayerValue({health: 100}) );
      } else {
        this.props.dispatch( updatePlayerValue({health: this.props.playerHealth + healing}) );
      }
    }
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
