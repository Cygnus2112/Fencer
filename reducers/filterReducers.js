import * as ActionTypes from '../actions/filterActions';

const initialState = {
	isUpdatingPosition: false,
	isLoadingAllFilters: false,
  isValidatingFilter: false,
	currentPosition: {lat: null, lng: null},
  filterToUpload: null,
  filterUploadError: "",
  allFilters: [],
  isLoadingFilterImage: false,
  filterImage: null,
  searchError: false,
  newFilterAdded: null,
  searchErrorMessage: '',
  searchErrorCode: ''
}

const filterReducer = (state = initialState, action) => {
  switch(action.type){
  	case ActionTypes.UPDATE_POSITION_REQUEST:
  	  return Object.assign({}, state, {
  	  	isUpdatingPosition: true
  	  })
  	case ActionTypes.UPDATE_POSITION_SUCCESS:
  	  return Object.assign({}, state, {
  	  	currentPosition: action.currentPosition,	
  	  	isUpdatingPosition: false
  	  })
    case ActionTypes.LOAD_ALLFILTERS_REQUEST:
      return Object.assign({}, state, {
       isLoadingAllFilters: true
      })
    case ActionTypes.LOAD_ALLFILTERS_SUCCESS:
      return Object.assign({}, state, {
        isLoadingAllFilters: false,
        allFilters: action.allFilters
      })
    case ActionTypes.LOAD_FILTER_IMAGE_REQUEST:
      return Object.assign({}, state, {
        isLoadingFilterImage: true
      })
    case ActionTypes.LOAD_FILTER_IMAGE_SUCCESS:
      return Object.assign({}, state, {
        isLoadingFilterImage: false,
        filterImage: action.filterImage
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
    case ActionTypes.SEARCH_ERROR:
      return Object.assign({}, state, {
        searchError: true,
        searchErrorMessage: action.message,
        searchErrorCode: action.code
      })
    case ActionTypes.CLEAR_SEARCH_ERROR:
      return Object.assign({}, state, {
        searchError: false,
        searchErrorMessage: '',
        searchErrorCode: ''
      })
    case ActionTypes.NEW_FILTER_ADDED:
      return Object.assign({}, state, {
        newFilterAdded: action.filter
      })
    case ActionTypes.CLEAR_NEW_FILTER:
      return Object.assign({}, state, {
        newFilterAdded: null
      })
    default:
      return state;
  }
}

export default filterReducer;