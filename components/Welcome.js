import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    WebView,
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';
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

  }

  componentDidMount(){
    console.log('-----------------------------------');
    //console.log('this.props in Welcome: ', this.props);
    console.log('-----------------------------------');
    console.log('this.props.currentPosition: in Welcome', this.props.currentPosition)

        // get data for all of user's fences in the background, so we have data even if user doesn't press MyFilters
    // if we do, will most likely need to use WebViewBridge on front end

    /* user will have two filter db collections:

    myFilters:

      {
        'xbh1234' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}],
        'ehb3929' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}],
        'pna4958' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}]
      }

    filtersCreated:

      {
        'xbh1234' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}]
      }



    */

  }

  handleCreate(){

    Actions.upload();

  }

  loadMyFilters(){

    Actions.myfilters();

  }

  render(){
    return (
      <View style={{flex:1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>

        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <Text style={{fontSize: 24 }}>
            Welcome!
          </Text>
        </View>

        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:50,
             width: 200,
             overflow:'hidden',
             borderRadius:4,
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
        </View>

        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:50,
             width: 200,
             overflow:'hidden',
             borderRadius:4,
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
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
    currentPosition: state.filterReducer.currentPosition
  }
}

const mapDispatchToProps = (dispatch) => {
  // let bound = bindActionCreators(filterActions, dispatch);
  // console.log('boundActionCreators in welcome: ', bound);
  return {
    filterActions: bindActionCreators(filterActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
  }
}

const Welcome = connect(mapStateToProps, mapDispatchToProps)(WelcomeComponent);
export default Welcome;



