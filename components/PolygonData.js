import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

import ContainsPosition from './ContainsPosition'

//document.querySelector('#tryit').innerText = String(parsedData.paths);
     //  document.querySelector('#tryit').innerText = String(paths);
const injectScript2 = `
  (function () { 
    if (WebViewBridge) {
      WebViewBridge.send(JSON.stringify({status:"FML!!!!!!"}));
      WebViewBridge.onMessage = function (data) {
        let parsedData = JSON.parse(data);
        let paths = parsedData.paths;
        let polygon = new google.maps.Polygon({
            paths: paths
         });
        var dataToSend = JSON.stringify({status: "success", polygon: polygon});
        WebViewBridge.send(dataToSend);
      };
    };  
  }())`

let ht = `<html>
<head>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDT_EUBiOzMqTtcOmndgzbJ-vBYlRpFu1k&libraries=places,drawing,geometry"></script>
</head>
<body>
<h3 id='tryit'>cock</h3>
<div>Hello test html</div>
</body>
</html>`

export default class PolygonData extends Component {
	constructor(props){
		super(props);
		this.onBridgeMessage = this.onBridgeMessage.bind(this);
		this.state = {
			renderedPolygon: null
		}
	}

	componentDidMount(){
		// console.log('this.props.position in PolygonData: ', this.props.position)
		// console.log('this.props.paths in PolygonData: ', this.props.paths)
	}

	onBridgeMessage(data){
    	console.log("---------------------------------")
    	//console.log('JSON.parse(data) in PolygonData: ', JSON.parse(data))

    	let parsedData = JSON.parse(data);
    	let message = parsedData.status;

	    switch (message) {
	      case "success":
	        //console.log("result in PolygonData: ", parsedData.polygon);
	        this.setState({
	        	renderedPolygon: parsedData.polygon
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

  	//this.props.position;
  	//this.props.paths

	render(){
		return (

		<View style={{flex:1}}>
			<View style={{flex:1}}>
				<Text style={{fontSize:18}}>PolygonData Component</Text>
			</View>
			<View style={{flex:2}}>
			{ this.state.renderedPolygon
				?
			(<ContainsPosition polygon={ this.state.renderedPolygon } position={ this.props.position } />)
				:
			(<WebViewBridge
          			ref="webviewbridge"
          			javaScriptEnabled={true}
          			injectedJavaScript={ injectScript2 }
          			onBridgeMessage={ this.onBridgeMessage }
          			source={{ html: ht }}
          			onLoadEnd={() => {
            			const { webviewbridge } = this.refs;
            			let dataToSend = { status: 'data incoming', paths: this.props.paths };
            			//console.log('dataToSend in PolygonData: ', JSON.stringify(dataToSend));
            			webviewbridge.sendToBridge(JSON.stringify(dataToSend))
            		}}/>
            
			)}
			</View>
		</View>

			
		)
	}

}