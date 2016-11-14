import { AsyncStorage, Image } from 'react-native';

let utils = require('../utils');

export const UPDATE_POSITION_REQUEST = 'UPDATE_POSITION_REQUEST';
export const USER_UPDATE_POSITION_REQUEST = 'USER_UPDATE_POSITION_REQUEST';
export const USER_UPDATE_POSITION_SUCCESS = 'USER_UPDATE_POSITION_SUCCESS';

//  can we get geolocation data here, and is it as accurate as doing it inside a React Native component?
//   ... because I believe RE relies on the HTML5 api.

export const updatePosition(pos){
	return {
		type: UPDATE_POSITION_REQUEST,
		currentPosition: pos
	}
}

export const userUpdatePositionRequest(){
	return {
		type: USER_UPDATE_POSITION_REQUEST
	}
}

export const userUpdatePositionRequest(){
	return {
		type: USER_UPDATE_POSITION_SUCCESS
	}
}

export const LOAD_MYFILTERS_REQUEST = 'LOAD_MYFILTERS_REQUEST';
export const LOAD_MYFILTERS_SUCCESS = 'LOAD_MYFILTERS_SUCCESS';

export const loadMyFilters = (userData) => {
  return dispatch => {

    dispatch(loadMyFiltersRequest());			

    AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){
            //dispatch(authSuccess());
            return fetch(utils.myFiltersURL+"?username="+userData.username, {
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
  }
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

const loadMyFiltersSuccess = (filtersData) => {
	return {
    	type: LOAD_FILTERSCREATED_SUCCESS,
    	filtersCreated: filtersData
  	}
}


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
