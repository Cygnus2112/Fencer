import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    Linking
} from 'react-native';

import Spinner from './Spinner';
import ReferralSignup from './ReferralSignup';

const queryString = require('query-string');

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';

import { Actions } from 'react-native-router-flux';

let currUrl;

class LoadingComponent extends Component{
	constructor(props){
		super(props)
	}
	componentDidMount(){
    // console.log('Loading mounted ... this.props.isReferral: ', this.props.isReferral);
    // console.log('this.props.isLoggedIn: ', this.props.isLoggedIn);




      this.props.checkAuth(this.props.isReferral);
      this.props.initPosition();

	}

	render(){
		
    if(this.props.isStartup){
	    return (<View style={styles.container} >
          <Image source={require('../assets/map2.png')} style={{height: 80, width: 80, paddingLeft:10, paddingTop:10}} >
            <Image source={require('../assets/camera2.png')} style={{height: 60, width: 60}} /> 
          </Image>
      </View >)
    } else {
      return (<Spinner />)
    }
		
	}
}

// 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue'
  }
});

const mapStateToProps = (state) => {
  return {
  	isLoggedIn: state.authReducer.isLoggedIn,
  	//authErrorMsg: state.authReducer.authErrorMsg,
  	username: state.authReducer.username,
  	// isFetchingAuth: state.authReducer.isFetchingAuth,
    isUpdatingPosition: state.filterReducer.isUpdatingPosition,
    currentPosition: state.filterReducer.currentPosition
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuth: (isReferral) => {
      authActions.checkForToken(dispatch, isReferral)
    },
    initPosition: () => {
    	filterActions.initPosition(dispatch)
    },
    addFilter: (data) => {
      filterActions.addFilterByID(dispatch, data)
    }
  }
}

const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);

export default Loading;

