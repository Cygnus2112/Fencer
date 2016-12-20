import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Text,
	ActivityIndicator
} from 'react-native';

class Spinner extends Component {
	constructor(){
		super();

	}

	render(){
		return (
			<View style={styles.container}>
				<ActivityIndicator style={styles.spinner} size={75} color="white" />
			</View>

			)
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
    	justifyContent: 'center',
		backgroundColor: "#0000ff"

	},
	spinner: {
		alignItems: 'center',
    	justifyContent: 'center',
    	padding: 8
	}
})

export default Spinner;