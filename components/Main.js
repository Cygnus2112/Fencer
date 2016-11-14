When component mounts, check 1) geocoords, and 2) if user is logged in (token)

While checking, show loading screen.

After we get coords and isLoggedIn, show welcome screen. 

import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';
import Welcome from './components/Welcome';

class LoadingScreen extends Component{
	constructor(props){
		super(props)
	}

	render(){
		return (
			<View style={{flex:1, justifyContent: 'center', alignItems: 'center'}} >
				<Text style={{fontSize: 26}}>
					Loading ...
				<Text>
			</View>
		)
	}
}

class Main extends Component {
	constructor(props){
		super(props);

	}

	componentDidMount(){
		filterActions.userUpdatePositionRequest();

	}

	render(){
	  return (

		{this.props.isUpdatingLocation
			?
			<LoadingScreen />
			:
			<Welcome />


		}
	  )
	}
}

const mapStateToProps = (state) => {
  return {
  //	isLoggedIn: state.authReducer.isLoggedIn,
  //	authErrorMsg: state.authReducer.authErrorMsg,
  // 	username: state.authReducer.username,
  // 	isFetchingAuth: state.authReducer.isFetchingAuth,
    isUpdatingPosition: state.filterReducer.isUpdatingLocation,
    currentPosition: state.filterReducer.currentPosition
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  	//authActions: bindActionCreators(authActions, dispatch),
    filterActions: bindActionCreators(filterActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);