import React, { Component } from 'react';

import {
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

class PreviewWithFilter extends Component {
	constructor(props){
		super(props);
	}
	render(){
		return(<Image source={{uri: this.props.filterURI}} style={styles.filter} resizeMode={'contain'} />)
	}
}

const styles = StyleSheet.create({
  filter:{
    width: screenWidth * .9, 
    height: screenHeight *.95,
    // borderColor: 'green', 
    // borderWidth: 2,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  }
});

export default PreviewWithFilter;