import { AsyncStorage, Image } from 'react-native';
import axios from 'axios';

let utils = require('../utils');
import { Actions } from 'react-native-router-flux';

export const LOAD_VIEW_REQUEST = 'LOAD_VIEW_REQUEST';

export const loadView = (dispatch, view) => {		
	dispatch( loadViewRequest(view) );
}

export const loadViewRequest = (view) => {
	return {
		type: LOAD_VIEW_REQUEST,
		currentView: view
	}
}

export const SUBMIT_DATES_REQUEST = 'SUBMIT_DATES_REQUEST';

export const submitDates = (dispatch, dates) => {			// will do all date validation on front end
	dispatch( submitDatesRequest(dates) )
}

const submitDatesRequest = (dates) => {			// will do all date validation on front end
	return {
		type: SUBMIT_DATES_REQUEST,
		startUTC: dates.startUTC,
		endUTC: dates.endUTC
	}
}

export const UPLOAD_FILTER_REQUEST = 'UPLOAD_FILTER_REQUEST';
export const UPLOAD_FILTER_SUCCESS = 'UPLOAD_FILTER_SUCCESS';
export const UPLOAD_FILTER_ERROR = 'UPLOAD_FILTER_ERROR';

export const submitFilter = (dispatch, filterData) => {
	dispatch( submitFilterRequest() );

		//  do filter validation here. 
		// if successfull:

	dispatch(submitFilterSuccess(filterData));  //  could be something else (ie, filterData.filterURI)
}

const submitFilterRequest = () => {
	return {
		type: UPLOAD_FILTER_REQUEST
	}
}

const submitFilterSuccess = (filterData) => {

	return {
		type: UPLOAD_FILTER_SUCCESS,
		filterToUpload: filterData			//  could be something else (ie, filterData.filterURI)
		
	}
}

const submitFilterError = (reason) => {
	return {
		type: UPLOAD_FILTER_ERROR,
		filterUploadError: reason		
	}
}

export const CHOOSE_AREA_REQUEST = 'CHOOSE_AREA_REQUEST';
export const CHOOSE_AREA_SUCCESS = 'CHOOSE_AREA_SUCCESS';
export const CHOOSE_AREA_ERROR = 'CHOOSE_AREA_ERROR';

export const submitFenceCoordinates = (dispatch, coords) => {
	//console.log('coords in submitFenceCoordinates: ', coords);

	dispatch( chooseAreaRequest() );
	dispatch( chooseAreaSuccess(coords) );
}


const chooseAreaRequest = () => {
	return {
		type: CHOOSE_AREA_REQUEST
	}
}

const chooseAreaSuccess = (coords) => {
	//console.log('chooseAreaSuccess dispatched');
	return {
		type: CHOOSE_AREA_SUCCESS,
		fenceCoordinates: coords,
		newMapRegion: coords.newMapRegion
	}
}

const chooseAreaError = () => {
	return {
		type: CHOOSE_AREA_ERROR
	}
}

export const SET_INFO_REQUEST = 'SET_INFO_REQUEST';

export const submitTitleAndMessage = (dispatch, info) => {
	//console.log('info in submitTitleAndMessage: ', info);
	dispatch(submitInfoRequest(info));
}

const submitInfoRequest = (info) => {
	return {
		type: SET_INFO_REQUEST,
		info: info
	}
}

export const SET_MAP_PREVIEW = 'SET_MAP_PREVIEW';

export const setMapPreview = (dispatch, uri) => {
	dispatch( setMapPreviewRequest(uri) );
}

const setMapPreviewRequest = (uri) => {
	return {
		type: SET_MAP_PREVIEW,
		uri: uri
	}
}

export const FINAL_SUBMIT_REQUEST = 'FINAL_SUBMIT_REQUEST';
export const FINAL_SUBMIT_SUCCESS = 'FINAL_SUBMIT_SUCCESS';
export const FINAL_SUBMIT_ERROR = 'FINAL_SUBMIT_ERROR';

export const finalSubmitFilter = (dispatch, data) => {
	//console.log('data.message in finalSubmitFilter: ', data.message);
	dispatch( finalSubmitRequest() );

	let filterData = data.filterToUpload.data;

	AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){
            return axios({
              url: utils.filtersCreatedURL,
              method: 'post',
              data: JSON.stringify({
                username: data.username, // DON'T FORGET TO REMOVE!!!
               	filter: 			
                {			
                	"title": data.title,
					"coordinates": data.fenceCoordinates.fenceCoords,
					"message": data.message,
					//"image": data.filterToUpload.data,			
					"startUTC": data.startUTC,
					"endUTC": data.endUTC
				}
              }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token  
              },
              timeout: 120000
            }   
        )
        .then(response => {
            return response
        })
        .then(response => {
        	//console.log('response in finalSubmitFilter: ', response);

        	dispatch(finalSubmitSuccess({filterID: response.data.filterID, bitlyURL: response.data.bitlyURL}));  // NAVIGATE BACK TO HOME

        									// SHOW SUCCESS MODAL
        	//console.log('response.data.filterID in upload: ', response.data.filterID);

        	Actions.success({type: 'reset', title: data.title, id: response.data.filterID, bitlyURL: response.data.bitlyURL, startUTC: data.startUTC, endUTC: data.endUTC })

        	let start = Date.now();

        	axios({
            	method: 'post',
            	url: utils.filterImagesURL,
            	data: {
              		filterID: response.data.filterID,
              		imageData: filterData
            	},
            	headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token  
            	},
            	timeout: 120000
          	})
          	.then(resp => {

          		//console.log('total upload time (client-side): ', Date.now() - start);

          		//  WILL NEED TO DISPATCH A FUNCTION THAT CLEARS THE FILTERTOUPLOAD PROP
            	return resp
        	})

        									
            return response;			// WHY IS THIS HERE???
        })
        .catch((err) => {
        	//dispatch(finalSubmitSuccess( ));
        	console.error('error in finalSubmitFilter:', err);
        })      
        } else {
            // dispatch(authFail());
            console.log('token not found???');
        }
    }).done();			
}

const finalSubmitRequest = () => {
	return {
		type: FINAL_SUBMIT_REQUEST
	}
}

const finalSubmitSuccess = (data) => {
//	console.log('data in finalSubmitSuccess: ', data);
	return {
		type: FINAL_SUBMIT_SUCCESS,
		bitlyURL: data.bitlyURL
	}

}

export const CLEAR_FILTER_IMAGE_REQUEST = 'CLEAR_FILTER_IMAGE_REQUEST';

export const clearFilterImage = (dispatch) => {
	dispatch(clearFilterImageRequest());
}

const clearFilterImageRequest = () => {
	return {
		type: CLEAR_FILTER_IMAGE_REQUEST
	}
}

export const CLEAR_FENCE_PROPS_REQUEST = 'CLEAR_FENCE_PROPS_REQUEST';

export const clearFenceProps = (dispatch) => {
	dispatch(clearFencePropsRequest());
}

const clearFencePropsRequest = () => {
	return {
		type: CLEAR_FENCE_PROPS_REQUEST
	}
}

export const CLEAR_PROPS_REQUEST = 'CLEAR_PROPS_REQUEST';
export const CLEAR_PROPS_SUCCESS = 'CLEAR_PROPS_SUCCESS';

export const clearUploadProps = (dispatch) => {
	dispatch(clearUploadPropsRequest());
}

const clearUploadPropsRequest = () => {
	return {
		type: CLEAR_PROPS_REQUEST
	}
}

export const DISMISS_MAP_MODAL_REQUEST = 'DISMISS_MAP_MODAL_REQUEST';

export const dismissMapModal = (dispatch) => {
	dispatch( dismissMapModalRequest() );
}

const dismissMapModalRequest = () => {
	return {
		type: DISMISS_MAP_MODAL_REQUEST
	}
}

export const DISMISS_FILTER_MODAL_REQUEST = 'DISMISS_FILTER_MODAL_REQUEST';

export const dismissFilterModal = (dispatch) => {
	dispatch( dismissFilterModalRequest() );
}

const dismissFilterModalRequest = () => {
	return {
		type: DISMISS_FILTER_MODAL_REQUEST
	}
}

