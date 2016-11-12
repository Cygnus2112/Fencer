import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';

import {Scene, Router} from 'react-native-router-flux';
import ApplyFilter from './components/ApplyFilter'
import UploadFilter from './components/UploadFilter'
import Welcome from './components/Welcome'
import ChooseDates from './components/ChooseDates'
import CreateMap from './components/CreateMap'
import Polygon from './components/Polygon'
import ChooseFriends from './components/ChooseFriends'
import ViewBase64 from './components/ViewBase64'
import MyFilters from './components/MyFilters'
import SingleEvent from './components/SingleEvent'
import TakePhoto from './components/TakePhoto'
import Position from './components/Position'
import UploadNav from './components/UploadNav'

class Fencer extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar={true}>
          <Scene key="myfilters" component={MyFilters}  initial={true}/>
          <Scene key="camera" component={ TakePhoto }  />
          <Scene key="applyfilter" component={ ApplyFilter } />
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('Fencer', () => Fencer);

//import WebBridgeEx from './components/WebBridgeEx'

//<Scene key="bridge" component={WebBridgeEx} initial={ true } />
// <Router>
  // <Scene key="root" hideNavBar={true}>
  //   <Scene key="welcome" component={Welcome} initial={ true } />
  //   <Scene key="dates" component={ChooseDates} />
  //   <Scene key="upload" component={UploadFilter}/>
  //   <Scene key="createmap" component={CreateMap}/>
  //   <Scene key="polygon" component={Polygon}/>
  //   <Scene key="friends" component={ChooseFriends}/>
  //   <Scene key="myfilters" component={MyFilters} />
  // </Scene>
// </Router>

          // <Scene key="myfilters" component={MyFilters}  initial={true}/>
          // <Scene key="camera" component={ TakePhoto }  />
          // <Scene key="applyfilter" component={ ApplyFilter } />


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });


