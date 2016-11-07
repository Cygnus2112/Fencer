import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

import Paths from './Paths'

let sampleCoords = [{'lat':34.095529546583535,'lng':-118.37596893310547},{'lat':34.09325506025036,'lng':-118.37588310241699},{'lat':34.09602708232169,'lng':-118.36944580078125},{'lat':34.0980527333467,'lng':-118.36944580078125}];


const injectScript = `
  (function () { 
    document.querySelector('#tryit').innerText = "Work, damn you!";
    if (WebViewBridge) {

      WebViewBridge.onMessage = function (data) {
        let parsedData = JSON.parse(data);
        let message = parsedData.status;
        if (message === "data incoming") {

          let pos = parsedData.payload.position;
          let overlayData = parsedData.payload.coords;

          let paths = overlayData.map((coord) => {
            return new google.maps.LatLng(coord.lat, coord.lng),
          })

          let polygon = new google.maps.Polygon({
            paths: paths
          })

          var myLatLng = new google.maps.LatLng({lat: pos.lat, lng: pos.lng});

          let isInsideBounds = google.maps.geometry.poly.containsLocation(myLatLng, polygon)
          var dataToSend = JSON.stringify({status: "success", isInsideBounds: isInsideBounds});

          WebViewBridge.send(dataToSend);
        }
      };
      WebViewBridge.send(JSON.stringify({status:"ready"}));
    }
  }());`

    // if (WebViewBridge) {

    //   WebViewBridge.send(JSON.stringify({status:"FML!!!!!!"}));

    //   WebViewBridge.onMessage = function (data) {

    //     let parsedData = JSON.parse(data);

    //     let message = parsedData.status;

    //     if (message === "data incoming") {      //parsedData.payload.position.coords.latitude
    //       document.querySelector('#tryit').innerText = data;
    //     }
    //   }
//Object.keys(parsedData.payload)
//Object.keys(parsedData.payload.position.coords)

//  let lat = parsedData.payload.position.coords.latitude

const injectScript2 = `
  (function () { 
    document.querySelector('#tryit').innerText = "Work, damn you!";

    if (WebViewBridge) {
      WebViewBridge.send(JSON.stringify({status:"FML!!!!!!"}));

      WebViewBridge.onMessage = function (data) {
        let parsedData = JSON.parse(data);

        document.querySelector('#whatis').innerText = String(parsedData.payload.position.coords.latitude);
        document.querySelector('#whatis2').innerText = String(parsedData.payload.position.coords.longitude);
      }


    }

    
  }())`

// let ht = `<html><head>
//<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDT_EUBiOzMqTtcOmndgzbJ-vBYlRpFu1k&libraries=places,drawing,geometry"></script>

// </head><body>Hello test html</body></html>`

let ht = `<html><head>
</head><body><h3 id='tryit'>cock</h3><h3 id='whatis'>what is this crap</h3><h3 id='whatis2'>what is this crap</h3><h3 id='whatis3'>what is this crap</h3><div>Hello test html</div></body></html>`

export default class Position extends Component {
  constructor(props){
    super(props);
    this.state = {
      overlayCoords: sampleCoords             // REMEMBER TO CHANGE
    }

  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({
        position: pos
      })
      // currentPosition.lat = pos.coords.latitude;
      // currentPosition.lng = pos.coords.longitude;
    },
    (error) => console.log("Nav error: ", JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000})
  }
      //   <View style={{flex:1}}>
      //   { this.state.position ? <WebBridgeEx position={ this.state.position }/> : <Text style={{fontSize:16}}>Waiting for data...</Text>  }
      // </View>
  render(){
    return(
      <View style={{flex:1}}>
        { this.state.position 
          ? 
          <Paths
            position={ this.state.position } 
            overlayCoords={ this.state.overlayCoords }/> 
          : 
          <Text style={{fontSize:16}}>Waiting for data...</Text>  }
      </View>

      )
  }

}

// class WebBridgeEx extends Component {
//   constructor(props){
//     super(props);
//     this.onBridgeMessage = this.onBridgeMessage.bind(this);

//   }

//   componentDidMount(){

//     // CAN PROB RUN THIS CODE IN WEBVIEW 'onLoad' prop

//     console.log('this.props.position: ', this.props.position);

//     // setTimeout(() => {

//     // },1000)


//   }

//   onBridgeMessage(data){
//     console.log('data: ',data)

//     // const { webviewbridge } = this.refs;

//     // let geoData = {position: this.props.position, coords: sampleCoords};
//     // let dataToSend = {status: 'data incoming', payload: geoData};

//     console.log('JSON.parse(data): ', JSON.parse(data))

//     let parsedData = JSON.parse(data);

//     let message = parsedData.status;

//     switch (message) {
//       case "ready":          // this is the equivalent of 'ready' or 'onready'
//         console.log('ready status message received')
//         webviewbridge.sendToBridge(JSON.stringify(dataToSend));
//         break;
//       case "success":
//         console.log("result: ", parsedData.isInsideBounds);
//         break;
//       case "FML!!!!!!":
//         console.log("yep, FML indeed.");
//         break;
//       default:
//         console.log('default triggered');
//         break;
//     }
//   }

//   render(){
//     return (
//       <View style={{flex:1}}>
//         <WebViewBridge
//           ref="webviewbridge"
//           javaScriptEnabled={true}
//           injectedJavaScript={injectScript2}
//           onBridgeMessage={this.onBridgeMessage}
//           source={{html: ht}}
//           onLoadEnd={
//             const { webviewbridge } = this.refs;
//             let geoData = {position: this.props.position, coords: sampleCoords};
//             let dataToSend = {status: 'data incoming', payload: geoData};
//             console.log('JSON.stringify(dataToSend): ', JSON.stringify(dataToSend));
//             webviewbridge.sendToBridge(JSON.stringify(dataToSend)) }/>
//       </View>
//       )
//   }
// }



        // <WebViewBridge
        //   ref="webviewbridge"
        //   onBridgeMessage={this.onBridgeMessage}
        //   javaScriptEnabled={true}
        //   injectedJavaScript={injectScript}
        //   source={{uri: "https://google.com"}}/>

// let ht2 = `<div>put stuff here</div>`
// let scr = 
//  `(function () {
//     if (WebViewBridge) {

//       // This function gets triggered when data received from React Native app.
//       WebViewBridge.onMessage = function (reactNativeData) {

//         // Converts the payload in JSON format.
//         var jsonData = JSON.parse(reactNativeData);

//         // Data to send from web view to React Native app.
//         var dataToSend = JSON.stringify({success: true, message: 'Data received'});

//         // Keep calm and send the data.
//         WebViewBridge.send(dataToSend);
//       };
//     }
//   }())`

// export default class WebBridgeEx2 extends Component {
//   constructor(){
//     super();
//     this.onBridgeMessage = this.onBridgeMessage.bind(this);

//   }
//   componentDidMount() {
//     console.log('-------------------------------------------')
//     let chartData = {data: '...'};

//     // Send this chart data over to web view after 5 seconds.
//     //setTimeout(() => {
//       this.refs.webviewbridge.sendToBridge(JSON.stringify(chartData));
//     //}, 1000);
//   }

//   onBridgeMessage(webViewData) {
//     let jsonData = JSON.parse(webViewData);

//     if (jsonData.success) {
//       console.log(jsonData.message);
//     }
//     console.log('data received', webViewData, jsonData);
//     //.. do some react native stuff when data is received
//   }

//   render(){
//     return (
//     <View style={{flex:1}}>
//       <WebViewBridge
//         ref="webviewbridge"
//         javaScriptEnabled={true}
//         injectedJavaScript={scr}
//         onBridgeMessage={this.onBridgeMessage}
//         source={ {
//           html: ht2
//         } } />
//     </View>
//       )
//   }

// }

          //     <WebView
          // javaScriptEnabled={true}
          // injectedJavaScript={js}
          // source={{html: ht}}
          // style={{marginTop: 5, height: 100, width:300, backgroundColor: 'white'}}/>

