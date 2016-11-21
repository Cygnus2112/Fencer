import {
  AsyncStorage
} from 'react-native';

let utils = require('../utils');

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';

export const signup = (dispatch,info) => {
//  return dispatch => {
  console.log('info in authActions signup: ', info);
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
          	  dispatch(signupSuccess({"token" : response.token, "username": info.username}));

          	  //Actions.styles();

          } else {
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
    errorMsg: err
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
  //return dispatch => {
    console.log('info in authActions login: ', info);
    dispatch(loginRequest(info));

    //return fetch('http://localhost:8080/login', {
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
        	AsyncStorage.setItem('fencer-token', response.token);
        	AsyncStorage.setItem('fencer-username', info.username);

          dispatch(loginSuccess({"token":response.token, "username": info.username}));
          //dispatch(authSuccess());

        //  Actions.styles();

        } else {
          //console.error('login error');
          dispatch(loginError());
          
        }
      } catch(e) {
       // console.error('login error2:', e);
        dispatch(loginError({"error2":e}));
      };
    })
    .catch(err => {
     // console.error('login error3:', err);
      dispatch(loginError({"error3":err}));
    });
  //}
}

const loginRequest = (info) => {
  return {
    type: LOGIN_REQUEST,
    info
  }
}

const loginError = (msg) => {
  console.log(msg);
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

export const logout = () => {
  return dispatch => {
    AsyncStorage.removeItem('fencer-token')
    	.then(result => {
    		AsyncStorage.removeItem('fencer-username')
    			.then(result => {
    				dispatch(logoutSuccess());

    			//	Actions.login();

    			});
    	});
  }
}

const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS
  }
}

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';

export const checkForToken = (dispatch) => {
 //   return dispatch => {
    	AsyncStorage.getItem("fencer-token").then((value) => {
            if(value){
            	AsyncStorage.getItem("fencer-username").then((username) => {

                // grab all filters???

            		dispatch(authSuccess(username));

                purgeExpiredFilters(dispatch, value, username);


            	}).done();
            } else {
              
            	// dispatch(authFail());

            }

        }).done();
 //   }
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
            console.log('2nd level response in purgeExpiredFilters: ');
            console.log(response);

            console.log('-------------------------');
            dispatch(purgeSuccess());
            
    })
    .catch(err => {
        console.error('Error in purgeExpiredFilters:', err);
      });


}

const purgeRequest = () => {
  return {
    type: 'PURGE_REQUEST'
  }
}

const purgeSuccess = () => {
  return {
    type: 'PURGE_SUCCESS'
  }
}






