import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uploadActions from '../actions/uploadActions';
import * as filterActions from '../actions/filterActions';

import MapView from 'react-native-maps';
import Polygon from './Polygon';

import Icon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

/********************************************************************/

class CreateMapComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      polygon: false,
      lat: this.props.currentPosition.lat || 37.78825,
      lng: this.props.currentPosition.lng || -122.4324
    }
  //  this.getCoords = this.getCoords.bind(this);
  //  this.addPolygon = this.addPolygon.bind(this);
  }

  // addPolygon(){
  //   this.setState({
  //     polygon: !this.state.polygon
  //   })
  // }

  // getCoords(){
  //   navigator.geolocation.getCurrentPosition(     // will DEFINITELY have to redux this one
  //     (pos) => {
  //       this.setState({
  //         lat: pos.coords.latitude,
  //         lng: pos.coords.longitude
  //       })
  //     },
  //     (error) => console.log("Geolocation error: ", JSON.stringify(error)),
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  //   )
  // }

  componentDidMount(){
    console.log('CreateMap mounted.');
   // this.getCoords();
  }

  render(){
//<MapWithCoords polyCoords={polyCoords} polygon={this.state.polygon} lat={this.state.lat} lng={this.state.lng}/>
//      <TouchableNativeFeedback onLongPress={this.addPolygon}>
//      </TouchableNativeFeedback>
//          <Polygon lat={this.state.lat} lng={this.state.lng} />
    return(
        <View style={styles.container}>
          <View style={{position: 'absolute', top: 8, left: 10, width: 30, height: 30}}>
            <TouchableOpacity onPress={() => { 
              this.props.clearProps();
              Actions.loading(); 
            }}>
              <Icon name="home" size={30} color="#0c12ce" />
            </TouchableOpacity>
          </View>

          <View style={{position: 'absolute', top: 8, right: 10, width: 30,height:30}}>
            <Icon name="info" size={30} color="#0c12ce" />
          </View>

          <View style={styles.searchBoxContainer}>
            <View style={styles.searchBox}>
              <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16}}>Search Nearby Places</Text>
            </View>
          </View>
          <View style={styles.mapContainer} >
            <Polygon lat={this.state.lat} lng={this.state.lng} />
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight - 75,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f2'
  },
  mapContainer: {
    position: 'absolute',
    top: 50,
    left: 5,
    right: 5,
    bottom: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  searchBoxContainer: {
    height: 45, 
    position: 'absolute',
    top: 0,
    width: screenWidth,
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: 'black',
    //borderWidth: 1,
  },
  searchBox: {
    height: 40,
    width: screenWidth - 120,
    paddingTop: 8,
    paddingLeft: 50,
    borderColor: 'black',
    borderWidth: 1,
  },
  map: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2
  }
});

const mapStateToProps = (state) => {
  return {
    currentPosition: state.filterReducer.currentPosition,
    isValidatingCoords: state.uploadReducer.isValidatingCoords,
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    fenceCoordinates: state.uploadReducer.fenceCoordinates,
    fenceError: state.uploadReducer.fenceError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearProps: () => {
      uploadActions.clearUploadProps(dispatch);
    }
  }
}

const CreateMap = connect(mapStateToProps, mapDispatchToProps)(CreateMapComponent);
export default CreateMap;
