import * as ActionTypes from '../actions/uploadActions';

const initialState = {
  isLoading: false,
  isValidatingImage: false,
  isValidatingCoords: false,
  currentView: 'upload',  // default view
  uploadFilterComplete: false,
  selectDatesComplete: false,
  chooseAreaComplete: false,
  sendToFriendsComplete: false,
  startUTC: null,
  endUTC: null,
  fenceCoordinates: null,
  filterUploadError: "",
  fenceError: "",
  filterTitle: null,
  filterMessage: null,
  filterToUpload: null,
  bitlyURL: "",
  filterID: "",
  finalSubmitComplete: false,
  mapModalDismissed: false,
  filterModalDismissed: false,
  newMapRegion: {},
  mapPreviewURI: null,
  isFinalSubmitting: false
}

const uploadReducer = (state = initialState, action) => {
  switch(action.type){
    case ActionTypes.LOAD_VIEW_REQUEST: 
      return Object.assign({}, state, {
        currentView: action.currentView
      })
    case ActionTypes.UPLOAD_FILTER_REQUEST: 
      return Object.assign({}, state, {
        isValidatingImage: true
      })
    case ActionTypes.UPLOAD_FILTER_SUCCESS: 
      return Object.assign({}, state, {
        filterToUpload: action.filterToUpload,
        uploadFilterComplete: true,
        isValidatingImage: false,
        currentView: 'dates'
      })
    case ActionTypes.UPLOAD_FILTER_ERROR: 
      return Object.assign({}, state, {
        isValidatingImage: false,
        filterUploadError: action.filterUploadError
      })
    case ActionTypes.SUBMIT_DATES_REQUEST:
      return Object.assign({}, state, {
        startUTC: action.startUTC,
        endUTC: action.endUTC,
        selectDatesComplete: true,
        currentView: 'area'
      })
    case ActionTypes.CHOOSE_AREA_REQUEST:
      return Object.assign({}, state, {
        isValidatingCoords: true
      })
    case ActionTypes.CHOOSE_AREA_SUCCESS:
      return Object.assign({}, state, {
        fenceCoordinates: action.fenceCoordinates,
        isValidatingCoords: false,
        chooseAreaComplete: true,
        currentView: 'send',
        newMapRegion: action.newMapRegion
      })
    case ActionTypes.CHOOSE_AREA_ERROR:
      return Object.assign({}, state, {
        fenceCoordinates: action.fenceCoordinates,
        isValidatingCoords: false,
        currentView: 'send'
      })
    case ActionTypes.SET_INFO_REQUEST:
      return Object.assign({}, state, {
        filterTitle: action.info.title,
        filterMessage: action.info.message
      })
    case ActionTypes.FINAL_SUBMIT_REQUEST:
      return Object.assign({}, state, {
        isFinalSubmitting: true
      })
    case ActionTypes.FINAL_SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        bitlyURL: action.bitlyURL,
        filterID: action.filterID,              
        finalSubmitComplete: true,              
        isFinalSubmitting: false
      })
    case ActionTypes.CLEAR_PROPS_REQUEST:
      return Object.assign({}, state, {
          uploadFilterComplete: false,
          selectDatesComplete: false,
          chooseAreaComplete: false,
          sendToFriendsComplete: false,
          startUTC: null,
          endUTC: null,
          filterToUpload: null,
          fenceCoordinates: null,
          filterTitle: null,
          filterMessage: null,
          bitlyURL: "",
          filterID: "",
          finalSubmitComplete: false,
          currentView: 'upload'
      })
    case ActionTypes.CLEAR_FILTER_IMAGE_REQUEST:
      return Object.assign({}, state, {
        filterToUpload: null,
        uploadFilterComplete: false
      })
    case ActionTypes.CLEAR_FENCE_PROPS_REQUEST:
      return Object.assign({}, state, {
        fenceCoordinates: null,
        chooseAreaComplete: false
      })
    case ActionTypes.DISMISS_MAP_MODAL_REQUEST:
      return Object.assign({}, state, {
        mapModalDismissed: true
      })
    case ActionTypes.DISMISS_FILTER_MODAL_REQUEST:
      return Object.assign({}, state, {
        filterModalDismissed: true
      })
    case ActionTypes.SET_MAP_PREVIEW:
      return Object.assign({}, state, {
        mapPreviewURI: action.uri
      })
    default:
      return state;
  }
}

export default uploadReducer;