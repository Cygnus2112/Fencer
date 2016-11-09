import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView from 'react-native-maps';

//import WebViewBridge from 'react-native-webview-bridge';

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

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

    this.finish = this.finish.bind(this);
    this.startOver = this.startOver.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);

    this.state = {
      latitude: this.props.lat || LATITUDE,
      longitude: this.props.lng || LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      region: {
        latitude: this.props.lat || LATITUDE,
        longitude: this.props.lng || LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polygons: [],
      editing: null,
      polygonComplete: false,
      currPosition: null,
      markerPoints: [],
    };
  }

  componentDidMount(){
   // console.log('this.props.lat in Polygon component: ', this.props.lat);
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
        longitude: newProps.lng,
        region: {
            latitude: newProps.lat,
            longitude: newProps.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          
        }
      })
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(nextState.editing){
  //     if(nextState.editing.coordinates.length >= 4){
  //       console.log(nextState.editing.coordinates.length + ' coordinates')

  //       this.finish();

  //     }
  //   }
  //   return true;
  // }

  onRegionChange(region) {
    console.log('region in onRegionChange: ', region);
    this.setState({ region });
  }

  finish() {
    console.log('-------------------------------');
    console.log('this.finish called')

    const { polygons, editing } = this.state;

    this.setState({
      polygons: [...polygons, editing],
      editing: null,
    });
    console.log('-------------------------------');

    // setTimeout(() => {                    // THIS DOESN'T APPEAR IMMEDIATELY
    //   //console.log('polygons array (after setTimeout): ', this.state.polygons);
    //   for(let i=0; i < this.state.polygons[0].coordinates.length; i++){
    //     let coords = this.state.polygons[0].coordinates[i];
    //     console.log("coords.longitude: ",coords.longitude);
    //   }
    // },500)
  }

  startOver(){
    this.setState({
      editing: null,
      polygons: [],
      markerPoints: []
    })
    this.forceUpdate();
  }

  onPress(e) {
    console.log('e.nativeEvent.coordinate: ', e.nativeEvent.coordinate);
    console.log('this.state.markerPoints: ', this.state.markerPoints)

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

      // let coordsMap = this.state.editing.coordinates.map((coord) => {
      //   return [coord.latitude, coord.longitude];
      // })
      // let firstCoord = coordsMap[0];
      // coordsMap.push(firstCoord);

      console.log('-------------------------------');

      // GeoFencing.containsLocation(this.state.currPosition, coordsMap)
      //   .then(() => console.log('point is within polygon'))
      //   .catch(() => console.log('point is NOT within polygon'))

    }

    const mapOptions = {
      scrollEnabled: true,
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      //mapOptions.onPanDrag = e => this.onPress(e);
    }

    return (
      <View style={styles.container}>
        {(!this.state.editing && !this.state.polygons.length && !this.state.markerPoints.length)
          ?
          (
          <MapView
            provider={this.props.provider}
            style={styles.map}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
            onPress={e => this.onPress(e)}
            {...mapOptions}/>
          )
          :
          (        
          <MapView
            provider={ this.props.provider }
            style={ styles.map }
            region={this.state.region}
            onRegionChange={this.onRegionChange}
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
                  onPress={() => {console.log('marker pressed')}}
                  coordinate={{
                    latitude: point.lat,
                    longitude: point.lng
                  }}
                  pinColor={'blue'}/>)
          })}
        </MapView>
                    )
        }
          {this.state.editing && this.state.editing.coordinates.length > 2
            ?
            (<View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.startOver()}
                style={styles.buttonStartOver}>
                  <Text style={{fontSize: 18, color: 'white'}}>Start Over</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.finish()}
                style={styles.buttonFinish}>
                  <Text style={{fontSize: 18, color: 'white'}}>{"Submit"}</Text>
              </TouchableOpacity>
            </View>)
            :
            this.state.editing 
            ?
            (<View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.finish()}
                style={styles.buttonStartOver}>
                  <Text style={{fontSize: 18, color: 'white'}}>Start Over</Text>
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
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'red',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonFinish:{
    width: 120,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'green',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonContainer: {
    width: screenWidth - 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
});
