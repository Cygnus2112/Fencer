import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'

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

const styles = StyleSheet.create({
  fakeNavBar:{
  	height: 50,
  	width: screenWidth,
  	backgroundColor: 'blue',
  	flexDirection: 'row',
  	justifyContent: 'flex-start',
  	alignItems: 'center',
  	elevation: 4
  }
});

export default UploadNav;