
import React, { Component } from 'react';
import {Scene, Router} from 'react-native-router-flux';

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

class AppComponent extends Component {
  render() {
    return (
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Scene key="loading" component={Loading}              type='reset' animation='fade' isStartup='true' />
            <Scene key="success" component={Success} type='reset' animation='fade' />
            <Scene key="main" component={Main} type='reset' animation='fade' />
            <Scene key="upload" component={Upload} animation='fade'/>
            <Scene key="myfilters" component={MyFilters} animation='fade'/>
            <Scene key="camera" component={ TakePhoto } animation='fade' />
            <Scene key="referral" component={ ReferralSignup } initial={true}  animation='fade' />
          </Scene>
        </Router>
      
    );
  }
}

// const mapStateToProps = (state) => {
// 	console.log('state.authReducer in Main: ', state.authReducer)
//   return {
//   	isLoggedIn: state.authReducer.isLoggedIn,
//   	// authErrorMsg: state.authReducer.authErrorMsg,
//   	// username: state.authReducer.username,
//   	// isFetchingAuth: state.authReducer.isFetchingAuth,
//   	//    currentPosition: state.filterReducer.currentPosition,
//     isUpdatingPosition: state.filterReducer.isUpdatingPosition

//   }
// }

const mapDispatchToProps = (dispatch) => {
  return {
  	authActions: bindActionCreators(authActions, dispatch),
    filterActions: bindActionCreators(filterActions, dispatch),
    uploadActions: bindActionCreators(uploadActions, dispatch)
  }
}

const App = connect(null, mapDispatchToProps)(AppComponent);

export default App;