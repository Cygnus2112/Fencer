import { AsyncStorage, Image } from 'react-native';

let utils = require('../utils');

import { Actions } from 'react-native-router-flux';

export const UPDATE_POSITION_REQUEST = 'UPDATE_POSITION_REQUEST';
export const UPDATE_POSITION_SUCCESS = 'UPDATE_POSITION_SUCCESS';

export const initPosition = (dispatch) => {
 // return dispatch => {
    dispatch(updatePositionRequest());

    navigator.geolocation.getCurrentPosition((pos) => {
        let newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }

        console.log('position in initPosition: ', newPos);

        dispatch( updatePositionSuccess(newPos) );

        //Actions.main({currentPosition: newPos});
        Actions.main();
      },
      (error) => console.log("Nav error: ", JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
 // }
}

export const updatePosition = (dispatch) => {

	//return dispatch => {
		dispatch(updatePositionRequest());

		navigator.geolocation.getCurrentPosition((pos) => {
    		let newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }

    		console.log('position in filterActions: ', newPos);

    		dispatch( updatePositionSuccess(newPos) );
  		},
  		(error) => console.log("Nav error: ", JSON.stringify(error)),
  		{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
		)
	//}
}

const updatePositionRequest = () => {
	return {
		type: UPDATE_POSITION_REQUEST
	}
}

const updatePositionSuccess = (pos) => {
	return {
		type: UPDATE_POSITION_SUCCESS,
		currentPosition: pos
	}
}

export const LOAD_MYFILTERS_REQUEST = 'LOAD_MYFILTERS_REQUEST';
export const LOAD_MYFILTERS_SUCCESS = 'LOAD_MYFILTERS_SUCCESS';

export const loadMyFilters = (dispatch, userData) => {
 // return dispatch => {

    dispatch(loadMyFiltersRequest());			

    AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){
            //dispatch(authSuccess());
            return fetch(utils.filtersCreatedURL +"?username="+userData.username, {    // CHANGE BACK TO myFiltersURL
      			method: 'GET',
      			headers: {
        			'Accept': 'application/json',
        			'Content-Type': 'application/json',
        			'x-access-token': token
      			}
    		})
    		.then(response => {
      			  return response.json();
    		})
    		.then(response => {
            // console.log('response in filter actions: ');
            // console.log(response);

      			dispatch(loadMyFiltersSuccess(response));
						
    		})
    		.catch(err => {
            	console.error('Error in loadMyFilters:', err);
          	});
            	
        } else {
            // dispatch(authFail());
        }
    }).done();
 // }
}

const loadMyFiltersRequest = () => {
	return {
    	type: LOAD_MYFILTERS_REQUEST
  	}
}

const loadMyFiltersSuccess = (filtersData) => {
	return {
    	type: LOAD_MYFILTERS_SUCCESS,
    	myFilters: filtersData
  	}
}

export const LOAD_FILTERSCREATED_REQUEST = 'LOAD_FILTERSCREATED_REQUEST';
export const LOAD_FILTERSCREATED_SUCCESS = 'LOAD_FILTERSCREATED_SUCCESS';

export const loadFiltersCreated = (userData) => {
  return dispatch => {

    dispatch(loadFiltersCreatedRequest());			

    AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){
            //dispatch(authSuccess());
            return fetch(utils.filtersCreatedURL+"?username="+userData.username, {
      			method: 'GET',
      			headers: {
        			'Accept': 'application/json',
        			'Content-Type': 'application/json',
        			'x-access-token': token
      			}
    		})
    		.then(response => {
      			  return response.json();
    		})
    		.then(response => {
            // console.log('response in filter actions: ');
            // console.log(response);

      			dispatch(loadFiltersCreatedSuccess(response));
						
    		})
    		.catch(err => {
            	console.error('Error in loadFiltersCreated:', err);
          	});
            	
        } else {
            // dispatch(authFail());
        }
    }).done();
  }
}

const loadFiltersCreatedRequest = () => {
	return {
    	type: LOAD_FILTERSCREATED_REQUEST
  	}
}

const loadFiltersCreatedSuccess = (filtersData) => {
	return {
    	type: LOAD_FILTERSCREATED_SUCCESS,
    	filtersCreated: filtersData
  	}
}

// export const FILTER_TO_UPLOAD_REQUEST = 'FILTER_TO_UPLOAD_REQUEST';
// export const FILTER_TO_UPLOAD_SUCCESS = 'FILTER_TO_UPLOAD_SUCCESS';
// export const FILTER_TO_UPLOAD_ERROR = 'FILTER_TO_UPLOAD_ERROR';

// export const submitFilterToUpload = (dispatch, filter) => {
//   dispatch( uploadFilterRequest() );

//     // ... validate image. dispatch( uploadFilterError(error) );

//   dispatch( uploadFilterSuccess(filter) );
// }

// const uploadFilterRequest = () => {
//   return {
//     type: FILTER_TO_UPLOAD_REQUEST
//   }
// }
// const uploadFilterSuccess = (filter) => {
//   return {
//     type: FILTER_TO_UPLOAD_SUCCESS,
//     filterToUpload: filter
//   }
// }
// const uploadFilterError = (reason) => {
//   return {
//     type: FILTER_TO_UPLOAD_ERROR,
//     filterUploadError: reason
//   }
// }


    //   myFilters:

    //   {
    //     'xbh1234' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}],
    //     'ehb3929' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}],
    //     'pna4958' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}]
    //   }

    // filtersCreated:

    //   {
    //     'xbh1234' : [{lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}, {lat: ... , lng ...}]
    //   }
