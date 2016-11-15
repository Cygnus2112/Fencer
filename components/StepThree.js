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

class StepThreeComponent extends Component {
	constructor(props){
		super(props);
		//this.handlePress = this.handlePress.bind(this);
	}

	// handlePress(){
	// 	uploadActions.loadView('area'); 
	// }

	render(){
		return (

		<TouchableOpacity onPress={this.props.handlePress} >
			<View style={styles.container}>
				{this.props.chooseAreaComplete
					?
				(<Icon name="check-circle-o" size={25} color="green" />)
					:
				(<View style={styles.numberIcon}>
					<Text style={{fontSize: 13, fontWeight: 'bold'}}>3</Text>
				</View>)
				}

				<View style={{alignItems: 'center', marginLeft:5}}>
					<Text style={this.props.currentView === 'area' ? [styles.stepText, {fontWeight: 'bold'}] : styles.stepText}>Choose</Text>
					<Text style={this.props.currentView === 'area' ? [styles.stepText, {fontWeight: 'bold'}] : styles.stepText}>{"Area"}</Text>
				</View>
			</View>
		</TouchableOpacity>

		)
	}
};

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
	},
	stepText: {
		fontFamily: 'RobotoCondensed-Regular',
		fontSize: 14
	}
})

const mapStateToProps = (state) => {
  return {
    currentView: state.uploadReducer.currentView,
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete
   }
}

const mapDispatchToProps = (dispatch) => {
  // return {
  //   uploadActions: bindActionCreators(uploadActions, dispatch)
  // }
    return {
  	  handlePress: () => {
  		//dispatch(uploadActions.loadViewRequest('area'))
  		uploadActions.loadView(dispatch, 'area');
  	  }
    }
}

const StepThree = connect(mapStateToProps, mapDispatchToProps)(StepThreeComponent);

export default StepThree;

