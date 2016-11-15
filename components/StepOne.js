import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    DatePickerAndroid,
    TimePickerAndroid,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as uploadActions from '../actions/uploadActions';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

import Icon from 'react-native-vector-icons/FontAwesome';

class StepOneComponent extends Component {
	constructor(props){
		super(props);

		//this.handlePress = this.handlePress.bind(this);
	}

	// handlePress(){
	// 	uploadActions.loadView('upload')
	// }

	render(){
		return (

		<TouchableOpacity onPress={this.props.handlePress} >
			<View style={styles.container}>
				{this.props.uploadFilterComplete
					?
				(<Icon name="check-circle-o" size={25} color="green" />)
					:
				(<View style={styles.numberIcon}>
					<Text style={{fontSize: 13, fontWeight: 'bold'}}>1</Text>
				</View>)
				}
				<View style={{alignItems: 'center',marginLeft:5}}>
					<Text style={this.props.currentView === 'upload' ? [styles.stepText, {fontWeight: 'bold'}] : styles.stepText}>Upload</Text>
					<Text style={this.props.currentView === 'upload' ? [styles.stepText, {fontWeight: 'bold'}] : styles.stepText}>Filter</Text>
				</View>
			</View>
		</TouchableOpacity>
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
	},
	stepText: {
		fontFamily: 'RobotoCondensed-Regular',
		fontSize: 14
	}
})

const mapStateToProps = (state) => {
  return {
    currentView: state.uploadReducer.currentView,
    uploadFilterComplete: state.uploadReducer.uploadFilterComplete
    }
}

const mapDispatchToProps = (dispatch) => {
  // return {
  //   uploadActions: bindActionCreators(uploadActions, dispatch)
  // }
    return {
  	  handlePress: () => {
  		uploadActions.loadView(dispatch, 'upload');
  	  }
    }
}

const StepOne = connect(mapStateToProps, mapDispatchToProps)(StepOneComponent);

export default StepOne;
