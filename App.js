
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

import { Linking } from 'react-native';
const queryString = require('query-string');

let currUrl;

class AppComponent extends Component {
  constructor(){
    super();
  }

  componentDidMount(){
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url   );             //   WILL NEED TO CHANGE UPON SWITCH TO FENCER.ME URL SCHEME
        console.log('url sliced: ' + url.slice(url.length-9, url.length)   );


        if(url !== currUrl){
          currUrl = url;

          const filterID = url.slice(url.length-9, url.length) 


            console.log('filter ID from getInitialUrl: ', filterID );

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
        console.log('deep link url received in App component: ', e.url);

       // console.log(`Deep Link URL: ${e.url}`);

        if(e.url !== currUrl){
          currUrl = e.url;
          const parsed = queryString.parse(e.url);

          for(filter in parsed){
            console.log('filter ID from url: ', parsed[filter]);

            if(!this.props.isLoggedIn){
             // redirect to dedicated "referal signup" view. filter id will be passed as prop and then added on successful signup/login.

              Actions.referral({filterID: parsed[filter]})

            } else {

              this.props.addFilter({filter: parsed[filter], isSearch: false})
            }

          }

          //  REMOVE EVENT LISTENER
         // Actions.loading();    //  calling in Actions instead
        }

      });
  }

  render() {
    console.log('currUrl: ', currUrl);

    return (
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Scene key="loading" component={Loading} initial={ true }        type='reset' animation='fade' isStartup='true' />
            <Scene key="success" component={Success} type='reset' animation='fade' />
            <Scene key="main" component={Main} type='reset' animation='fade' />
            <Scene key="upload" component={Upload} animation='fade'/>
            <Scene key="myfilters" component={MyFilters} animation='fade'/>
            <Scene key="camera" component={ TakePhoto } animation='fade' />
            <Scene key="referral" component={ ReferralSignup }      animation='fade' />
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