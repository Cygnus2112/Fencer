import * as ActionTypes from '../actions/filterActions';

const initialState = {
	isUpdatingPosition: false,
	isLoadingMyFilters: false,
	isLoadingFiltersCreated: false,
  isValidatingFilter: false,
	currentPosition: null,
	myFilters: null,
  filtersCreated: null,
  filterToUpload: null,
  filterUploadError: ""
}

const filterReducer = (state = initialState, action) => {
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
  	  	currentPosition: action.currentPosition,		//  REMOVE IF GETTING GEO DATA ON FRONT END
  	  	isUpdatingPosition: false
  	  })
  	case ActionTypes.LOAD_MYFILTERS_REQUEST:
  	  return Object.assign({}, state, {
  	  	isLoadingMyFilters: true
  	  })
  	case ActionTypes.LOAD_MYFILTERS_SUCCESS:
  	  return Object.assign({}, state, {
  	  	isLoadingMyFilters: false,
  	  	myFilters: action.myFilters
  	  })
  	case ActionTypes.LOAD_FILTERSCREATED_REQUEST:
  	  return Object.assign({}, state, {
  	  	isLoadingFiltersCreated: true
  	  })
  	case ActionTypes.LOAD_FILTERSCREATED_SUCCESS:
  	  return Object.assign({}, state, {
  	  	isLoadingFiltersCreated: false,
  	  	filtersCreated: action.filtersCreated
  	  })
    case ActionTypes.FILTER_TO_UPLOAD_REQUEST:
      return Object.assign({}, state, {
        isValidatingFilter: true
      })
    case ActionTypes.FILTER_TO_UPLOAD_SUCCESS:
      return Object.assign({}, state, {
        filterToUpload: action.filterToUpload,
        isValidatingFilter: false
      })
    case ActionTypes.FILTER_TO_UPLOAD_ERROR:
      return Object.assign({}, state, {
        filterUploadError: action.filterUploadError
      })




  	  // ... and many others for dealing with image rendering etc.

    default:
      return state;
  }
}

export default filterReducer;