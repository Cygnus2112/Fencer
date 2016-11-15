import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import uploadReducer from './reducers/uploadReducers';
import filterReducer from './reducers/filterReducers';
import authReducer from './reducers/authReducers';

const middleware = applyMiddleware(thunk);

export default (data = {}) => {
  const rootReducer = combineReducers({
    uploadReducer,
    filterReducer,
    authReducer
  })

  return createStore(rootReducer, data, middleware)
}