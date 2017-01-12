import { AsyncStorage, Image } from 'react-native';
import axios from 'axios';

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

export const LOAD_ALLFILTERS_REQUEST = 'LOAD_ALLFILTERS_REQUEST';
export const LOAD_ALLFILTERS_SUCCESS = 'LOAD_ALLFILTERS_SUCCESS';

export const loadAllFilters = (dispatch, userData) => {
 // return dispatch => {

    dispatch(loadAllFiltersRequest());			

    AsyncStorage.getItem("fencer-token").then((token) => {
        if(token){

          //  console.log("userData.filters: ",userData.filters);

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
 // }
}

const loadAllFiltersRequest = () => {
	return {
    	type: LOAD_ALLFILTERS_REQUEST
  	}
}

const loadAllFiltersSuccess = (filtersData) => {
 // console.log('++++++++++++++++++++');
//  console.log('filtersData in loadAllFiltersSuccess: ', filtersData);
 // console.log('++++++++++++++++++++');
	return {
    	type: LOAD_ALLFILTERS_SUCCESS,
    	allFilters: filtersData
  	}
}

export const LOAD_FILTER_IMAGE_REQUEST = 'LOAD_FILTER_IMAGE_REQUEST';
export const LOAD_FILTER_IMAGE_SUCCESS = 'LOAD_FILTER_IMAGE_SUCCESS';

export const loadFilterImage = (dispatch, data) => {
 // console.log('data in loadFilterImage: ', data);
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
        //  console.log('first response: ', response);
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


export const addFilterByID = (filter) => {
  AsyncStorage.getItem("fencer-token").then((token) => {
    if(token){
      axios({
        method: 'post',
        url: utils.myFiltersURL,
        data: {
          filterID: filter
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': token  
        },
        timeout: 120000
        })
        .then((resp) => {

                //  WILL NEED TO DISPATCH A FUNCTION THAT CLEARS THE FILTERTOUPLOAD PROP

        // console.log('response in addFilterByID: ', resp);
          Actions.loading();
          return resp;
        })
        .catch(err => {
          console.error('Error in addFilterByID:', err);
        });
    } else {
      console.log('token not found in addFilterByID');
    }
        }).done();
  
}

// export const LOAD_FILTERSCREATED_REQUEST = 'LOAD_FILTERSCREATED_REQUEST';
// export const LOAD_FILTERSCREATED_SUCCESS = 'LOAD_FILTERSCREATED_SUCCESS';

// export const loadFiltersCreated = (userData) => {
//   return dispatch => {

//     dispatch(loadFiltersCreatedRequest());			

//     AsyncStorage.getItem("fencer-token").then((token) => {
//         if(token){
//             //dispatch(authSuccess());
//             return fetch(utils.filtersCreatedURL+"?username="+userData.username, {
//       			method: 'GET',
//       			headers: {
//         			'Accept': 'application/json',
//         			'Content-Type': 'application/json',
//         			'x-access-token': token
//       			}
//     		})
//     		.then(response => {
//       			  return response.json();
//     		})
//     		.then(response => {
//             // console.log('response in filter actions: ');
//             // console.log(response);

//       			dispatch(loadFiltersCreatedSuccess(response));
						
//     		})
//     		.catch(err => {
//             	console.error('Error in loadFiltersCreated:', err);
//           	});
            	
//         } else {
//             // dispatch(authFail());
//         }
//     }).done();
//   }
// }

// const loadFiltersCreatedRequest = () => {
// 	return {
//     	type: LOAD_FILTERSCREATED_REQUEST
//   	}
// }

// const loadFiltersCreatedSuccess = (filtersData) => {
// 	return {
//     	type: LOAD_FILTERSCREATED_SUCCESS,
//     	filtersCreated: filtersData
//   	}
// }

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
