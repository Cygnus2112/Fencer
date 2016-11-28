import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';

class LoadingComponent extends Component{
	constructor(props){
		super(props)
	}
	componentDidMount(){
   // AsyncStorage.removeItem("fencer-token").then((value) => {
     // console.log('token removed');
          this.props.checkAuth();
          this.props.initPosition();
   // });
		


	}
	render(){
		return (
			<View style={{flex:1, justifyContent: 'center', alignItems: 'center'}} >
				<Text style={{fontSize: 26}}>
					Loading ...
				</Text>
			</View>
		)
	}
}

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
    checkAuth: () => {
      authActions.checkForToken(dispatch)
    },
    initPosition: () => {
    	filterActions.initPosition(dispatch)
    }
  }
}

const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);

export default Loading;

