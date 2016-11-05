import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView from 'react-native-maps';

import WebViewBridge from 'react-native-webview-bridge';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 34.09829365;
const LONGITUDE = -118.35329142;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

const SPACE = 0.01; 

export default class Polygon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.lat || LATITUDE,
      longitude: this.props.lng || LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      polygons: [],
      editing: null,
      currPosition: null,
    };
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        let point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.setState({
          currPosition: point
        })
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  componentWillReceiveProps(newProps, oldProps){
    if(newProps.lat !== oldProps.lat || newProps.lng !== oldProps.lng){
      this.setState({
        latitude: newProps.lat,
        longitude: newProps.lng
      })
    }
  }

  finish() {
    const { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
    });
  }

  onPress(e) {
    const { editing } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else {
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

      // let coordsMap = this.state.editing.coordinates.map((coord) => {
      //   return [coord.latitude, coord.longitude];
      // })
      // let firstCoord = coordsMap[0];
      // coordsMap.push(firstCoord);
      // console.log('-------------------------------');

      // console.log('coordsMap in RENDER: ', coordsMap);
      console.log('this.state.currPosition in RENDER: ', this.state.currPosition)


      // GeoFencing.containsLocation(this.state.currPosition, coordsMap)
      //   .then(() => console.log('point is within polygon'))
      //   .catch(() => console.log('point is NOT within polygon'))

    }

    const mapOptions = {
      scrollEnabled: true,
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    }

    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          region={{
            latitude: this.state.latitude || LATITUDE,
            longitude: this.state.longitude || LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          onPress={e => this.onPress(e)}
          {...mapOptions}
        >
          {this.state.polygons.map(polygon => (
            <MapView.Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={2}/>
          ))}
          {this.state.editing && (
            <MapView.Polygon
              coordinates={this.state.editing.coordinates}
              strokeColor="#000"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={2}/>
          )}
          {this.state.currPosition && (
            <MapView.Marker
              onPress={() => {console.log('marker pressed')}}
              coordinate={{
                latitude: this.state.currPosition.lat,
                longitude: this.state.currPosition.lng,
              }}
              centerOffset={{ x: -18, y: -60 }}
              anchor={{ x: 0.69, y: 1 }}>
              <Text style={{fontSize: 18}}>X</Text>
            </MapView.Marker>
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <View>
              <TouchableOpacity
                onPress={() => this.finish()}
                style={[styles.bubble, styles.button]}
              >
                <Text>Start Over</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.finish()}
                style={[styles.bubble, styles.button]}
              >
                <Text>Finish</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

// Polygon.propTypes = {
//   provider: MapView.ProviderPropType,
// };

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
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
