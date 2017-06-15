import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

class Preview extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return(<View collapsable={false} style={styles.photoAndFilter} />)
	}
}

const styles = StyleSheet.create({
  photoAndFilter:{
    width: screenWidth * .9, 
    height: screenHeight * .95, 
    marginBottom:20,
  }
});

export default Preview;