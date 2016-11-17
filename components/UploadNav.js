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

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'

//REMEMBER TO REMOVE TEMP ISCOMPLETE AND ISACTIVE PROPS

class UploadNav extends Component {
	constructor(props){
		super(props);

	}

	render(){

		// trying it first without passing { ...this.props } to Steps

		return (
			<View style={{height: 50, flexDirection: 'row', justifyContent: 'center', borderBottomColor: 'black', borderBottomWidth: 2}}>
				<StepOne />
				<StepTwo />
				<StepThree />
				<StepFour />
			</View>

		)
	}
}

export default UploadNav;