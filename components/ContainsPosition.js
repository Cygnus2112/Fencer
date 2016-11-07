import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

import WebViewBridge from 'react-native-webview-bridge';

//        document.querySelector('#tryit2').innerText = String( );
//        let isInsideBounds = new google.maps.geometry.poly.containsLocation(position, polygon);
//let isInsideBounds = "damnit";
//        let checkPos = new google.maps.geometry.poly.containsLocation(position, polygon);


        // let parsedData = JSON.parse(data);
        // let polygon = parsedData.polygon;
        // let position = parsedData.position;
        // document.querySelector('#tryit').innerText = String(position);
        // document.querySelector('#tryit2').innerText = String(polygon);

        // let isInsideBounds = "damnit";

        // let dataToSend = JSON.stringify({status: "success", isInsideBounds: isInsideBounds};

        // WebViewBridge.send(dataToSend);

        //document.querySelector('#tryit2').innerText = String(polygon);
//isInsideBounds: isInsideBounds

const injectScript2 = `
  (function () { 
    if (WebViewBridge) {
      WebViewBridge.send(JSON.stringify({status:"FML!!!!!!"}));
      WebViewBridge.onMessage = function (data) {
      	let parsedData = JSON.parse(data);
        let polygon = parsedData.polygon;
        let position = parsedData.position;
        document.querySelector('#tryit').innerText = String(position);
        document.querySelector('#tryit2').innerText = 'timeout ';

        

        let isInsideBounds = "damnit";
        let dataToSend = JSON.stringify({status: "success", polygon: polygon, position:position });
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
<h3 id='tryit2'>ugh</h3>
<div>Hello test html</div>
</body>
</html>`

export default class ContainsPosition extends Component {
	constructor(props){
		super(props);

		this.onBridgeMessage = this.onBridgeMessage.bind(this);

		this.state = {
			isInsideBounds: null
		}
	}

	componentDidMount(){
		console.log('this.props.polygon in ContainsPosition: ', this.props.polygon)
		console.log('this.props.position in ContainsPosition: ', this.props.position)
		console.log("---------------------------------")

	}

	onBridgeMessage(data){
    	console.log("---------------------------------")

    	let parsedData = JSON.parse(data);
    	let message = parsedData.status;

	    switch (message) {
	      case "success":
	        //console.log("result in ContainsPosition: ", parsedData);
	        console.log("parsedData.position in ContainsPosition: ", parsedData.position);
	        console.log("parsedData.position in ContainsPosition: ", parsedData.polygon);
	        this.setState({
	        	isInsideBounds: parsedData.isInsideBounds
	        });
	        break;
	      case "FML!!!!!!":
	        console.log("FML in ContainsPosition comp !!!!!!");
	        console.log("---------------------------------")
	        break;
	      default:
	        console.log('default triggered');
	        break;
	    }
  	}

	render(){

			// <View style={{flex:1}}>
			// 	{ this.state.isInsideBounds !== null && this.state.isInsideBounds !== undefined
			// 		?
			// 	(<Text style={{fontSize: 18}}>
			// 		isInsideBounds: { String(this.state.isInsideBounds) }
			// 	</Text>)
			// 		:
			// 	(<WebViewBridge
	  //         			ref="webviewbridge"
	  //         			javaScriptEnabled={true}
	  //         			injectedJavaScript={ injectScript2 }
	  //         			onBridgeMessage={ this.onBridgeMessage }
	  //         			source={{ html: ht }}
	  //         			onLoadEnd={() => {
	  //           			const { webviewbridge } = this.refs;
	  //           			let dataToSend = { status: 'data incoming', polygon: this.props.polygon, position: this.props.position };
	  //           			console.log('dataToSend in ContainsPosition: ', JSON.stringify(dataToSend));
	  //           			webviewbridge.sendToBridge(JSON.stringify(dataToSend))
	  //           		}}/>
	            
			// 	)}
			// </View>

		return (

		<View style={{flex:1}}>
			<WebViewBridge
	          			ref="webviewbridge"
	          			javaScriptEnabled={true}
	          			injectedJavaScript={ injectScript2 }
	          			onBridgeMessage={ this.onBridgeMessage }
	          			source={{ html: ht }}
	          			onLoadEnd={() => {
	            			const { webviewbridge } = this.refs;
	            			let dataToSend = { status: 'data incoming', polygon: this.props.polygon, position: this.props.position };
	            			console.log('dataToSend in ContainsPosition: ', JSON.stringify(dataToSend));
	            			webviewbridge.sendToBridge(JSON.stringify(dataToSend))
	            		}}/>

		</View>

		)
	}
}