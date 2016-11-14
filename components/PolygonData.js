import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

import ContainsPosition from './ContainsPosition'

const injectScript2 = `
  (function () { 
    if (WebViewBridge) {
      WebViewBridge.send(JSON.stringify({status:"FML!!!!!!"}));
      WebViewBridge.onMessage = function (data) {
        let parsedData = JSON.parse(data);
        let paths = parsedData.paths;
        let position = parsedData.position;
        document.querySelector('#tryit').innerText = String(position);
        document.querySelector('#tryit2').innerText = String(paths);

        let polygon = new google.maps.Polygon({
            paths: paths
         });

        let myLatLng;

        setTimeout(() => {
        	myLatLng = new google.maps.LatLng({lat: position.lat, lng: position.lng}); 
        	document.querySelector('#tryit2').innerText = String(position.lat);

        },100);
        let isInsideBounds;
        setTimeout(() => {
        	isInsideBounds = google.maps.geometry.poly.containsLocation(myLatLng, polygon);
        },500);
        setTimeout(() => {	
	        document.querySelector('#tryit').innerText = isInsideBounds;
	        let dataToSend = JSON.stringify({status: "success", isInsideBounds: isInsideBounds });
	        WebViewBridge.send(dataToSend);
    	},1000);


      };
    };  
  }())`

//var dataToSend = JSON.stringify({status: "success", polygon: testPolygon});
//WebViewBridge.send(dataToSend);
let ht = `<html>
<head>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDT_EUBiOzMqTtcOmndgzbJ-vBYlRpFu1k&libraries=places,drawing,geometry"></script>
</head>
<body>
<h3 id='tryit'>bleh</h3>
<h3 id='tryit2'>bleh</h3>
<div>Hello test html</div>
</body>
</html>`

class PolygonDataComponent extends Component {
	constructor(props){
		super(props);
		this.onBridgeMessage = this.onBridgeMessage.bind(this);
		this.state = {
			isInsideBounds: null
		}
	}

	onBridgeMessage(data){
    	console.log("---------------------------------")
    	console.log('string data in PolygonData: ', data)

    	let parsedData = JSON.parse(data);
    	let message = parsedData.status;

    	    	console.log("parsedData in PolygonData: ", parsedData);

	    switch (message) {
	      case "success":
	        
	        this.setState({
	        	isInsideBounds: parsedData.isInsideBounds
	        });
	        break;
	      case "FML!!!!!!":
	        console.log("FML in PolygonData comp !!!!!!");
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
				<Text style={{fontSize:18}}>PolygonData Component</Text>
			</View>
			<View style={{flex:2}}>
			{ this.state.isInsideBounds !== null && this.state.isInsideBounds !== undefined
				?
			(<Text style={{fontSize: 18}}>isInsideBounds: {String(this.state.isInsideBounds)}</Text>)
				:
			(<WebViewBridge
          			ref="webviewbridge"
          			javaScriptEnabled={true}
          			injectedJavaScript={ injectScript2 }
          			onBridgeMessage={ this.onBridgeMessage }
          			source={{ html: ht }}
          			onLoadEnd={() => {
            			const { webviewbridge } = this.refs;
            			let dataToSend = { status: 'data incoming', paths: this.props.paths, position: this.props.position };
            			//console.log('dataToSend in PolygonData: ', JSON.stringify(dataToSend));
            			webviewbridge.sendToBridge(JSON.stringify(dataToSend))
            		}}/>
            
			)}
			</View>
		</View>		
		)
	}
}

const PolygonData = PolygonDataComponent;
export default PolygonData;
