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

export default class StepOne extends Component {
	constructor(props){
		super(props);

	}

				// 	<View style={styles.numberIcon}>
				// 	<Text style={{fontSize: 12, fontWeight: 'bold'}}>1</Text>
				// </View>

	render(){
		return (
			<View style={styles.container}>
				<Icon name="check-circle-o" size={25} color="green" />
				<View style={{alignItems: 'center',marginLeft:5}}>
					<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14}}>Upload</Text>
					<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14}}>Filter</Text>
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
		height: 20,
		width: 20,
		borderColor: 'black',
		borderWidth: 2,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center'
	}
})