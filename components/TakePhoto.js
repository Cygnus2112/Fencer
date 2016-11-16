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

class TakePhotoComponent extends Component {
	constructor(props){
		super(props);

		this.takePicture = this.takePicture.bind(this);

		this.state = {
			filterURI: null // will be passed as prop
		}

	}

    // componentDidMount(){
    //   Image.prefetch(this.props.filterURI).then(() => {    // see if this speeds things up
    //      // this.setState({
    //      //      imageLoaded: true
    //      //  })
    //   })
    // } 
      
	takePicture() {
	  	this.camera.capture()
	      .then((data) => {                // is data.path maybe returning undefined???
	      	Actions.applyfilter({photoURI: data.path, filterURI: this.props.filterURI})
	      	//console.log(data) 
	      }
	      )
	      .catch(err => console.error(err));
	}

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;              //  the new (correct) callback refs style
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}>
          <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
}

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