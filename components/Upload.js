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

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as uploadActions from '../actions/uploadActions';

import Icon from 'react-native-vector-icons/Entypo';

import UploadNav from './UploadNav'

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

class Upload extends Component {
	constructor(props){
		super(props);

	}

	// trying it first without passing { ...this.props } to UploadNav:

	render(){
	  <View>
		<UploadNav />

		<MainView { ...this.state.propsToSend } view={ this.props.currentView } />

	  </View>
	}
}

const mapStateToProps = (state) => {
  return {
    currentView: state.uploadReducer.currentView,
	isLoading: state.uploadReducer.isLoading,
  	isValidatingImage: state.uploadReducer.isValidatingImage,
  	isValidatingCoords: state.uploadReducer.isValidatingCoords,
  	currentView: state.uploadReducer.currentView,
  	uploadFilterComplete: state.uploadReducer.uploadFilterComplete,
  	selectDatesComplete: state.uploadReducer.selectDatesComplete,
  	chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
  	sendToFriendsComplete: state.uploadReducer.sendToFriendsComplete,
  	selectedDates: state.uploadReducer.selectedDates,
	filterCoordinates: state.uploadReducer.filterCoordinates,
  	filterToUpload: state.uploadReducer.filterToUpload,
  	filterTitle: state.uploadReducer.filterTitle,
  	filterMessage: state.uploadReducer.filterMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadActions: bindActionCreators(uploadActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);

