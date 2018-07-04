import React, { Component } from 'react';
import { connect } from 'react-redux';
import GunPickup from '../components/GunPickup';
import { changeAmmoValue, changePlayerGun } from '../actions';

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
  shouldComponentUpdate(nP, nextState) {
    return (this.state.pickups !== nextState.pickups);
  }

  iconOffsets = () => {
    const { top, bottom, left, right } = this.props.levelBounds;

    const adjTop = top + 8;
    const adjBottom = bottom + 8;
    const adjLeft = left - 28;
    const adjRight = right - 30;

    return {adjTop, adjBottom, adjLeft, adjRight}
  }

  spawnGunPickup = () => {
    const { adjTop, adjBottom, adjLeft, adjRight } = this.iconOffsets();
    const x = Math.floor(Math.random() * (adjRight - adjLeft + 1) + adjLeft);
    const y = Math.floor(Math.random() * (adjBottom - adjTop + 1) + adjTop);

    const guns = [
      {type: 'shotgun', damage: 10, ammo: 20},
    ]
    const i = Math.floor(Math.random() * (guns.length))

    this.setState({
      pickups: [...this.state.pickups, <GunPickup pickupId={this.pickupId++} key={this.pickupId} pickupGun={this.getPickup} type={guns[i].type} damage={guns[i].damage} ammo={guns[i].ammo} x={x} y={y} />]
    });

    const delay = Math.floor(Math.random() * 2 + 1) * 10000
    setTimeout(this.spawnGunPickup, delay);
  }

  iconOffsets = () => {
    const { top, bottom, left, right } = this.props.levelBounds;

    const adjTop = top + 8;
    const adjBottom = bottom + 8;
    const adjLeft = left - 28;
    const adjRight = right - 30;

    return {adjTop, adjBottom, adjLeft, adjRight}
  }

  getPickup = (object, cat) => {
    const pickups = this.state.pickups.filter(pickup => pickup.props.pickupId !== object.props.pickupId);

    this.setState({ pickups });

    if (cat === 'gun') {
      const { type, damage, ammo } = object.props;

      if (this.props.gun.type === type) {
        this.props.dispatch( changeAmmoValue(ammo) );
      } else {
        this.props.dispatch( changePlayerGun({type, damage, ammo}) );
      }
    }
  }

 render() {
   const pickups = this.state.pickups.length > 0 ? this.state.pickups : null

   return (
     <div id="pickups">
       {pickups}
     </div>
   )
 }
}

const mapStateToProps = (state) => {
  return {
    gun: state.player.gun,
    levelBounds: state.level.bounds,
  }
}

export default connect(mapStateToProps)(Pickups);
