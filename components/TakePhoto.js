import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    BackAndroid
} from 'react-native';

// WILL NEED TO TRACK CURRENT LOCATION AND END TIME/DATE IN CASE USER STAYS IN THIS VIEW AFTER EVENT EXPIRES

// import {
//   CameraKitCamera
// } from 'react-native-camera-kit';

import { connect } from 'react-redux';

var ImagePicker = require('react-native-image-picker');
import { Actions } from 'react-native-router-flux';
import Camera from 'react-native-camera';

import Share from 'react-native-share';
import RNViewShot from "react-native-view-shot";
import Button from 'react-native-button';

const { width, height } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

class TakePhotoComponent extends Component {
	constructor(props){
		super(props);

		this.takePicture = this.takePicture.bind(this);
    // this.handleZoom = this.handleZoom.bind(this);

    this.state = {
      photo: null,
      applyFilter: false
    }

	}

  componentDidMount(){
    let that = this;
    BackAndroid.addEventListener('hardwareBackPress', function() {
 // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
 // Typically you would use the navigator here to go to the last state.

      if (that.state.applyFilter) {
        that.setState({
          applyFilter: !that.state.applyFilter
        })

        return true;
      }

      //return false;
    });
  }
      
	takePicture() {
	  	this.camera.capture()
	      .then((data) => {                
	      	//Actions.applyfilter({photoURI: data.path, filterURI: this.props.filterImage})

          this.setState({
            applyFilter: !this.state.applyFilter,
            photo: data.path
          })

	      })
	      .catch(err => console.error(err));
	}

  _handleFocusChange(e){
    console.log('focus???')
  }
  _handleZoomChange(e){
    console.log('zoom????')
  }


  // async showAuth(){
  //       const isUserAuthorizedCamera = await CameraKitCamera.requestDeviceCameraAuthorization();
  //   console.log('isUserAuthorizedCamera: ', isUserAuthorizedCamera);
  // }

        //       <CameraKitCamera
        // ref={(cam) => {
        //                     this.camera = cam;
        //                     }
        //         }
        // style={{flex: 1, backgroundColor:'white'}}
        // cameraOptions={{
        //             flashMode: 'auto',             // on/off/auto(default)
        //             focusMode: 'on',               // off/on(default)
        //             zoomMode: 'on',                // off/on(default)
        //             }}/>

  _handleZoomChange() { console.log('zoom????') }

  _handleFocusChange() { console.log('focus????') }

  render() {
    let filterURI = "data:image/png;base64,"+this.props.filterImage;
    return (<View>
        {!this.state.applyFilter
          ?

        (<View style={styles.container}>
          <Camera
          ref={(cam) => {
            this.camera = cam;              //  the new (correct) callback refs style
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          defaultTouchToFocus
          captureTarget={Camera.constants.CaptureTarget.temp}
          onZoomChanged={this._handleZoomChange.bind(this)}
          onFocusChanged={this._handleFocusChange.bind(this)}>

          <TouchableOpacity onPress={this.takePicture}>
            <View style={{width: 50, height: 50,
                  flex: 0,
                  padding: 10,
                  margin: 40,
                  borderRadius: 25,
                  borderColor: 'white',
                  borderWidth: 2

            }} />
          </TouchableOpacity>

        </Camera>
        </View>)

        :
        (<View style={styles.container}>
        <View ref="photoAndFilter" collapsable={false} style={styles.photoAndFilter}>
          <Image style={styles.photo} source={{ uri: this.state.photo}}>
            <Image source={{uri: filterURI}} style={styles.filter}/>
          </Image>  
        </View>
            <View style={styles.button}>
              <TouchableOpacity onPress={()=>{
                console.log("----------------------------------------")

                RNViewShot.takeSnapshot(this.refs["photoAndFilter"], {
                  format: "jpeg",
                  quality: 1.0,
                  result: 'data-uri'
                })
                .then(
                    uri => {
                      console.log("Image saved to uri")
                      console.log("----------------------------------------")

                      let shareImage = {
                        title: "React Native",
                        message: "Hola mundo",
                       // url: this.state.snapshotURI,
                        url: uri,
                        subject: "Share Link" //  for email
                      };
                      Share.open(shareImage);


                },
                error => console.error("Oops, snapshot failed", error)
              )}}>
              <View style={styles.instructions}>
                <Text>Share</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

          )


      }
      </View>)

      

    

  }
}

//  <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  photoAndFilter:{
    width: screenWidth * .9, 
    height: screenHeight * .95, 
    marginBottom:20,
    // borderColor: 'red', 
    // borderWidth: 2 
  },
  photo:{
    width: screenWidth * .9,
    height: screenHeight * .95,
   // backgroundColor:'transparent',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'blue', 
    // borderWidth: 2
  },
  filter:{
    width: screenWidth * .9, 
    height: screenHeight *.95,
    // borderColor: 'green', 
    // borderWidth: 2
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: (screenWidth/2) - 65,
    elevation:3,
    padding:7,
    height:40,
    width: 130,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce'
  }
});

const mapStateToProps = (state) => {
  return {
    filterImage: state.filterReducer.filterImage
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {

//   }
// }

const TakePhoto = connect(mapStateToProps, null)(TakePhotoComponent);
export default TakePhoto;