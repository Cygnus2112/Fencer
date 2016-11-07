import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

import PolygonData from './PolygonData'

        // document.querySelector('#whatis').innerText = String(parsedData.payload.position.coords.latitude);
        // document.querySelector('#whatis2').innerText = String(parsedData.payload.position.coords.longitude);
//        let overlaydCoords = data.payload;
const injectScript2 = `
  (function () { 
    if (WebViewBridge) {
      WebViewBridge.send(JSON.stringify({status:"FML!!!!!!"}));

      WebViewBridge.onMessage = function (data) {
        let parsedData = JSON.parse(data);
        let overlayCoords = parsedData.payload;
        document.querySelector('#tryit').innerText = String(parsedData.position.lat);
        let paths = overlayCoords.map((coord) => {
            return new google.maps.LatLng(coord.lat, coord.lng)
        });
        let position = new google.maps.LatLng(parsedData.position.lat, parsedData.position.lng);
        var dataToSend = JSON.stringify({status: "success", paths: paths, position: position});
        WebViewBridge.send(dataToSend);
      }
    }  
  }())`

let ht = `<html>
<head>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDT_EUBiOzMqTtcOmndgzbJ-vBYlRpFu1k&libraries=places,drawing,geometry"></script>
</head>
<body>
<h3 id='tryit'>cock</h3>
<h3 id='whatis'>what is this crap</h3>
<h3 id='whatis2'>what is this crap</h3>
<h3 id='whatis3'>what is this crap</h3>
<div>Hello test html</div>
</body>
</html>`


export default class Paths extends Component {
	constructor(props){
		super(props);
		this.onBridgeMessage = this.onBridgeMessage.bind(this);
		this.state = {
			paths: null,
			position: null
		}

	}
	componentDidMount(){
		console.log('this.props.position in Paths: ', this.props.position)
		console.log('this.props.overlayCoords in Paths: ', this.props.overlayCoords)
	}

	onBridgeMessage(data){
    	console.log("---------------------------------")
    	console.log('JSON.parse(data): ', JSON.parse(data))

    	let parsedData = JSON.parse(data);
    	let message = parsedData.status;

	    switch (message) {
	      case "success":
	        console.log("result: ", parsedData.paths);
	        this.setState({
	        	paths: parsedData.paths,
	        	position: parsedData.position
	        })
	        break;
	      case "FML!!!!!!":
	        console.log("yep, FML indeed.");
	        break;
	      default:
	        console.log('default triggered');
	        break;
	    }
  	}



	render(){
		return (
		<View style={{flex:1}}>
			<View style={{flex:1}}>
				<Text style={{fontSize: 18}}>currentPosition lat: </Text>
				<Text style={{fontSize: 18}}>
					{this.props.position.coords.latitude}
				</Text>
				<Text style={{fontSize: 18}}>currentPosition lng: </Text>
				<Text style={{fontSize: 18}}>
					{this.props.position.coords.longitude}
				</Text>
			</View>
			<View style={{flex:2}}>
			{ this.state.paths && this.state.position
				?
			(<PolygonData paths={ this.state.paths } position={this.state.position} />)
				:
			(
				<WebViewBridge
          			ref="webviewbridge"
          			javaScriptEnabled={true}
          			injectedJavaScript={ injectScript2 }
          			onBridgeMessage={ this.onBridgeMessage }
          			source={{ html: ht }}
          			onLoadEnd={() => {
            			const { webviewbridge } = this.refs;
            			let dataToSend = { status: 'data incoming', payload: this.props.overlayCoords, position: {lat: this.props.position.coords.latitude, lng: this.props.position.coords.longitude} };
            			console.log('JSON.stringify(dataToSend): ', JSON.stringify(dataToSend));
            			webviewbridge.sendToBridge(JSON.stringify(dataToSend))
            		}}/>
			)
			}
			</View>
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



