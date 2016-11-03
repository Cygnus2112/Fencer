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
			dates: "",
			coords: null,
			id: null
		}
	}

	componentDidMount(){
		this.setState({
			eventTitle: this.props.eventTitle,
			dates: this.props.dates,
			coords: this.props.coords
		})
	}

	componentWillReceiveProps(newProps,oldProps){
		if(newProps.eventTitle !== oldProps.eventTitle){
			this.setState({
				eventTitle: newProps.eventTitle,
				dates: newProps.dates,
				coords: newProps.coords
			})
		}
	}

	handleEventPress(){
		console.log('event pressed');
		// either load the filter or an 'out of bounds/event not started yet' popup

		// if within bounds and event dates:
		// 1) launch camera
		// 2) ping API to get filter
		// 3) start minting $$$ bitchezzzzzzzzz

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

