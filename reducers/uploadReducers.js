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
  selectedDates: {
    startMonth: null,
    startDay: null,
    startYear: null,
    endMonth: null,
    endDay: null,
    endYear: null,
    startHour: null,
    endHour: null,
    startMinute: null,
    endMinute: null
  },
  fenceCoordinates: null,
  filterUploadError: "",
  fenceError: "",
  filterTitle: null,
  filterMessage: null,
  filterToUpload: null,
  bitlyURL: "",
  filterID: "",
  finalSubmitComplete: false
}

const uploadReducer = (state = initialState, action) => {
  switch(action.type){
    case ActionTypes.LOAD_VIEW_REQUEST: 
      console.log('action.currentView in uploadReducer: ', action.currentView);
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
        selectedDates: action.selectedDates,
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
        currentView: 'send'
      })
    case ActionTypes.CHOOSE_AREA_ERROR:
      return Object.assign({}, state, {
        fenceCoordinates: action.fenceCoordinates,
        isValidatingCoords: false,
        currentView: 'send'
      })
    case ActionTypes.SET_INFO_REQUEST:
      console.log('action.title, message in reducer ', action.info.title, action.info.message);
      return Object.assign({}, state, {
        filterTitle: action.info.title,
        filterMessage: action.info.message
      })
    // case ActionTypes.FINAL_SUBMIT_REQUEST:
    //   return Object.assign({}, state, {

    //   })
    case ActionTypes.FINAL_SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        bitlyURL: action.bitlyURL,
        filterID: action.filterID,              // MIGHT NOT NEED THIS
        finalSubmitComplete: true               //  will need to move this to after text message is sent
      })
    case ActionTypes.CLEAR_PROPS_REQUEST:
      return Object.assign({}, state, {
          uploadFilterComplete: false,
          selectDatesComplete: false,
          chooseAreaComplete: false,
          //sendToFriendsComplete: false,
          selectedDates: {
            startMonth: null,
            startDay: null,
            startYear: null,
            endMonth: null,
            endDay: null,
            endYear: null,
            startHour: null,
            endHour: null,
            startMinute: null,
            endMinute: null
          },
          filterToUpload: null,
          fenceCoordinates: null,
          filterTitle: null,
          filterMessage: null
      })
    // case ActionTypes.CLEAR_SEND_DATA_REQUEST:
    //   return Object.assign({}, state, {
    //     bitlyURL: "",
    //     filterID: "",
    //     sendToFriendsComplete: true         
    //   })


    default:
      return state;
  }
}

export default uploadReducer;