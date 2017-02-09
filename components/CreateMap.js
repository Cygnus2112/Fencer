import React, { Component } from 'react';

let {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

import {
    View,
    Image,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    ScrollView 
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
      lat: this.props.newMapRegion.latitude || this.props.currentPosition.lat || 37.78825,
      lng: this.props.newMapRegion.longitude || this.props.currentPosition.lng || -122.4324,
      infoPressed: !this.props.mapModalDismissed,
      placeSelected: false,
      blurAutocomp: false
    }
  //  this.getCoords = this.getCoords.bind(this);
  //  this.addPolygon = this.addPolygon.bind(this);
  }

  componentDidMount(){
   // console.log('CreateMap mounted.');
   // console.log('this.props.newMapRegion.latitude: ', this.props.newMapRegion.latitude);
   // this.getCoords();
  }

  componentWillReceiveProps(nextProps){
    // console.log('componentWillReceiveProps called in CreateMap');
    // console.log('nextProps: ', nextProps);
    // if(nextProps.chooseAreaComplete){
    //   console.log('nextProps.chooseAreaComplete');
    // }
  }

  render(){
    return(
        <View style={styles.container}>
          <View style={{position: 'absolute', top: 8, left: 10, width: 30, height: 30}}>
            <TouchableOpacity onPress={() => { 
              this.props.clearProps();
              Actions.loading({isStartup: false}); 
            }}>
              <Icon name="home" size={30} color="#0c12ce" />
            </TouchableOpacity>
          </View>

          <View style={{position: 'absolute', top: 8, right: 10, width: 30,height:30}}>
            <TouchableOpacity onPress={() => {this.setState({infoPressed: true})}} >
              <Icon name="info" size={30} color="#0c12ce" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer} >
            <Polygon lat={this.state.lat} lng={this.state.lng} place={this.state.placeSelected} blurAutocomp={() => this.setState({blurAutocomp: true})} />  
          </View>

          <View style={styles.searchBoxContainer}>
        {/*    <View style={styles.searchBox}>
              <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16}}>Search Nearby Places</Text>
            </View>   */}

      <GooglePlacesAutocomplete
        blurAutocomp={this.state.blurAutocomp}
        placeholder='Search Places'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        listViewDisplayed='auto'    // true/false/undefined
        fetchDetails={true}
        renderDescription={(row) => { 

          return row.terms[0].value + ' - ' + row.terms[1].value + ', ' + row.terms[2].value

        } 

        }// display street only
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          //console.log(data);
         // console.log('-----------------------------------');
         // console.log('details.geometry: ', details.geometry.location);
          this.setState({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
            placeSelected: true
          })
          console.log('-----------------------------------');
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyDT_EUBiOzMqTtcOmndgzbJ-vBYlRpFu1k',
          language: 'en', // language of the results
          //types: '(cities)', // default: 'geocode'
        }}
        styles={{
          container: {
            paddingTop: 0,
            zIndex: 150,
           // borderColor: 'black',
           // borderWidth: 1
          },
          textInputContainer: {
           // backgroundColor: 'rgba(0,0,0,0)',
            height: 40,
            borderTopWidth: 0,
            borderBottomWidth:0,
            borderRadius: 0,
            padding: 0
          },
          textInput: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            borderRadius: 0,
            height: 43,
            color: '#5d5d5d',
            fontSize: 16
          },
          poweredContainer: {
            height: 0
          },
          powered: {
            height: 0
          },
          row: {
            height: 30,
            padding: 5,
            backgroundColor: 'white'
          },
          description: {
            fontWeight: 'bold',


          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}

      //  currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      //  currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch

        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}

        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance'
        }}


        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

        //predefinedPlaces={[homePlace, workPlace]}
      />
          </View>

          {this.state.infoPressed
              ?
            (<InfoModal modalVisible={true} toggleModal={() => { 
                this.setState({ infoPressed: false});
                this.props.dismissMapModal();
              }} />)
              :
            (null)
          }
        </View>
    )
  }
}

class InfoModal extends Component {
  constructor(props){
    super(props);
    
    this.state = {
          modalVisible: this.props.modalVisible
      }
  }

  render(){
    return(
      <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { console.log("Modal has been closed.")}}>
            <View style={styles.modalContainer}>
              <View style={styles.infoModal}>
               <ScrollView contentContainerStyle={styles.modalScroll}>  
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, margin: 5}}>To begin choosing your geofence area, tap anywhere to set a point on the map. In order to be valid, a geofence must have a minimum of <Text style={{fontWeight: 'bold'}}>three</Text> points and a maximum of <Text style={{fontWeight: 'bold'}}>four</Text>.</Text>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('../assets/fence_thumbnail.png')} style={{width: 200}} resizeMode={"contain"}/>
                  </View>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, margin: 5}}>Tap <Text style={{fontWeight: 'bold'}}>Submit</Text> when finished or <Text style={{fontWeight: 'bold'}}>Start Over</Text> to discard your geofence and start again. </Text>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, margin: 5}}>To change a {"map's"} target area, use the search field or scroll to your preferred location.</Text> 
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, margin: 5}}>Location data contained in your geofence will be used to determine if a user is within your geofence area (and thus able to access your geofilter). GPS positioning on mobile devices isn't always precise, so it's best to err on the generous side when setting your geofence area.</Text>

                </ScrollView>   
                <TouchableHighlight 
                      style={{margin: 5,height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                      onPress={() => {
                        
                        this.props.toggleModal();
                        this.setState({modalVisible: !this.state.modalVisible})
                      }
                  }>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
                </TouchableHighlight>
              </View >
            </View>
      </Modal>
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
    borderWidth: 1
  },
  searchBoxContainer: {
    position: 'absolute',
    top: 0,
    left: 50,
    right: 50,
   // width: screenWidth,
    marginTop: 2,
 //   flexDirection: 'column',
 //   justifyContent: 'center',
 //   alignItems: 'center',
     borderColor: 'black',
   borderWidth: 1,
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
  },
  modalContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  infoModal: {
    position: 'absolute', 
    top: 60, 
    left:40, 
    right: 40, 
    bottom: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
   // padding: 10
  },
  modalScroll: {
    margin:10,
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor:'white'
  }
});

const mapStateToProps = (state) => {
  return {
    currentPosition: state.filterReducer.currentPosition,
    isValidatingCoords: state.uploadReducer.isValidatingCoords,
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    fenceCoordinates: state.uploadReducer.fenceCoordinates,
    fenceError: state.uploadReducer.fenceError,
    mapModalDismissed: state.uploadReducer.mapModalDismissed,
    newMapRegion: state.uploadReducer.newMapRegion
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearProps: () => {
      uploadActions.clearUploadProps(dispatch);
    },
    dismissMapModal: () => {
      uploadActions.dismissMapModal(dispatch);
    }
  }
}

const CreateMap = connect(mapStateToProps, mapDispatchToProps)(CreateMapComponent);
export default CreateMap;
