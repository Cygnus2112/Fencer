import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';

// WILL NEED TO TRACK CURRENT LOCATION AND END TIME/DATE IN CASE USER STAYS IN THIS VIEW AFTER EVENT EXPIRES


var ImagePicker = require('react-native-image-picker');
import { Actions } from 'react-native-router-flux';
import Camera from 'react-native-camera';

// import {
//   CameraKitCamera
// } from 'react-native-camera-kit';

class TakePhotoComponent extends Component {
	constructor(props){
		super(props);

		this.takePicture = this.takePicture.bind(this);
    this.handleZoom = this.handleZoom.bind(this);

		this.state = {
			filterURI: null // will be passed as prop
		}

	}
      
	takePicture() {
	  	this.camera.capture()
	      .then((data) => {                // is data.path maybe returning undefined???
	      	Actions.applyfilter({photoURI: data.path, filterURI: this.props.filterURI})
	      	//console.log(data) 
	      }
	      )
	      .catch(err => console.error(err));
	}

  handleZoom(e){
    console.log('focus????')
  }

  // componentDidMount(){
  //   this.showAuth();
  // }

  // async showAuth(){
  //       const isUserAuthorizedCamera = await CameraKitCamera.requestDeviceCameraAuthorization();
  //   console.log('isUserAuthorizedCamera: ', isUserAuthorizedCamera);
  // }

        //                     <Camera
        //   ref={(cam) => {
        //     this.camera = cam;              //  the new (correct) callback refs style
        //   }}
        //   style={styles.preview}
        //   aspect={Camera.constants.Aspect.fill}
        //   captureTarget={Camera.constants.CaptureTarget.temp}
        //   defaultTouchToFocus
        //   onFocusChanged={ this.handleZoom }>
        //   <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>
        // </Camera>

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

        //         <Camera
        //   ref={(cam) => {
        //     this.camera = cam;              //  the new (correct) callback refs style
        //   }}
        //   style={styles.preview}
        //   aspect={Camera.constants.Aspect.fill}
        //   captureTarget={Camera.constants.CaptureTarget.temp}
        //   onZoomChanged={this._handleZoomChange.bind(this)}
        //   onFocusChanged={this._handleFocusChange.bind(this)}>
        //   <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>
        // </Camera>

  _handleZoomChange() { console.log('zoom????') }

  _handleFocusChange() { console.log('focus????') }

  render() {
    return (
      <View style={styles.container}>

                <Camera
          ref={(cam) => {
            this.camera = cam;              //  the new (correct) callback refs style
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
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

      </View>
    );

    

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
  }
});

const TakePhoto = TakePhotoComponent;
export default TakePhoto;