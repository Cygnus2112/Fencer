import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Entypo';

import UploadNav from './UploadNav'

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

/********************** wrapper for all upload filter-related components ********************/

// what props will be passed in?
// isLoggedIn
// filterUploadComplete
// selectDatesComplete
// 

/*

so if we do something like ...

	<View>
		<UploadNav { ...this.state.propsToSend } />
		<MainView { ...this.state.propsToSend } />
	</View>

... how will we tell each component what view we're on?


*/

export default class Upload extends Component {
	constructor(props){
		super(props);

		this.state = ({
			currentView: 
		})

	}


	render(){
	<View>
		<View style={{height: 50, flexDirection: 'row', justifyContent: 'center', borderBottomColor: 'black', borderBottomWidth: 2}}>
			<StepOne isActive={this.props.isOneActive} isComplete={this.props.isOneComplete} />
			<StepTwo isActive={this.props.isTwoActive} isComplete={this.props.isTwoComplete} />
			<StepThree isActive={this.props.isThreeActive} isComplete={this.props.isThreeComplete} />
			<StepFour isActive={this.props.isFourActive} isComplete={this.props.isFourComplete} />
		</View>

		<MainView { ...this.state.propsToSend } view={ this.state.currentView } />

	</View>
	}
}



