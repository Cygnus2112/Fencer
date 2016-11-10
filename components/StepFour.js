import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    DatePickerAndroid,
    TimePickerAndroid,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

import Icon from 'react-native-vector-icons/FontAwesome';

export default class StepFour extends Component {
	constructor(props){
		super(props);

	}

	render(){
		return (
			<View style={styles.container}>
				<View style={styles.numberIcon}>
					<Text style={{fontSize: 13, fontWeight: 'bold'}}>4</Text>
				</View>
				<View style={{alignItems: 'center', marginLeft:5}}>
					<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14,fontWeight: 'bold'}}>Send To</Text>
					<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14,fontWeight: 'bold'}}>Friends</Text>
				</View>
			</View>
			)
	}
}

const styles = StyleSheet.create({
	container: {
		width: screenWidth/4,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 3,
		paddingLeft: 3
	},
	numberIcon: {
		height: 22,
		width: 22,
		borderColor: 'black',
		borderWidth: 2,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 1
	}
})