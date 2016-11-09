import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get('window');
const screenWidth = width;

export default class SingleEvent extends Component {
	constructor(props){
		super(props);

		this.handleEventPress = this.handleEventPress.bind(this);
		this.state = {
			eventTitle: "",
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: "",
			coords: null,
			eventID: null,
			filterURI: null
		}
	}

	componentDidMount(){
		this.setState({
			eventID: this.props.eventID,
			eventTitle: this.props.eventTitle,
			startDate: this.props.startDate,
			startTime: this.props.startTime,
			endDate: this.props.endDate,
			endTime: this.props.endTime,
			coords: this.props.coords,
			filterURI: this.props.filterURI
		})
	}

	componentWillReceiveProps(newProps,oldProps){
		if(newProps.eventTitle !== oldProps.eventTitle){
			this.setState({
				eventID: this.props.eventID,
				eventTitle: this.props.eventTitle,
				startDate: this.props.startDate,
				startTime: this.props.startTime,
				endDate: this.props.endDate,
				endTime: this.props.endTime,
				coords: this.props.coords,
				filterURI: this.props.filterURI
			})
		}
	}

	handleEventPress(){
		
		Actions.camera({filterURI: this.props.filterURI});

		// either load the filter or an 'out of bounds/event not started yet' popup

		// if within bounds and event dates:
		// 1) launch camera
		// 2) ping API to get filter
		// 3) start minting $$$ bitchezzzzzzzzz

		// we only need to convert an image to base64 if a user chooses to share it.

	}

	render(){
		return (
			<TouchableOpacity onPress={this.handleEventPress} >
				<View style={{height: 120, width: 300, margin:10, padding:10,borderColor: 'black', borderWidth: 2, borderRadius: 4}}>		
					<View style={{flex: 1}}>
						<Text style={{fontSize: 22}}> { this.props.eventTitle } </Text>
						<Text style={{fontSize: 18}}> { this.props.dates } </Text>
					</View>
				</View>
			</TouchableOpacity>
			
			)

	}

}

