 import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uploadActions from '../actions/uploadActions';
import * as filterActions from '../actions/filterActions';

import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

const ASPECT_RATIO = width / height;
const LATITUDE = 34.09829365;
const LONGITUDE = -118.35329142;
//const LATITUDE_DELTA = 0.0922;      //  default
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

const SPACE = 0.01; 

let dataToSend = {};

class PolygonComponent extends Component {
  constructor(props) {
    super(props);

    this.finish = this.finish.bind(this);
    this.startOver = this.startOver.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);

    this.state = {
      latitude: props.lat || LATITUDE,
      longitude: props.lng || LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      region: {
        latitude: props.lat || LATITUDE,
        longitude: props.lng || LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polygons: [],
      editing: null,
      polygonComplete: false,
      currPosition: null,
      markerPoints: [],
      place: false
    };
  }

  componentDidMount(){
    if(this.props.fenceCoordinates){
      this.setState({
        editing: {
          id: 0,
          coordinates: this.props.fenceCoordinates.fenceCoords
        }
      })
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.lat !== this.props.lat || newProps.lng !== this.props.lng){
      this.setState({
        latitude: newProps.lat,
        longitude: newProps.lng,
        region: {
            latitude: newProps.lat,
            longitude: newProps.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        },
        place: newProps.place
      });
    }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  finish() {
    const { polygons, editing } = this.state;

    setTimeout(() => {                             // REWRITE AS A PROMISE ( async/await )
      dataToSend = {
        fenceCoords: editing.coordinates,
        newMapRegion: this.state.region
      }
      this.props.submitFence(dataToSend);
    },400)

  }

  startOver(hasProps){
    if(hasProps){
      this.props.clearFenceProps();
    }
    this.setState({
      editing: null,
      polygons: [],
      markerPoints: []
    })
    this.forceUpdate();
  }

  onPress(e) {

    this.props.blurAutocomp();

    if(this.state.markerPoints.length < 4) {

      let currPoints = this.state.markerPoints;
      let idx = currPoints.length;
      currPoints.push({key:idx, lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude})

      this.setState({
        markerPoints: currPoints
      })

    }

    const { editing } = this.state;
    if (!editing && !this.state.polygons.length ) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else if(!this.state.polygons.length && this.state.editing.coordinates.length < 4){
      this.setState({
        editing: {
          ...editing,
          coordinates: [
            ...editing.coordinates,
            e.nativeEvent.coordinate,
          ],
        },
      });
    }
  }

  render() {
    if(this.state.editing && this.state.editing.coordinates.length > 2 ){
      //  console.log('-------------------------------');
    }

    const mapOptions = {
      scrollEnabled: true,
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
    }

    return (
      <View collapsable={false} ref="map" style={styles.container}>
        {(!this.state.editing && !this.state.polygons.length && !this.state.markerPoints.length)
          ?
          (
          <MapView

            showsMyLocationButton={true}
            showsPointsOfInterest={true}

            provider={this.props.provider}
            style={styles.map}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
            onPress={e => {
              this.onPress(e);
            }}
            {...mapOptions}>
            
              {this.state.place && (
                <MapView.Marker
                    pinColor={'red'}
                    onPress={() => {console.log('marker pressed')}}
                    coordinate={{
                      latitude: this.props.lat,
                      longitude: this.props.lng
                    }} />)
              }

            </MapView>
          )
            :
          (        
          <MapView

            showsMyLocationButton={true}
            showsPointsOfInterest={true}

            provider={ this.props.provider }
            style={ styles.map }
            region={this.state.region}
            onRegionChange={this.onRegionChange}
            onPress={e => {
              if(!this.props.chooseAreaComplete){
                this.onPress(e)
              }
            }}
            {...mapOptions}>

          {this.state.place &&
                  (<MapView.Marker
                        pinColor={'red'}
                        onPress={() => {console.log('marker pressed')}}
                        coordinate={{
                          latitude: this.props.lat,
                          longitude: this.props.lng
                        }} />
                    )
              }

              {this.state.polygons.map((polygon) => {
                return(<MapView.Polygon
                  key={polygon.id}
                  coordinates={polygon.coordinates}
                  strokeColor="#F00"
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={2}/>)
              }
              )}
              { this.state.editing && (
                <MapView.Polygon
                  coordinates={this.state.editing.coordinates}
                  strokeColor="#000"
                  fillColor="rgba(255,0,0,0.5)"
                  strokeWidth={2}/>
              )}
              {this.state.markerPoints.map((point) => { 
                  return(                
                    <MapView.Marker
                      key={point.key}
                      pinColor={'blue'}
                      onPress={() => {console.log('marker pressed')}}
                      coordinate={{
                        latitude: point.lat,
                        longitude: point.lng
                      }} />)
              })}

          </MapView>)
        }
          {this.props.fenceCoordinates
              ?
            (<View style={[styles.buttonContainer, {justifyContent: 'center'}]}>
              <TouchableOpacity
                onPress={() => this.startOver(true)}
                style={[styles.buttonStartOver, {width: 200 }]}>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>{"Discard & Start Over"}</Text>
              </TouchableOpacity>
            </View>)
              :
            this.state.editing && this.state.editing.coordinates.length > 2
              ?
            (<View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => this.startOver()}
                  style={styles.buttonStartOver}>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>Start Over</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.finish()}
                  style={styles.buttonFinish}>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>{"Submit"}</Text>
                </TouchableOpacity>
            </View>)
              :
            this.state.editing 
              ?
            (<View style={[styles.buttonContainer, {justifyContent: 'center'}]}>
                <TouchableOpacity
                  onPress={() => this.startOver()}
                  style={styles.buttonStartOver}>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>Start Over</Text>
                </TouchableOpacity>
            </View>)
              :
            (null)
          }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  buttonStartOver:{
    width: 120,
    height: 40,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'red',
    paddingHorizontal: 18,
    paddingTop: 4,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1
  },
  buttonFinish:{
    width: 120,
    height: 40,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'green',
    paddingHorizontal: 18,
    paddingTop: 4,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1
  },
  buttonContainer: {
    width: screenWidth - 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
});

const mapStateToProps = (state) => {
  return {
    currentPosition: state.filterReducer.currentPosition,
    isValidatingCoords: state.uploadReducer.isValidatingCoords,
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    fenceCoordinates: state.uploadReducer.fenceCoordinates,
    fenceError: state.uploadReducer.fenceError,
    selectedDates: state.uploadReducer.selectedDates,
    filterToUpload: state.uploadReducer.filterToUpload       // TEMPORARY
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearFenceProps: () => {
      uploadActions.clearFenceProps(dispatch);
    },
    submitFence: (coords) => {
      uploadActions.submitFenceCoordinates(dispatch, coords);
    }
  }
}

const Polygon = connect(mapStateToProps, mapDispatchToProps)(PolygonComponent);
export default Polygon;
