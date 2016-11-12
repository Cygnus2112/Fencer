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

export default class UploadNav extends Component {
	constructor(props){
		super(props);

	}

	render(){
		return (
				<View style={{height: 50, flexDirection: 'row', justifyContent: 'center', borderBottomColor: 'black', borderBottomWidth: 2}}>
					<StepOne isActive={this.props.isOneActive} isComplete={this.props.isOneComplete} />
					<StepTwo isActive={this.props.isTwoActive} isComplete={this.props.isTwoComplete} />
					<StepThree isActive={this.props.isThreeActive} isComplete={this.props.isThreeComplete} />
					<StepFour isActive={this.props.isFourActive} isComplete={this.props.isFourComplete} />
				</View>

			)
	}
}