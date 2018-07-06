import React, { Component } from 'react';
import { connect } from 'react-redux';
import GunPickup from '../components/GunPickup';
import { changeAmmoValue, changePlayerGun, updateLevelPickups } from '../actions';

class Pickups extends Component {
  constructor(props) {
    super(props);

    this.pickupId = 1;
    this.state = {
      pickups: []
    };
  }

  componentDidMount() {
    setTimeout(this.spawnGunPickup, 5000);
  }
  shouldComponentUpdate(nextProps) {
    return (this.props.pickups !== nextProps.pickups);
  }

  iconOffsets = () => {
    const { top, bottom, left, right } = this.props.levelBounds;

    const adjTop = top + 8;
    const adjBottom = bottom + 5;
    const adjLeft = left - 28;
    const adjRight = right - 40;

    return {adjTop, adjBottom, adjLeft, adjRight}
  }

  spawnGunPickup = () => {
    const { adjTop, adjBottom, adjLeft, adjRight } = this.iconOffsets();
    const x = Math.floor(Math.random() * (adjRight - adjLeft + 1) + adjLeft);
    const y = Math.floor(Math.random() * (adjBottom - adjTop + 1) + adjTop);

    const guns = [
      {type: 'shotgun', damage: 10, ammo: 20, rate: 300},
      {type: 'particle', damage: 5, ammo: 100, rate: 50},
    ]
    const i = Math.floor(Math.random() * (guns.length))

    this.props.dispatch( updateLevelPickups([...this.props.pickups, <GunPickup pickupId={this.pickupId++} key={this.pickupId} derenderPickup={this.derenderPickup} pickupGun={this.getPickup} {...guns[i]} x={x} y={y} />]) )

    const delay = Math.floor(Math.random() * 2 + 1) * 10000
    setTimeout(this.spawnGunPickup, delay);
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
    gun: state.player.gun,
    levelBounds: state.level.bounds,
  }
}

export default connect(mapStateToProps)(Pickups);
