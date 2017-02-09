import React, { Component } from 'react';

import {
    View,
    StyleSheet
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

	render(){
	  return (
	  	<View>
			<Welcome isReferral={ this.props.isReferral } />
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
  return {
  	authActions: bindActionCreators(authActions, dispatch),
    filterActions: bindActionCreators(filterActions, dispatch),
    // checkAuth: () => {
    //   authActions.checkForToken(dispatch, true)
    // }
  }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(MainComponent);

export default Main;
