
import React, { Component } from 'react';
import {Scene, Router, Actions} from 'react-native-router-flux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActions from './actions/filterActions';
import * as authActions from './actions/authActions';
import * as uploadActions from './actions/uploadActions';

import Loading from './components/Loading';
import MyFilters from './components/MyFilters';
import Main from './components/Main';
import Upload from './components/Upload';

import TakePhoto from './components/TakePhoto';
import ApplyFilter from './components/ApplyFilter';
import Success from './components/Success';

import ReferralSignup from './components/ReferralSignup';

import { Linking, Animated } from 'react-native';
const queryString = require('query-string');

let currUrl;

class AppComponent extends Component {
  constructor(){
    super();
  }

  componentDidMount(){
    Linking.getInitialURL().then((url) => {
      if (url) {
        if(url !== currUrl){
          currUrl = url;
          const filterID = url.slice(url.length-9, url.length) 
            if(!this.props.isLoggedIn){
             // redirect to dedicated "referal signup" view. filter id will be passed as prop and then added on successful signup/login.

              Actions.referral({ filterID: filterID })
            } else {
              this.props.addFilter({filter: filterID, isSearch: false})
            }
        }
      }
    }).catch(err => console.error('An error occurred with Linking.getInitialURL: ', err));


    Linking.addEventListener('url', (e) => {
        if(e.url !== currUrl){
          currUrl = e.url;
          const parsed = queryString.parse(e.url);
          for(filter in parsed){
            if(!this.props.isLoggedIn){
             // redirect to dedicated "referal signup" view. filter id will be passed as prop and then added on successful signup/login.
              Actions.referral({filterID: parsed[filter]})
            } else {
              this.props.addFilter({filter: parsed[filter], isSearch: false})
            }

          }

          //  REMOVE EVENT LISTENER
        }

      });
  }

  render() {
    return (
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Scene key="loading" component={Loading} initial={ true } type='reset' animation='fade' isStartup='true' />
            <Scene key="success" component={Success} type='reset' animation='fade' />
            <Scene key="main" component={Main} type='reset' animation='fade' />
            <Scene key="upload" component={Upload} animation='fade'/>
            <Scene key="myfilters" component={MyFilters} animation='fade'/>
            <Scene key="camera" component={ TakePhoto } direction='vertical'  />
            <Scene key="referral" component={ ReferralSignup } animation='fade' />
          </Scene>
        </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  	isLoggedIn: state.authReducer.isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  	authActions: bindActionCreators(authActions, dispatch),
    filterActions: bindActionCreators(filterActions, dispatch),
    uploadActions: bindActionCreators(uploadActions, dispatch),
    addFilter: (data) => {
      filterActions.addFilterByID(dispatch, data)
    }
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;