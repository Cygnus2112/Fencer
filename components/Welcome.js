
import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    Alert,
    Modal,
    ScrollView,
    TouchableHighlight
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Entypo';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';

import LoginModal from './LoginModal';

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

//console.log('screenHeight: ', screenHeight);
//console.log('screenWidth: ', screenWidth);
        
class WelcomeComponent extends Component{
  constructor(props){
    super(props);

    this.handleCreate = this.handleCreate.bind(this);
    this.loadMyFilters = this.loadMyFilters.bind(this);

    this.state = {
      showLoginModal: false,
      infoPressed: false
    }

  }

  componentDidMount(){
   // console.log('this.props.username: ', this.props.username);
   // console.log('this.props.isLoggedIn: ', this.props.isLoggedIn);
  // console.log('this.props.searchError in Welcome: ', this.props.searchError);

    if(!this.props.username && !this.props.welcomeModalDismissed){
      this.setState({ infoPressed: true});
    }

    if(this.props.isReferral){
      setTimeout(() => {
        Alert.alert('New Geofilter Added!', 'Tap My Filters to access your new geofilter.', 
          [{text: 'OK', onPress: () => { 
              this.props.clearNewFilter();
              console.log('OK Pressed!');
            }}])
    

      },300)
     
    }

    if(this.props.searchError){

      let errorCode;

      if(this.props.searchErrorCode === 'NOTFOUND') {
        errorCode = 'Geofilter Not Found';
      } else if(this.props.searchErrorCode === 'ALREADYADDED'){
        errorCode = 'Geofilter Already Added';
      } else {
        errorCode = 'Geofilter Expired';
      }

      Alert.alert(errorCode, this.props.searchErrorMessage, [{text: 'OK', onPress: () => {
            // clear prop

            this.props.clearSearchError();

            console.log('OK Pressed!');
          }
        }])
    }

   // console.log('this.props in Welcome: ', this.props);
  //  console.log('-----------------------------------');
  //  console.log('this.props.currentPosition: in Welcome', this.props.currentPosition)

  }

  handleCreate(){

    Actions.upload();

  }

  loadMyFilters(){

    if(this.props.isLoggedIn){
      this.props.loadMyFilters();
    } else {
      Alert.alert('Oops!', 'You must be logged in to access My Geofilters. Tap Login to continue.', [{text: 'OK', onPress: () => console.log('OK Pressed!')}])
    
    }

    

  }


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
                <View style={{position: 'absolute', top: 8, right: 10, width: 30,height:30}}>
                    <TouchableOpacity onPress={() => {this.setState({infoPressed: true})}} >
                      <Icon name="info" size={30} color="#0c12ce" />
                    </TouchableOpacity>
                </View>
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
             bottom: 10,
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
                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}>Sign In</Text>
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
                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}>Sign Out</Text>
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

      {this.state.infoPressed
        ?
      (<InfoModal modalVisible={true} dismissWelcomeModal={ this.props.dismissWelcomeModal } toggleModal={() => { this.setState({ infoPressed: false}) }} />)
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
//<View style={styles.infoModal}>
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
                  <View style={{position: 'absolute', left: 10,right:10, height: 35, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{textAlign: 'center', fontFamily: 'RobotoCondensed-Regular', textDecorationLine: 'underline', fontSize: 20, paddingLeft: 6}}>Welcome!</Text>
                  </View>
                  <Text style={{marginTop: 40, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>Fencer is a fun new way to create and share your very own Snapchat Geofilters - for free!</Text>
                  <View style={{marginTop: 5, position: 'absolute', left: 10,right:10, height: 35}}>
                    <Text style={{textAlign: 'center', fontFamily: 'RobotoCondensed-Regular', textDecorationLine: 'underline', fontSize: 16, paddingLeft: 6}}>{"What are Geofilters?"}</Text>
                  </View>
                  <Text style={{marginTop: 30, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>Geofilters are location-based overlays that you can apply to any photo you take with your mobile camera. {"They're"} a great way to add a unique touch to birthday parties, graduations, or any other shared experiences you wish to commemorate in a fun and memorable way.</Text>
                   <View style={{position: 'absolute', left: 10,right:10, height: 25}}>
                    <Text style={{textAlign: 'center', fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6, textDecorationLine: 'underline'}}>{"How it works"}</Text>
                  </View>
                  <Text style={{marginTop: 30, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>To create a geofilter, simply tap <Text style={{fontWeight: 'bold'}}>Create New Filter</Text> to get started. {"You'll"} be guided through the 4-step process of uploading your geofilter design, choosing dates and times the geofilter will be active, setting the geofence area that will determine where users can access your geofilter, and adding a title and optional message for anyone you invite to use it. 
</Text>
  
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, marginTop:10, paddingLeft: 6}}>Once a geofilter has been successfully submitted, a <Text style={{fontWeight: 'bold'}}>unique ID</Text> will be assigned to your geofilter, along with a pre-populated invite that you can send to your friends via SMS, email, or social media. This invite will contain directions and a link that allows users to quickly and easily add your new geofilter to their devices. (<Text style={{fontWeight: 'bold'}}>Note: Invitees will need to install Fencer on their devices in order to access and use your new geofilter.</Text>)</Text>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, marginTop:10, paddingLeft: 6}}>Once a geofilter becomes active, users within your pre-defined geofence area will be able to access it by simply navigating to <Text style={{fontWeight: 'bold'}}>My Filters</Text>, finding the geofilter title in their list, and tapping on it to open the geofilter in their mobile camera. The geofilter will be automatically applied to any photos they take, which can then be posted to Snapchat, Facebook, Instagram, or any other social network. They can also share them via SMS and email.</Text>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, marginTop:10, paddingLeft: 6}}>(To access these directions in the future, simply tap the info icon in the upper-right corner.)</Text>


                </ScrollView>
                     <TouchableHighlight 
                    style={{marginTop: 7, height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                    onPress={() => {
                      this.props.toggleModal();
                      this.setState({modalVisible: !this.state.modalVisible});
                      this.props.dismissWelcomeModal();
                    }
                  }>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
                  </TouchableHighlight>
            </View>
          </View>
      </Modal>
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
    myFilters: state.authReducer.myFilters, 
    welcomeModalDismissed: state.authReducer.welcomeModalDismissed,
    searchError: state.filterReducer.searchError,
    searchErrorCode: state.filterReducer.searchErrorCode,
    searchErrorMessage: state.filterReducer.searchErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      authActions.logout(dispatch)
    },
    addFilter: (filter) => {
      filterActions.addFilterByID(dispatch, filter)
    },
    loadMyFilters: () => {
      authActions.loadMyFilters(dispatch);
    },
    dismissWelcomeModal: () => {             //  I only want the Welcome modal to automatically popup once 
      authActions.dismissWelcomeModal(dispatch);
    },
    clearSearchError: () => {
      filterActions.clearSearchError(dispatch)
    },
    clearNewFilter: () => {
      filterActions.clearNewFilter(dispatch)
    }
  }
}

const Welcome = connect(mapStateToProps, mapDispatchToProps)(WelcomeComponent);
export default Welcome;

const styles = StyleSheet.create({
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
    justifyContent: 'flex-start', 
    alignItems: 'center', 
   // backgroundColor:'white',
   backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
    padding: 10
  },
  modalScroll: {
    paddingBottom: 5,
    backgroundColor:'white',
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
  },
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


