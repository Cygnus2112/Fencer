import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    WebView,
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import WebViewBridge from 'react-native-webview-bridge';

  // var myLatLng = new google.maps.LatLng({lat: 34.09824505, lng: -118.35318196}); 
  // console.log("myLatLng: ",myLatLng);

// Will need to 
//    1) Grab current location from navigator;
//    2) Grab fence coords ( ** Google overlay getPath() ** )for every event that is 'active' (ie, within date/time)
//          -- overlay object will be added when event is created
//    3) Send current location and overlay coords to WebView
//    4) Create google LatLng obj, eg -- let myLatLng = new google.maps.LatLng({lat: 34.09824505, lng: -118.35318196}); 
//    5) calculate:  let isInsideBounds = google.maps.geometry.poly.containsLocation(myLatLng, e.overlay)
//    6) send isInsideBounds back to component / parent
//          -- this may take some time, but that's okay, since speed isn't *that* important here
//          -- rxjs and sockets might help speed this stuff up
//          -- can reduxify some of this, but Geometry/isInBounds calculation MUST be done in browser, because Google

//    Will need to pass the COORDINATES, not the polygon overlay. 
//    Can polygon overlay coords this way: 

        // let paths = e.overlay.getPaths();
        // let coords = [];
        
        // paths.forEach((el,idx) => {
        //  // console.log('el.lat: ', el.lat());
        //   el.forEach((el2, idx2) => {
        //     let c = {lat: el2.lat(), lng: el2.lng()}
        //     coords.push(c);      
        //   })
        // })

// then we'll need to rebuild the polygon in the html, like so:

 // var bermudaTriangle = new google.maps.Polygon({
 //    paths: [
 //      new google.maps.LatLng(25.774, -80.190),
 //      new google.maps.LatLng(18.466, -66.118),
 //      new google.maps.LatLng(32.321, -64.757)
 //    ]
 //  });

// then pass into contains location, like so:

//google.maps.geometry.poly.containsLocation(event.latLng, bermudaTriangle)


let lat;
let lng;

let sampleCoords = [{'lat':34.095529546583535,'lng':-118.37596893310547},{'lat':34.09325506025036,'lng':-118.37588310241699},{'lat':34.09602708232169,'lng':-118.36944580078125},{'lat':34.0980527333467,'lng':-118.36944580078125}];

//let parsedCoords = JSON.parse(sampleCoords)

navigator.geolocation.getCurrentPosition((pos) => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
  },
  (error) => console.log("Nav error: ", JSON.stringify(error)),
  {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
)

const html = 
  `<html>
    <head>
      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDT_EUBiOzMqTtcOmndgzbJ-vBYlRpFu1k&libraries=places,drawing,geometry"></script>
    </head>
    <body>
      <h2>Cock!</h2>
      <div id='coords'>
      balls
      </div>
      <script>
        
       
(function () {
  document.querySelector('#coords').innerText = "Work, damn you!";
        if (WebViewBridge) {

      // This function gets triggered when data received from React Native app.
          WebViewBridge.onMessage = function (data) {

        // Converts the payload in JSON format.
            var jsonData = JSON.parse(data);
            var coords = jsonData.currentPosition;
            var overlay = jsonData.overlayData;

            let paths = overlay.map((coord) => {
              return new google.maps.LatLng(coord.lat, coord.lng),
            })

            let polygon = new google.maps.Polygon({
              paths: paths
            })

            var myLatLng = new google.maps.LatLng({lat: coords.lat, lng: coords.lng}); 

        // Passes data to charts for rendering
          //  renderChart(jsonData.data);

        // Data to send from web view to React Native app.
            let isInsideBounds = google.maps.geometry.poly.containsLocation(myLatLng, polygon)

            var dataToSend = JSON.stringify({isInsideBounds: isInsideBounds});
            console.log(dataToSend)
           

           document.querySelector('#coords').innerText = String(dataToSend);

        // Keep calm and send the data.
            WebViewBridge.send(dataToSend);
        };
      }
  }())
      </script>
    </body>
  </html>`



export default class Welcome extends Component{
  constructor(props){
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.loadMyFilters = this.loadMyFilters.bind(this);
    this.onBridgeMessage = this.onBridgeMessage.bind(this);
  }

  componentDidMount(){
    let data = {currentPosition: {lat: lat, lng: lng}, overlayData: sampleCoords }  //  ADD LATER
    setTimeout(() => {
      this.refs.webviewbridge.sendToBridge(JSON.stringify(data))
    },3000)

  }

  handleCreate(){
    Actions.upload();
  }
  loadMyFilters(){
    Actions.myfilters({events: [
      {eventTitle: "Tyson's Cock Party!", dates:'11/4/16 - 11/6/16', coords: null, id:1  }, 
      {eventTitle: "Jazmyne's Gangbang", dates:'11/5/16 - 11/5/16', coords: null, id:2  }, 
      {eventTitle: "Lizzy's Drum Circle", dates:'11/5/16 - 11/5/16', coords: null, id:3  }] 
    })
  }

//justifyContent: 'center', alignItems: 'center'
//containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}

  onBridgeMessage(webViewData){
    let jsonData = JSON.parse(webViewData);

    // if (jsonData.success) {
    //   Alert.alert(jsonData.message);
    // }
    console.log('data received', webViewData, jsonData);

    //.. do some react native stuff when data is received

  }

  render(){
    return (
      <View style={{flex:1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <Text style={{fontSize: 24 }}>
            Welcome!
          </Text>
        </View>
        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:50,
             width: 200,
             overflow:'hidden',
             borderRadius:4,
             borderWidth:2,
             borderColor: 'black',
             backgroundColor: 'blue',
           }}>
              <Button
                style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}
                styleDisabled={{color: 'red'}}
                onPress={ this.handleCreate }>
                Create New Geofilter
              </Button>
          </View>
        </View>
        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:50,
             width: 200,
             overflow:'hidden',
             borderRadius:4,
             borderWidth:2,
             borderColor: 'black',
             backgroundColor: 'blue',
           }}>
              <Button
                style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}
                styleDisabled={{color: 'red'}}
                onPress={ this.loadMyFilters } >
                My Geofilters
              </Button>
          </View>
        </View>
        <View style={{flex:1}}>
          <WebViewBridge
            javaScriptEnabled={true}
            ref="webviewbridge"
            onBridgeMessage={() => {console.log('bridge message sent')}}
            source={ {html: html} }
            style={{marginTop: 5, height: 100, width:300, backgroundColor: 'white'}} />

        </View>
      </View>
    )
  }
}
//           <WebViewBridge
//             javaScriptEnabled={true}
//             ref="webviewbridge"
//             onBridgeMessage={() => {console.log('bridge message sent')}}
//             source={ {html: html} }
//             style={{marginTop: 5, height: 100, width:300, backgroundColor: 'white'}} />


// onBridgeMessage={this.onBridgeMessage.bind(this)}


          // <WebView
          //   javaScriptEnabled={true}
          //   injectedJavaScript={js}
          //   source={{html: html}}
          //   style={{marginTop: 5, height: 100, width:300, backgroundColor: 'white'}}/>

          // <Text style={{fontSize:20}}>
          //   Cock!
          // </Text>

          // <WebView
          //   javaScriptEnabled=true
          //   source={{uri: 'https://facebook.github.io/react/'}}
          //   style={{marginTop: 5, height: 200, width:300, backgroundColor: 'green'}}/>
