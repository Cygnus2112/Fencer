import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    Text,
    AsyncStorage,
    Linking
} from 'react-native';

import Spinner from './Spinner';

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
    console.log('Loading mounted ...');
    Linking.addEventListener('url', (e) => {
      console.log('deep link url received in Loading: ', e.url);

      console.log(`Deep Link URL: ${e.url}`);

    //     // if(!this.props.isLoggedIn){
    //         // redirect to dedicated "referal signup" view. filter id will be passed as prop and then added on successful signup/login.
    //    // } else {

      if(e.url !== currUrl){
        currUrl = e.url;
        const parsed = queryString.parse(e.url);

        for(filter in parsed){
          console.log('filter ID from url: ', parsed[filter]);
          this.props.addFilter(parsed[filter])
        }

        //  REMOVE EVENT LISTENER
        Actions.loading();
      }



    });
   // AsyncStorage.removeItem("fencer-token").then((value) => {
     // console.log('token removed');
          this.props.checkAuth();
          this.props.initPosition();
   // });
		
	}
  //  <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}} >
        // <Text style={{fontSize: 26}}>
        //   Loading ...
        // </Text>
//      </View>
	render(){
		return (
	
        <Spinner />

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
    },
    addFilter: (filter) => {
      filterActions.addFilterByID(filter)
    },
  }
}

const Loading = connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);

export default Loading;

