import { AsyncStorage, Image } from 'react-native';
import axios from 'axios';

let utils = require('../utils');

import { Actions } from 'react-native-router-flux';

export const UPDATE_POSITION_REQUEST = 'UPDATE_POSITION_REQUEST';
export const UPDATE_POSITION_SUCCESS = 'UPDATE_POSITION_SUCCESS';

export const initPosition = (dispatch) => {
    dispatch(updatePositionRequest());

    navigator.geolocation.getCurrentPosition((pos) => {
        let newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        dispatch( updatePositionSuccess(newPos) );
      },
      (error) => {
        let tempPos = { lat: 41.5904151, lng: -93.80708270000002 };
        dispatch( updatePositionSuccess(tempPos) );
        console.log("Nav error: ", JSON.stringify(error)) 
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
}

export const updatePosition = (dispatch, data) => {
	dispatch( updatePositionRequest() );
  dispatch( updatePositionSuccess(data) );
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

export const WATCH_POSITION_REQUEST = 'WATCH_POSITION_REQUEST';

let watches = [];
let intervals = [];

export const watchPosition = (dispatch) => {  
  dispatch(watchPositionRequest());

  let watch = navigator.geolocation.watchPosition((pos) => {
        let newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if(watches.length){
          let prevWatch = watches.shift();
          navigator.geolocation.clearWatch(prevWatch);
        }

        dispatch( updatePositionSuccess(newPos) );
      },
      (error) => {
        console.log("Nav error: ", JSON.stringify(error)) 
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 20000}
    );
    watches.push(watch);

  let interval = setInterval(() => {
    if(intervals.length){
      clearInterval(intervals.shift());
    }

    dispatch(watchPositionRequest());

    watch = navigator.geolocation.watchPosition((pos) => {
        let newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
       console.log('position in watchPosition: ', newPos);
        if(watches.length){
          let prevWatch = watches.shift();
          navigator.geolocation.clearWatch(prevWatch);
        }

        dispatch( updatePositionSuccess(newPos) );
      },
      (error) => {
        console.log("Nav error: ", JSON.stringify(error)) 
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 20000}
    );
    watches.push(watch);
  },90000);

  intervals.push(interval);
}

const watchPositionRequest = () => {
  return {
    type: WATCH_POSITION_REQUEST
  }
}

export const clearWatch = (dispatch) => {
  dispatch(() => {
    watches.forEach((w) => {
      navigator.geolocation.clearWatch(w);
    });
    intervals.forEach((i) => {
      clearInterval(i);
    })
  })
}

export const LOAD_ALLFILTERS_REQUEST = 'LOAD_ALLFILTERS_REQUEST';
export const LOAD_ALLFILTERS_SUCCESS = 'LOAD_ALLFILTERS_SUCCESS';

export const loadAllFilters = (dispatch, userData) => {
    dispatch(loadAllFiltersRequest());		

    AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){
          let filters = JSON.stringify(userData.filters);
          return fetch(utils.allFiltersURL +"?username="+userData.username+"&filters="+filters, {   
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
      			dispatch(loadAllFiltersSuccess(response));
    		  })
    		  .catch(err => {
            	console.error('Error in loadAllFilters:', err);
          });
        } else {
            // dispatch(authFail());
        }
    }).done();
}

const loadAllFiltersRequest = () => {
	return {
    	type: LOAD_ALLFILTERS_REQUEST
  	}
}

const loadAllFiltersSuccess = (filtersData) => {
	return {
    	type: LOAD_ALLFILTERS_SUCCESS,
    	allFilters: filtersData
  	}
}

export const LOAD_FILTER_IMAGE_REQUEST = 'LOAD_FILTER_IMAGE_REQUEST';
export const LOAD_FILTER_IMAGE_SUCCESS = 'LOAD_FILTER_IMAGE_SUCCESS';

export const loadFilterImage = (dispatch, data) => {
    dispatch(loadFilterImageRequest());      

    AsyncStorage.getItem("fencer-token").then((token) => {
      if(token){

        return fetch(utils.filterImagesURL+"?filterid="+data.filterID, {   
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
          dispatch(loadFilterImageSuccess(response));
        })
        .catch(err => {
            console.error('Error in loadFilterImage:', err);
        });
      } else {
            // dispatch(authFail());
      }
    }).done();                    
}

const loadFilterImageRequest = () => {
  return {
      type: LOAD_FILTER_IMAGE_REQUEST
    }
}

const loadFilterImageSuccess = (filterImageData) => {
  return {
      type: LOAD_FILTER_IMAGE_SUCCESS,
      filterImage: filterImageData.data
    }
}


export const addFilterByID = (dispatch, data) => {
  AsyncStorage.getItem("fencer-token").then((token) => {
    if(token){
      axios({
        method: 'post',
        url: utils.myFiltersURL,
        data: {
          filterID: data.filter,
          isSearch: data.isSearch,
          isReferral: data.isReferral
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': token  
        },
        timeout: 120000
        })
        .then((resp) => {
          if( resp.data['NOTFOUND'] ){

            dispatch(searchError('NOTFOUND', resp.data['NOTFOUND']));

            if(!data.isSearch){
              Actions.loading();        
            }

          } else if(resp.data['ALREADYADDED']) {
            dispatch(searchError('ALREADYADDED', resp.data['ALREADYADDED']));

            if(!data.isSearch){
              Actions.loading();        
            }

          } else if(resp.data['EXPIRED']) {
            dispatch(searchError('EXPIRED', resp.data['EXPIRED']));

            if(!data.isSearch){
              Actions.loading();        
            }

          } else if(data.isSearch){
            dispatch(newFilterAddedRequest(data.filter));
            dispatch( addToMyFilters(data.filter) );

          } else {
            dispatch(newFilterAddedRequest(data.filter));
            dispatch( addToMyFilters(data.filter) );

            Actions.loading({isReferral: true});

            return resp;
          }
        })
        .catch(err => {
          console.error('Error in addFilterByID:', err);
        });
    } else {
      console.log('token not found in addFilterByID');
    }
  }).done();
}

export const SEARCH_ERROR = 'SEARCH_ERROR';

const searchError = (code, message) => {
  return {
    type: SEARCH_ERROR,
    code: code,
    message: message
  }
}

export const CLEAR_SEARCH_ERROR = 'CLEAR_SEARCH_ERROR';

export const clearSearchError = (dispatch) => {
  dispatch(clearSearchErrorRequest());
}

const clearSearchErrorRequest = () => {
  return {
    type: CLEAR_SEARCH_ERROR
  }
}

export const NEW_FILTER_ADDED = 'NEW_FILTER_ADDED';

const newFilterAddedRequest = (filter) => {
  return {
    type: NEW_FILTER_ADDED,
    filter: filter
  }
}

export const ADD_TO_MYFILTERS = 'ADD_TO_MYFILTERS';

export const addToMyFilters = (filter) => {
  return {
    type: ADD_TO_MYFILTERS,
    filter: filter
  }
}

export const CLEAR_NEW_FILTER = 'CLEAR_NEW_FILTER';

export const clearNewFilter = (dispatch) => {
  dispatch(clearNewFilterRequest());
}

const clearNewFilterRequest = () => {
  return {
    type: CLEAR_NEW_FILTER
  }
}