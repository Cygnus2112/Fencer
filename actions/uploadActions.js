import { AsyncStorage, Image } from 'react-native';
import axios from 'axios';

let utils = require('../utils');

export const LOAD_VIEW_REQUEST = 'LOAD_VIEW_REQUEST';

export const loadView = (dispatch, view) => {
	console.log('loadView called in uploadActions');
	console.log('view in loadView: ', );
	console.log('checking if dispatch is avail in Actions: ', dispatch);
	//return dispatch => {
		
		dispatch( loadViewRequest(view) );
	//}
}

export const loadViewRequest = (view) => {
	console.log('loadViewRequest dispatched!!!');

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
		selectedDates: dates
	}
}

export const UPLOAD_FILTER_REQUEST = 'UPLOAD_FILTER_REQUEST';
export const UPLOAD_FILTER_SUCCESS = 'UPLOAD_FILTER_SUCCESS';
export const UPLOAD_FILTER_ERROR = 'UPLOAD_FILTER_ERROR';

export const submitFilter = (dispatch, filterData) => {
	//return dispatch => {
		dispatch( submitFilterRequest() );

		console.log('filterData.data: ', filterData);


		//  do filter validation here. 
		// if successfull:

		dispatch(submitFilterSuccess(filterData));  //  could be something else (ie, filterData.filterURI)
	//}
}

const submitFilterRequest = () => {
	return {
		type: UPLOAD_FILTER_REQUEST
	}
}

const submitFilterSuccess = (filterData) => {
	return {
		type: UPLOAD_FILTER_SUCCESS,
		filterToUpload: filterData				//  could be something else (ie, filterData.filterURI)
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
	console.log('coords in submitFenceCoordinates: ', coords);
	//return dispatch => {
	dispatch( chooseAreaRequest() );

										//  can we validate google polygon coords on backend? Am guessing no.

	AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){
            //dispatch(authSuccess());
            return axios({
              url: utils.filtersCreatedURL,
              method: 'post',
              data: JSON.stringify({
                username: 'tom', filter: {			
                	"title": "toms party",
					"coordinates": coords.fenceCoords,
					"message": "have fun",
					"image": coords.filterToUpload.data,
					"dates": coords.selectedDates}
              }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token  
              },
              timeout: 30000
            }   
        )
        .then(response => {
            return response
        })
        .then(response => {
        	console.log('response in submitFenceCoordinates');
             return response;
        })
        .catch(err => console.error('error in submitFenceCoordinates:', err));   
              
        } else {
            // dispatch(authFail());
            
        }
    }).done();			

		dispatch(chooseAreaSuccess(coords));


	//}
}

const chooseAreaRequest = () => {
	return {
		type: CHOOSE_AREA_REQUEST
	}
}

const chooseAreaSuccess = (coords) => {
	return {
		type: CHOOSE_AREA_SUCCESS,
		fenceCoordinates: coords
	}
}

const chooseAreaError = () => {
	return {
		type: CHOOSE_AREA_ERROR
	}
}


