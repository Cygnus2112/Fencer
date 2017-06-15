import {
  AsyncStorage
} from 'react-native';

let utils = require('../utils');

import { addFilterByID } from './filterActions';

import { Actions } from 'react-native-router-flux';

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';

export const checkForToken = (dispatch, isReferral) => {
    dispatch(authRequest());

    AsyncStorage.getItem("fencer-token").then((value) => {
        if(value){
          AsyncStorage.getItem("fencer-username").then((username) => {
            let token = value;

            dispatch(authSuccess(username));
            Actions.main({isReferral: isReferral});

          })
        } else {
          console.log('token not found');
          Actions.main();
        }
    }).done();
}

const authRequest = () => {
  return {
    type: AUTH_REQUEST
  }
}

const authSuccess = (username) => {
  return {
    type: AUTH_SUCCESS,
    username: username
  }
}

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';

export const signup = (dispatch,info) => {
    dispatch(signupRequest(info));
      return fetch(utils.signupURL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: info.username,
          password: info.password,
          email: info.email
        })
      })
      .then(response => {
        return response.json();
      })
      .then(response => {
        try {
          if(response.token){
        	  AsyncStorage.setItem('fencer-token', response.token);
        	  AsyncStorage.setItem('fencer-username', info.username);

            if(info.filterID){
              dispatch(signupSuccess({"token" : response.token, "username": info.username}));
              addFilterByID(dispatch, {filter: info.filterID, isReferral: true});
            } else{
              dispatch(signupSuccess({"token" : response.token, "username": info.username}));
            }
          } else {
            dispatch(signupError(response));
          }
        } catch(e){
          dispatch(signupError(e));
        }
      })
      .catch(err => console.error('Error in signup:', err));
}

const signupRequest = (info) => {
  return {
    type: SIGNUP_REQUEST
  }
}

const signupError = (err) => {
  return {
    type: SIGNUP_ERROR,
    errorMsg: err['ERROR']
  }
}

const signupSuccess = (info) => {
  return {
    type: SIGNUP_SUCCESS,
    username: info.username
  }
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const login = (dispatch, info) => {
    dispatch(loginRequest(info));

    return fetch(utils.loginURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: info.username,
        password: info.password
      })
    })
    .then(response => {
      return response.json();
    })
    .then(response => {
      try {
        if(response.token){        	
          AsyncStorage.setItem('fencer-username', info.username,()=>{
            AsyncStorage.setItem('fencer-token', response.token,()=>{
              return fetch(utils.userDataURL +"?username="+info.username, {    
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': response.token
                  }
                })
                .then(response => {
                  return response.json();
              })
              .then(response => {
                let data = {
                  username: response.username,
                  myFilters: response.myFilters,
                  filtersCreated: response.filtersCreated,
                  welcomeModalDismissed: response.welcomeModalDismissed
                }

                if(info.filterID){
                  dispatch(authSuccess(data));
                  dispatch(loginSuccess({"token":response.token, "username": info.username}));
                  addFilterByID(dispatch, {filter: info.filterID, isReferral: true})
                } else {
                  dispatch(authSuccess(data));
                  dispatch(loginSuccess({"token":response.token, "username": info.username}));
                }
              })
              .catch(err => {
                console.error('Error in checkForToken:', err);
              });
            })
          })

        } else {
          dispatch(loginError()); 
        }
      } catch(e) {
        dispatch(loginError({"error2":e}));
      };
    })
    .catch(e => {
      dispatch(loginError({"error3":e}));
    });
}

const loginRequest = (info) => {
  return {
    type: LOGIN_REQUEST,
    info
  }
}

const loginError = (msg) => {
  return {
    type: LOGIN_ERROR
  }
}

const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    username: user.username
  }
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const logout = (dispatch) => {
    AsyncStorage.removeItem('fencer-token')
    	.then(result => {
    		AsyncStorage.removeItem('fencer-username')
    			.then(result => {

    				dispatch(logoutSuccess());

            console.log('succcessfully logged out');

    			});
    	});
}

const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS
  }
}

export const LOAD_MY_FILTERS_REQUEST = 'LOAD_MY_FILTERS_REQUEST';
export const LOAD_MY_FILTERS_SUCCESS = 'LOAD_MY_FILTERS_SUCCESS';

export const loadMyFilters = (dispatch, isFromSuccessComponent) => {
        dispatch(loadMyFiltersRequest());
        AsyncStorage.getItem("fencer-token").then((value) => {
            if(value){
              AsyncStorage.getItem("fencer-username").then((username) => {
                console.log('current username: ', username);
                let token = value;

                return fetch(utils.userDataURL +"?username="+username, {    
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                  }
                })
                .then(response => {
                  return response.json();
                })
                .then(response => {
                  let data = {
                    username: response.username,
                    myFilters: response.myFilters,
                    filtersCreated: response.filtersCreated,
                    welcomeModalDismissed: response.welcomeModalDismissed
                  }

                  dispatch(loadMyFiltersSuccess(data));
                  
                  if(isFromSuccessComponent){
                    Actions.myfilters({type: "replace", isFromSuccessComponent: true});
                  } else {
                    Actions.myfilters();
                  }
                })
                .catch(err => {
                  console.error('Error in loadMyFilters:', err);
                });
              }).done();
            } else {
              console.log('token not found');
            }
        }).done();
}

const loadMyFiltersRequest = () => {
  return {
    type: LOAD_MY_FILTERS_REQUEST
  }
}

const loadMyFiltersSuccess = (data) => {
  return {
    type: LOAD_MY_FILTERS_SUCCESS,
    myFilters: data.myFilters,
    filtersCreated: data.filtersCreated,
    welcomeModalDismissed: data.welcomeModalDismissed
  }
}

export const DELETE_FILTER_REQUEST = 'DELETE_FILTER_REQUEST';
export const DELETE_FILTER_SUCCESS = 'DELETE_FILTER_SUCCESS';

export const deleteFilter = (dispatch, filterID) => {
  dispatch(deleteFilterRequest());

  AsyncStorage.getItem("fencer-token").then((value) => {
    if(value){
      AsyncStorage.getItem("fencer-username").then((username) => {
        let token = value;

        return fetch(utils.deleteFilterURL +"?username="+username+"&filterid="+filterID, {    
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          dispatch(deleteFilterSuccess()); 
        })
        .catch(err => {
          console.error('Error in deleteFilter:', err);
        });
      }).done();
    } else {
      console.log('token not found');
    }
  }).done();
}

const deleteFilterRequest = (filterID) => {
  return {
    type: DELETE_FILTER_REQUEST
  }
}

const deleteFilterSuccess = () => {
  return {
    type: DELETE_FILTER_SUCCESS
  }
}

export const DISMISS_WELCOME_MODAL_REQUEST = 'DISMISS_WELCOME_MODAL_REQUEST';
export const DISMISS_WELCOME_MODAL_SUCCESS = 'DISMISS_WELCOME_MODAL_SUCCESS';

export const dismissWelcomeModal = (dispatch) => {
  dispatch(dismissWelcomeModalRequest())
}

const dismissWelcomeModalRequest = () => {
  return {
    type: DISMISS_WELCOME_MODAL_REQUEST
  }
}

export const CLEAR_ERROR_REQUEST = 'CLEAR_ERROR_REQUEST';

export const clearError = (dispatch) => {
  dispatch(clearErrorRequest());
}


const clearErrorRequest = () => {
  return {
    type: CLEAR_ERROR_REQUEST
  }
}

export const PURGE_REQUEST = 'PURGE_REQUEST';
export const PURGE_SUCCESS = 'PURGE_SUCCESS';

export const purgeExpiredFilters = (dispatch, token, username) => {
  dispatch(purgeRequest());

  return fetch(utils.purgeFiltersURL +"?username="+username, {   
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': token
      }
    })
    .then(response => {
        return response.json();
    })
    .then(response => {
      dispatch(purgeSuccess());   
    })
    .catch(err => {
        console.error('Error in purgeExpiredFilters:', err);
    });
}

const purgeRequest = () => {
  return {
    type: PURGE_REQUEST
  }
}

const purgeSuccess = () => {
  return {
    type: PURGE_SUCCESS
  }
}

export const CURRENT_TIME = 'CURRENT_TIME';
export const CLEAR_TIMER = 'CLEAR_TIMER';

let timers = [];

export const getCurrentTime = (dispatch) => {
  timer = setInterval(()=>{
    let t = Date.now();
    dispatch(currentTimeRequest(t));
  },4000);
  timers.push(timer);
}

const currentTimeRequest = (time) => {
  return {
    type: CURRENT_TIME,
    time: time
  }
}

export const clearTimer = (dispatch) => {
  dispatch(()=>{
      timers.forEach((t) => {
        clearInterval(t);
      })
  })
}