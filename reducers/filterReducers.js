import * as ActionTypes from '../actions/filterActions';

const initialState = {
	isUpdatingPosition: false,
	isLoadingMyFilters: false,
	isLoadingFiltersCreated: false,
	currentPosition: null,
	myFilters: null,
  	filtersCreated: null
}

export default function filterReducer(state = initialState, action){
  switch(action.type){
  	// case ActionTypes.UPDATE_POSITION_REQUEST:
  	//   return Object.assign({}, state, {
  	//   	currentPosition: ActionTypes.currentPosition
  	//   })
  	case ActionTypes.UPDATE_POSITION_REQUEST:
  	  return Object.assign({}, state, {
  	  	isUpdatingPosition: true
  	  })
  	case ActionTypes.UPDATE_POSITION_SUCCESS:
  	  return Object.assign({}, state, {
  	  	currentPosition: ActionTypes.currentPosition,		//  REMOVE IF GETTING GEO DATA ON FRONT END
  	  	isUpdatingPosition: false
  	  })
  	case ActionTypes.LOAD_MYFILTERS_REQUEST:
  	  return Object.assign({}, state, {
  	  	isLoadingMyFilters: true
  	  })
  	case ActionTypes.LOAD_MYFILTERS_SUCCESS:
  	  return Object.assign({}, state, {
  	  	isLoadingMyFilters: false,
  	  	myFilters: ActionTypes.myFilters
  	  })
  	case ActionTypes.LOAD_FILTERSCREATED_REQUEST:
  	  return Object.assign({}, state, {
  	  	isLoadingFiltersCreated: true
  	  })
  	case ActionTypes.LOAD_FILTERSCREATED_SUCCESS:
  	  return Object.assign({}, state, {
  	  	isLoadingFiltersCreated: false,
  	  	filtersCreated: ActionTypes.filtersCreated
  	  })



  	  // ... and many others for dealing with image rendering etc.

    default:
      return state;
  }
}