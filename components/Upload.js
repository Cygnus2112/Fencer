import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions,
    BackAndroid
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as uploadActions from '../actions/uploadActions';

import Icon from 'react-native-vector-icons/Entypo';

import UploadNav from './UploadNav'

import UploadFilter from './UploadFilter';
import ChooseDates from './ChooseDates';
import CreateMap from './CreateMap';
import Send from './Send';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

class UploadComponent extends Component {
	constructor(props){
		super(props);

    this.onBackPress = this.onBackPress.bind(this);

	}

  onBackPress(){
    console.log('back button pressed in UPLOAD');
    return true;
  }

  componentDidMount(){
    console.log('main UPLOAD component mounted.')
    //  console.log('this.props.currentView in Upload: ', this.props.currentView);

          
    BackAndroid.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount(){
    console.log('main UPLOAD component unmounting...')

    BackAndroid.removeEventListener('hardwareBackPress', this.onBackPress);

  }

  componentWillReceiveProps(newProps){
   // console.log('newProps.currentView: ', newProps.currentView);
  }
  

	// trying it first without passing { ...this.props } to UploadNav:

	render(){
    return(
	  <View>
      <UploadNav />
        {this.props.currentView == 'upload' && 
          ( <UploadFilter /> )
        }
        {this.props.currentView == 'dates' && 
          ( <ChooseDates /> )
        }
        {this.props.currentView == 'area' && 
          ( <CreateMap /> )
        }
        {this.props.currentView == 'send' && 
          ( <Send /> )
        }
	  </View>
    )
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

const Upload = connect(mapStateToProps, mapDispatchToProps)(UploadComponent);

export default Upload;

