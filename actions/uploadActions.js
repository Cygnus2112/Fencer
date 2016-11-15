import { AsyncStorage, Image } from 'react-native';

export const LOAD_VIEW_REQUEST = 'LOAD_VIEW_REQUEST';
export const SELECT_DATES_REQUEST = 'SELECT_DATES_REQUEST';
export const UPLOAD_FILTER_REQUEST = 'UPLOAD_FILTER_REQUEST';
export const UPLOAD_FILTER_SUCCESS = 'UPLOAD_FILTER_SUCCESS';
export const CHOOSE_AREA_REQUEST = 'CHOOSE_AREA_REQUEST';
export const CHOOSE_AREA_SUCCESS = 'CHOOSE_AREA_SUCCESS';



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

const submitDates = (dates) => {			// will do all date validation on front end
	return {
		type: SELECT_DATES_REQUEST,
		selectedDates: dates
	}
}

export const submitFilter = (filterData) => {
	return dispatch => {
		dispatch( submitFilterRequest() );


		//  do filter validation here. 
		// if successfull:

		//dispatch(submitFilterSuccess(filterData));  //  could be something else (ie, filterData.filterURI)
	}
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

export const submitFilterCoordinates = (coords) => {
	return dispatch => {
		dispatch( chooseAreaRequest() );

										//  can we validate google polygon coords on backend? Am guessing no.

		// dispatch(chooseAreaSuccess());
	}
}

const chooseAreaRequest = () => {
	return {
		type: CHOOSE_AREA_REQUEST
	}
}

const chooseAreaSuccess = (coords) => {
	return {
		type: CHOOSE_AREA_SUCCESS,
		filterCoordinates: coords
	}
}


