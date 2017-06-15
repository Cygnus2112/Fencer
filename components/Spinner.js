import React, { Component } from 'react';

import {
    View,
    StyleSheet,
	ActivityIndicator,
	Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

class Spinner extends Component {
	constructor(){
		super();
	}

	render(){
		return (
			<View style={styles.container}>
				<ActivityIndicator style={styles.spinner} size={75} color="blue" />
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
    	justifyContent: 'center',
		backgroundColor: "white",
		width: screenWidth

	},
	spinner: {
		alignItems: 'center',
    	justifyContent: 'center',
    	padding: 8
	}
})

export default Spinner;