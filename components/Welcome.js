
import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    WebView,
    Dimensions,
    TouchableOpacity,
    Linking,
    Alert
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

//import Share from 'react-native-share';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';

import LoginModal from './LoginModal';

const queryString = require('query-string');

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

console.log('screenHeight: ', screenHeight);
console.log('screenWidth: ', screenWidth);

// Will need to 
//    1) Grab current location from navigator;
//    2) Grab fence coords ( ** Google overlay getPath() ** )for every event that is 'active' (ie, within date/time)
//          -- overlay object will be added when event is created
//    3) Send current location and overlay coords to WebView
//    4) Create google LatLng obj, eg -- let myLatLng = new google.maps.LatLng({lat: 34.09824505, lng: -118.35318196}); 
//    5) calculate:  let isInsideBounds = google.maps.geometry.poly.containsLocation(myLatLng, e.overlay)
//    6) send isInsideBounds back to component / parent
//          -- this may take some time, but that's okay, since speed isn't *that* important here
//          -- rxjs and sockets might help speed this stuff up
//          -- can reduxify some of this, but Geometry/isInBounds calculation MUST be done in browser, because Google

        
class WelcomeComponent extends Component{
  constructor(props){
    super(props);

    this.handleCreate = this.handleCreate.bind(this);
    this.loadMyFilters = this.loadMyFilters.bind(this);

    this.state = {
      showLoginModal: false
    }

  }

  componentDidMount(){
    //console.log('mounting Welcome...');
    //console.log('this.props.myFilters: ', this.props.myFilters);

   // if the user is not logged in and they were referred by a deep link, we need to redirect them to a sign-up page.

   //  MOVED DEEP LINK LOGIC TO LOADING COMPONENT FOR THE TIME BEING

    // Linking.getInitialURL().then((url) => {
    //     console.log(`Deep Link URL: ${url}`);
    //   //  if(url) {
    //     // if(!this.props.isLoggedIn){
    //         // redirect to dedicated "referal signup" view. filter id will be passed as prop and then added on successful signup/login.
    //    // } else {
    //   const parsed = queryString.parse(url);

    //   for(filter in parsed){
    //       console.log('filter ID from url: ', parsed[filter]);
    //       this.props.addFilter(parsed[filter])
    //   }

    // }).catch(err => console.error('An error occurred', err));

   // console.log('this.props in Welcome: ', this.props);
    console.log('-----------------------------------');
    console.log('this.props.currentPosition: in Welcome', this.props.currentPosition)

        // get data for all of user's fences in the background, so we have data even if user doesn't press MyFilters
    // if we do, will most likely need to use WebViewBridge on front end

  }

  handleCreate(){

    Actions.upload();

  }

  loadMyFilters(){

    if(this.isLoggedIn){
      this.props.loadMyFilters();
    } else {
      Alert.alert('Oops!', 'You must be logged in to access My Geofilters. Tap Login to continue.', [{text: 'OK', onPress: () => console.log('OK Pressed!')}])
    }

    

  }

        //   <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
        //   <View style={{
        //      justifyContent: 'center',
        //      alignItems: 'center',
        //      padding:10,
        //      margin: 5,
        //      height:50,
        //      width: 200,
        //      overflow:'hidden',
        //      borderRadius:4,
        //      borderWidth:2,
        //      borderColor: 'black',
        //      backgroundColor: 'blue',
        //    }}>
        //       <Button
        //         style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}
        //         styleDisabled={{color: 'red'}}
        //         onPress={ this.handleCreate }>
        //         Create New Geofilter
        //       </Button>
        //   </View>
        // </View>

        // <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
          // <View style={{
          //    justifyContent: 'center',
          //    alignItems: 'center',
          //    padding:10,
          //    margin: 5,
          //    height:50,
          //    width: 200,
          //    overflow:'hidden',
          //    borderRadius:4,
          //    borderWidth:2,
          //    borderColor: 'black',
          //    backgroundColor: 'blue',
          //  }}>
          //     <Button
          //       style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}
          //       styleDisabled={{color: 'red'}}
          //       onPress={ this.loadMyFilters } >
          //       My Geofilters
          //     </Button>
          // </View>
        // </View>

  render(){
    return (
      <View style={{flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>

        <View style={styles.fakeNavBar}>
          <Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
            <Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} /> 
          </Image>
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',height: (screenHeight/2) - 62, width: screenWidth,borderBottomWidth:1,borderBottomColor: 'black'}}>
          <Image source={require('../assets/map_with_pin_color.png')} style={{height: (screenHeight/2) - 62, width: screenWidth}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             marginTop: 10,
             marginLeft: 10,
             height:70,
             width: 110,
             overflow:'hidden',
             borderRadius:15,
             borderWidth:2,
             borderColor: 'black',
             backgroundColor: 'blue',
           }}>
              <Button
                style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}
                styleDisabled={{color: 'red'}}
                onPress={ this.handleCreate }>
                Create New Geofilter
              </Button>
          </View>

          </Image>
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',height: (screenHeight/2) - 62, width: screenWidth,borderTopWidth:1,borderTopColor: 'black'}}>
          <Image source={require('../assets/balloons.jpeg')} style={{height: (screenHeight/2) - 62, width: screenWidth}} >
          <View style={{
             position: 'absolute', 
             right: 10,
             top: 150,
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:70,
             width: 110,
             overflow:'hidden',
             borderRadius:15,
             borderWidth:2,
             borderColor: 'black',
             backgroundColor: 'blue',
           }}>
              <Button
                style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}
                styleDisabled={{color: 'red'}}
                onPress={ this.loadMyFilters } >
                My Geofilters
              </Button>
          </View>
          </Image>
        </View>



        {!this.props.isLoggedIn 
          ?
          (   
            <TouchableOpacity onPress={ ( ) => {
                    this.setState({
                      showLoginModal: !this.state.showLoginModal
                    })
                  } 
                }>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',height: 50, width: screenWidth, borderWidth:2,borderColor: 'black',backgroundColor: 'blue'}}>
                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}> Login </Text>
              </View>
            </TouchableOpacity>
          )
          :
          (
            <TouchableOpacity onPress={ ( ) => {

                this.props.logout();

                  } 
              }>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center',height: 50, width: screenWidth, borderWidth:2,borderColor: 'black',backgroundColor: 'blue'}}>
                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}> Logout </Text>
              </View>
            </TouchableOpacity>
          )

        }

        {this.state.showLoginModal
          ?
          (<LoginModal modalVisible={true} toggleModal={() => {this.setState( {showLoginModal:false}) } } />)
          :
          (null)
        }

      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
    username: state.authReducer.username,
    currentPosition: state.filterReducer.currentPosition,
    bitlyURL: state.uploadReducer.bitlyURL,
    finalSubmitComplete: state.uploadReducer.finalSubmitComplete,
    myFilters: state.authReducer.myFilters 
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      authActions.logout(dispatch)
    },
    addFilter: (filter) => {
      filterActions.addFilterByID(filter)
    },
    loadMyFilters: () => {
      authActions.loadMyFilters(dispatch);
    }
  }
}

const Welcome = connect(mapStateToProps, mapDispatchToProps)(WelcomeComponent);
export default Welcome;

const styles = StyleSheet.create({
  fakeNavBar:{
    height: 50,
    width: screenWidth,
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 4
  }
})


