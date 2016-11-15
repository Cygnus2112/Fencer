// When component mounts, check 1) geocoords, and 2) if user is logged in (token)

// While checking, show loading screen.

// After we get coords and isLoggedIn, show welcome screen. 

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

import Welcome from './Welcome';

class MainComponent extends Component {
	constructor(props){
		super(props);

	}

	componentDidMount(){
		//console.log('this.props in Main: ', this.props)
		console.log('-----------------------------------');
	}


		// {this.props.isUpdatingLocation
		// 	?
		//   (<LoadingScreen />)
		// 	:
		//   (<Welcome />)

		// }
	render(){
	  return (
	  	<View>
			<Welcome />
	  	</View>
	  )
	}
}

const mapStateToProps = (state) => {
  return {
  	isLoggedIn: state.authReducer.isLoggedIn,
  	// authErrorMsg: state.authReducer.authErrorMsg,
  	// username: state.authReducer.username,
  	// isFetchingAuth: state.authReducer.isFetchingAuth,
  	currentPosition: state.filterReducer.currentPosition,
    isUpdatingPosition: state.filterReducer.isUpdatingPosition

  }
}

const mapDispatchToProps = (dispatch) => {
	// let bound = bindActionCreators(filterActions, dispatch);
	// console.log('boundActionCreators: ', bound);
  return {
  	authActions: bindActionCreators(authActions, dispatch),
    filterActions: bindActionCreators(filterActions, dispatch)
  }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(MainComponent);

export default Main;
