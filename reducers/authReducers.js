import * as AuthActionTypes from '../actions/authActions';

import { ADD_TO_MYFILTERS, addToMyFilters } from '../actions/filterActions';

//console.log('ADD_TO_MYFILTERS: ', ADD_TO_MYFILTERS);
//console.log('addToMyFilters: ', addToMyFilters);

let ActionTypes = Object.assign({}, AuthActionTypes, {
        ADD_TO_MYFILTERS: ADD_TO_MYFILTERS,
        addToMyFilters: addToMyFilters
      })

//console.log('ActionTypes in authReducers: ', ActionTypes);

const initialState = {
  isFetchingAuth: false,
  isLoggedIn: false,
  username: '',
  authErrorMsg: '',
  myFilters: null,
  filtersCreated: null,
  isDeletingFilter: false,
  welcomeModalDismissed: false
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
        myFilters: null,
        filtersCreated: null
      })
    case ActionTypes.AUTH_REQUEST:
      return Object.assign({}, state, {
        isFetchingAuth: true,
      })
    case ActionTypes.AUTH_SUCCESS:
      return Object.assign({}, state, {
        username: action.username,
        isLoggedIn: true,
        isFetchingAuth: false
      })
    case ActionTypes.LOAD_MY_FILTERS_REQUEST:
      return Object.assign({}, state, {
       isLoadingMyFilters: true
      })
    case ActionTypes.LOAD_MY_FILTERS_SUCCESS:
      return Object.assign({}, state, {
        isLoadingMyFilters: false,
        myFilters: action.myFilters,
        filtersCreated: action.filtersCreated
      })
    case ActionTypes.DELETE_FILTER_REQUEST:
      return Object.assign({}, state, {
        isDeletingFilter: true
      })
    case ActionTypes.DELETE_FILTER_SUCCESS:
      return Object.assign({}, state, {
        isDeletingFilter: false
      })
    case ActionTypes.CLEAR_ERROR_REQUEST:
      return Object.assign({}, state, {
        authErrorMsg: ''
      })
    case ActionTypes.ADD_TO_MYFILTERS:
      let allFilters = state.myFilters.slice();
    //  console.log('action.filter: ', action.filter);
      allFilters.push(action.filter);
    //  console.log('allFilters: ', allFilters);
      return Object.assign({}, state, {
        myFilters: allFilters
      })
    case ActionTypes.DISMISS_WELCOME_MODAL_REQUEST:
      return Object.assign({}, state, {
        welcomeModalDismissed: true
      })

    // case ActionTypes.LOAD_FILTERSCREATED_REQUEST:
    //   return Object.assign({}, state, {
    //    isLoadingFiltersCreated: true
    //   })
    // case ActionTypes.LOAD_FILTERSCREATED_SUCCESS:
    //   return Object.assign({}, state, {
    //    isLoadingFiltersCreated: false,
    //    filtersCreated: action.filtersCreated
    //  })
    default:
      return state;
  }
}

export default authReducer;