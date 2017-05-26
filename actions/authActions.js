import {
  AsyncStorage
} from 'react-native';

let utils = require('../utils');

import { addFilterByID } from './filterActions';

import { Actions } from 'react-native-router-flux';

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';

export const signup = (dispatch,info) => {
//  return dispatch => {
 // console.log('info in authActions signup: ', info);
    dispatch(signupRequest(info));

      //return fetch('http://localhost:8080/signup', {
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

           //   Actions.myfilters();
              addFilterByID(dispatch, {filter: info.filterID, isReferral: true});


            } else{
              dispatch(signupSuccess({"token" : response.token, "username": info.username}));
            }
          	  


          } else {
         //   console.log('response when user or email already taken: ', response);
            dispatch(signupError(response));
          }
        } catch(e){
         // console.log('error response in SIGNUP: ', e);
          dispatch(signupError(e));
        }
      })
      .catch(err => console.error('Error in signup:', err));
 // }
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
  //  console.log('info in authActions login: ', info);
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
      // if there's an error, we skip to the the 'error3' catch statement
      return response.json();
    })
    .then(response => {
     // console.log('response in login: ', response);
      try {
        if(response.token){        	
       //   console.log('response.token: ', response.token);
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

            //  console.log('first response: ', response);

                  return response.json();
              })
              .then(response => {
                //console.log('2nd level response in auth login getUserData: ');
               // console.log(response);

             //   console.log('-------------------------');

             //   console.log('response.myFilters: ', response.myFilters);

                let data = {
                  username: response.username,
                  myFilters: response.myFilters,
                  filtersCreated: response.filtersCreated,
                  welcomeModalDismissed: response.welcomeModalDismissed
                }

                if(info.filterID){

                  dispatch(authSuccess(data));
                  dispatch(loginSuccess({"token":response.token, "username": info.username}));

                 // Actions.myfilters()
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
        //  console.log('login error');
          dispatch(loginError());
          
        }
      } catch(e) {
      //  console.log('try-catch error:', e);
        dispatch(loginError({"error2":e}));
      };
    })
    .catch(err => {
    //  console.log('login error3:', err);
      dispatch(loginError({"error3":err}));
    });
}

const loginRequest = (info) => {
  return {
    type: LOGIN_REQUEST,
    info
  }
}

const loginError = (msg) => {
 // console.log('loginError: ', msg);
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
  //return dispatch => {
    AsyncStorage.removeItem('fencer-token')
    	.then(result => {
    		AsyncStorage.removeItem('fencer-username')
    			.then(result => {

    				dispatch(logoutSuccess());

            console.log('succcessfully logged out');

    			});
    	});
  //}
}

const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS
  }
}

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';

export const checkForToken = (dispatch, isReferral) => {
    //  console.log('checkForToken called in authActions');
      dispatch(authRequest());

    	AsyncStorage.getItem("fencer-token").then((value) => {
            if(value){
            	AsyncStorage.getItem("fencer-username").then((username) => {
                console.log('current username: ', username);
                let token = value;

                dispatch(authSuccess(username));
                Actions.main({isReferral: isReferral});

              })

            } else {
              console.log('token not found');
            	// dispatch(authFail());
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

            //  console.log('first response: ', response);

                  return response.json();
                })
                .then(response => {
                 // console.log('2nd level response in auth loadMyFilters: ');
                //  console.log(response);

                  console.log('-------------------------');

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

                // grab all filters???
               // purgeExpiredFilters(dispatch, value, username);
              }).done();
            } else {
              console.log('token not found');
              // dispatch(authFail());

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
      //  console.log('current username: ', username);
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
        //  console.log('2nd level response in auth deleteFilter: ');
        //  console.log(response);
        //  console.log('-------------------------');

          dispatch(deleteFilterSuccess());
                
         // Actions.myfilters();          //  TEMPORARY. will need to refresh filters, not simply reload the whole view
                
        })
        .catch(err => {
          console.error('Error in deleteFilter:', err);
        });
      }).done();
    } else {
      console.log('token not found');
              // dispatch(authFail());
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

  return fetch(utils.purgeFiltersURL +"?username="+username, {    // CHANGE BACK TO myFiltersURL
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': token
            }
    })
    .then(response => {
              console.log('-------------------------');
              return response.json();
    })
    .then(response => {
        //    console.log('2nd level response in purgeExpiredFilters: ');
        //    console.log(response);

         //   console.log('-------------------------');
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
    //console.log('--------------------------------------');
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

// const dismissWelcomeModalSuccess = () => {
//   return {
//     type: DISMISS_WELCOME_MODAL_SUCCESS
//   }
// }

// Ugh, this was completely unnecessary ...

// export const dismissWelcomeModal = (dispatch) => {
//   dispatch(dismissWelcomeModalRequest());

//   AsyncStorage.getItem("fencer-token").then((value) => {
//     if(value){
//       AsyncStorage.getItem("fencer-username").then((username) => {
//         console.log('current username: ', username);
//         let token = value;

//         return fetch(utils.dismissModalURL +"?username="+username, {    
//           method: 'GET',
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'x-access-token': token
//           }
//         })
//         .then(response => {
//           return response.json();
//         })
//         .then(response => {
//           console.log('2nd level response in auth dismissModal: ');
//           console.log(response);
//           console.log('-------------------------');

//           dispatch(dismissModalSuccess());
              
                
//         })
//         .catch(err => {
//           console.error('Error in dismissModal:', err);
//         });
//       }).done();
//     } else {
//       console.log('token not found');
//               // dispatch(authFail());
//     }
//   }).done();
// }
