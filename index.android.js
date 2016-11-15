// import React, { Component } from 'react';

// import {
//   AppRegistry,
//   Navigator
// } from 'react-native';

// import {Scene, Router} from 'react-native-router-flux';

// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';

// import uploadReducer from './reducers/uploadReducers';
// import filterReducer from './reducers/filterReducers';
// import authReducer from './reducers/authReducers';
// // 
// const reducer = combineReducers({
//   uploadReducer,
//   filterReducer,
//   authReducer
// })

// const finalCreateStore = compose(
//   applyMiddleware(thunk)
// )(createStore)

// const store = finalCreateStore(reducer)

// // const store = createStore(
// //   reducer,
// //   applyMiddleware(thunk)
// // );

// import ApplyFilter from './components/ApplyFilter'
// import UploadFilter from './components/UploadFilter'
// //import Welcome from './components/Welcome'
// import ChooseDates from './components/ChooseDates'
// import CreateMap from './components/CreateMap'
// import Polygon from './components/Polygon'
// import ChooseFriends from './components/ChooseFriends'
// import ViewBase64 from './components/ViewBase64'
// import SingleEvent from './components/SingleEvent'
// import TakePhoto from './components/TakePhoto'
// import Position from './components/Position'
// import UploadNav from './components/UploadNav'

// import Main from './components/Main'
// import MyFilters from './components/MyFilters'
// import Upload from './components/Upload'
// import Loading from './components/Loading'


// class Fencer extends Component {
//   render() {
//     return (
//       <Provider store={store}>
//         <Router>
//           <Scene key="root" hideNavBar={true}>
//             <Scene key="loading" component={Loading} initial={true}/>
//             <Scene key="main" component={Main} />
//             <Scene key="upload" component={Upload} />
//             <Scene key="myfilters" component={MyFilters} />
//             <Scene key="camera" component={ TakePhoto } />
//             <Scene key="applyfilter" component={ ApplyFilter } />
//           </Scene>
//         </Router>
//       </Provider>
      
//     );
//   }
// }

// AppRegistry.registerComponent('Fencer', () => Fencer);

import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';

import App from './App'

import createStore from './createStore'

const store = createStore()

const Fencer = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

AppRegistry.registerComponent('Fencer', () => Fencer);

