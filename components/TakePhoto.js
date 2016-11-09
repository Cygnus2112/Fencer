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

export default class TakePhoto extends Component {
	constructor(props){
		super(props);

		this.takePicture = this.takePicture.bind(this);

		this.state = {
			filterURI: null // will be passed as prop
		}

	}

	takePicture() {
	  	this.camera.capture()
	      .then((data) => {
	      	Actions.applyfilter({photoURI: data.path, filterURI: this.props.filterURI})
	      	//console.log(data) 
	      }
	      )
	      .catch(err => console.error(err));
	}

	// componentDidMount(){
	// 	let options = {};
	// 	ImagePicker.launchCamera(options, (response) => {
	//  		const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
	//  		Actions.applyfilter({photo: source})
	//  		// will pass filter as prop or do it w/redux
	// 	});
	// }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
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