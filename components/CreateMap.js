import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableNativeFeedback,
} from 'react-native';

import MapView from 'react-native-maps';

import Polygon from './Polygon'

class MapWithCoords extends Component{
  constructor(props){
    super(props);
    // this.onRegionChange = this.onRegionChange.bind(this);
    // this.state = {
    //   region: {
    //     latitude: 37.78825,
    //     longitude: -122.4324,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421,
    //   }
    // }
  }
  // onRegionChange(region) {
  //   this.setState({ region });
  // }
  // componentWillReceiveProps(newProps, oldProps){
  //   console.log('newProps.lat: ', newProps.lat);
  // }
  render(){
    console.log('this.props.polygon: ', this.props.polygon);
    console.log('this.props.polyCoords: ', this.props.polyCoords);
    // console.log('this.props.lat ', this.props.lat);
    // console.log('this.props.lng ', this.props.lng);

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.props.lat || 37.78825,
            longitude: this.props.lng || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421}}
        >
        { this.props.polygon ? (<MapView.Polygon strokeWidth={2} fillColor={'#ffff00'} coordinates={this.props.polyCoords}/>) : (null)}
        </MapView>
      </View>
    )
  }
}
// let globalLat;
// let globalLng;
export default class CreateMap extends Component{
  constructor(props){
    super(props);
    this.state = {
      polygon: false,
      lat: 37.78825,
      lng: -122.4324
    }
    this.getCoords = this.getCoords.bind(this);
    this.addPolygon = this.addPolygon.bind(this);
  }

  addPolygon(){
    this.setState({
      polygon: !this.state.polygon
    })
  }

  getCoords(){
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
        // globalLat = pos.coords.latitude;
        // globalLng = pos.coords.longitude;
        // console.log('globalLat in getCoords ', globalLat);

        // this.forceUpdate();
          // this.setState({
          //   lat: pos.coords.latitude,
          //   lng: pos.coords.longitude
          // })

        // var initialPosition = JSON.stringify(pos);
        // this.setState({initialPosition});
      },
      (error) => console.log("Nav error: ", JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }

  componentDidMount(){
    this.getCoords();
  }

  render(){
    let topLeftLat = this.state.lat //- .00001;
    let topLeftLng = this.state.lng  - .01;// + .00001;
    let polyCoords = [
      {latitude: topLeftLat,longitude: topLeftLng },
      {latitude: topLeftLat - .005, longitude: topLeftLng },
      {latitude: topLeftLat - .005, longitude: topLeftLng + .009 },
      {latitude: topLeftLat, longitude: topLeftLng + .009 }
    ]
//<MapWithCoords polyCoords={polyCoords} polygon={this.state.polygon} lat={this.state.lat} lng={this.state.lng}/>
    return(
      <TouchableNativeFeedback onLongPress={this.addPolygon}>
        <View style={{flex: 1, backgroundColor: 'blue'}}>
          <Polygon lat={this.state.lat} lng={this.state.lng} />
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  map: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,

  }
});
