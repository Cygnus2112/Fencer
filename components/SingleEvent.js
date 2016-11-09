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


// pass current position (lat lng) as a prop
// open web view bridge and check Google Maps if it's in range

// use linear gradient on red and green lights


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
			filterURI: null,
			message: "",
			isActive: false,
			isInRange: false					// MIGHT HAVE TO REDUX THIS, GIVEN HOW SLOW GEO IS
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
			filterURI: this.props.filterURI,
			message: this.props.message
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
				filterURI: this.props.filterURI,
				message: this.props.message
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

		// TODO: add 'event owner' field to display if the user created the filter?
		//		-- will have extra options (cancel, revise, etc.);

	}

	render(){
		return (
			<TouchableOpacity onPress={this.handleEventPress} >
				<View style={styles.container}>		
					<Text style={{fontSize: 18, textAlign: 'center', fontWeight:'bold'}}> { this.props.eventTitle } </Text>
					<Text style={{fontSize: 14, textAlign: 'center'}}> {this.props.message} </Text>
					<View style={styles.statusMessages}>
					  <View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center'}}>
						<View style={styles.greenLight} />
						<Text style={{fontSize: 14, color: 'green'}}>Active Now</Text>
					  </View>
					  <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
						<View style={styles.redLight} />
						<Text style={{fontSize: 14, color: 'red'}}>Out of Range</Text>
					  </View>
					</View>
				</View>
			</TouchableOpacity>	
		)
	}
}

const styles = StyleSheet.create({
	container:{
		height: 110, 
		width: 280, 
		margin:10, 
		paddingLeft:5,
		paddingRight:5,
		borderColor: 'black', 
		borderWidth: 1, 
		borderRadius: 4,
		flexDirection: 'column',
		justifyContent: 'space-around',
		backgroundColor: 'white'
	},
	statusMessages: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 5
	},
	greenLight:{
		height: 15,
		width: 15,
		backgroundColor: 'green',
		borderRadius: 25,
		marginRight: 5
	},
	redLight:{
		height: 15,
		width: 15,
		backgroundColor: 'red',
		borderRadius: 25,
		marginRight: 5
	}
})

