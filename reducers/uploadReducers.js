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
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null
  },
  filterCoordinates: null,
  filterToUpload: null,
  filterTitle: null,
  filterMessage: null
}

function uploadReducer(state = initialState, action){
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
    case ActionTypes.SELECT_DATES_REQUEST:
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
        filterCoordinates: action.filterCoordinates,
        isValidatingCoords: false,
        currentView: 'send'
      })

      //   ADD FUNCTIONS FOR DEALING WITH SENDING OUT INVITES AND UPLOADING DATA TO API
      //   filterTitle
      //  filterMessage

    default:
      return state;
  }
}

export default uploadReducer;