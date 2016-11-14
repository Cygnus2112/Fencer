import * as ActionTypes from '../actions/authActions';

const initialState = {
  isFetchingAuth: false,
  isLoggedIn: false,
  username: '',
  authErrorMsg: ''
}

const authReducer = (state = initialState, action) => {
  switch(action.type){
    case ActionTypes.SIGNUP_REQUEST:
      return Object.assign({}, state, {
        isFetchingAuth: true,
        isLoggedIn: false,
      })
    case ActionTypes.SIGNUP_ERROR:
      return Object.assign({}, state, {
        isFetchingAuth: false,
        isLoggedIn: false,
        authErrorMsg: action.errorMsg
      })
    case ActionTypes.SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        isFetchingAuth: false,
        isLoggedIn: true,
        username: action.username,
        authErrorMsg: '',                       
      })  
    case ActionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetchingAuth: true,
        isLoggedIn: false,
      })
    case ActionTypes.LOGIN_ERROR:
      return Object.assign({}, state, {
        isFetchingAuth: false,
        isLoggedIn: false,
        authErrorMsg: "Username and/or password incorrect."
      })
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetchingAuth: false,
        isLoggedIn: true,
        username: action.username        
      })
    case ActionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: false,
        username: '',
      })
    case ActionTypes.AUTH_REQUEST:
      return state;
      // return Object.assign({}, state, {
      //   isLoggedIn: false,
      //   username: '',
      // })
    case ActionTypes.AUTH_SUCCESS:
      return Object.assign({}, state, {
        username: action.username,
        isLoggedIn: true
      })
    default:
      return state;
  }
}

export default authReducer;