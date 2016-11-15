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

class LoadingComponent extends Component{
	constructor(props){
		super(props)
	}
	componentDidMount(){
		//store.dispatch( filterActions.updatePositionRequest() );
		this.props.initPosition();

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
  	// username: state.authReducer.username,
  	// isFetchingAuth: state.authReducer.isFetchingAuth,
    isUpdatingPosition: state.filterReducer.isUpdatingPosition,
    currentPosition: state.filterReducer.currentPosition
  }
}

const mapDispatchToProps = (dispatch) => {
	// let bound = bindActionCreators(filterActions, dispatch);
	// console.log('boundActionCreators: ', bound);
  return {
  	authActions: bindActionCreators(authActions, dispatch),
    filterActions: bindActionCreators(filterActions, dispatch),
    initPosition: () => {
    	filterActions.initPosition(dispatch)
    }
  }
}

const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);

export default Loading;

