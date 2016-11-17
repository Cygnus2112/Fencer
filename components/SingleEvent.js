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

import { connect } from 'react-redux';
import * as filterActions from '../actions/filterActions';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get('window');
const screenWidth = width;

// pass current position (lat lng) as a prop
// open web view bridge and check Google Maps if it's in range

// use linear gradient on red and green lights

class SingleEventComponent extends Component {
	constructor(props){
		super(props);

		this.handleEventPress = this.handleEventPress.bind(this);
		this.state = {
			eventTitle: "",
			startYear: "",
			startMonth: "",
			startDay: "",
			startHour: "",
			startMinute: "",
			endDate: "",
			endHour: "",
			endMinute: "",
			coords: null,
			eventID: null,
			filterURI: null,
			message: "",
			isActive: false,
			isInRange: false					// MIGHT HAVE TO REDUX THIS, GIVEN HOW SLOW GEO IS
		}
	}

	componentDidMount(){
		//console.log("this.props.dates in SingleEvent: ", this.props.dates);
		this.setState({
			eventID: this.props.eventID,
			eventTitle: this.props.title,
			startYear: this.props.dates.startYear,
			startMonth: this.props.dates.startMonth,
			startDay: this.props.dates.startDay,
			startDate: this.props.dates.startDate,
			startHour: this.props.dates.startHour,
			startMinute: this.props.dates.startMinute,
			endDate: this.props.dates.endDate,
			endHour: this.props.dates.endHour,
			endMinute: this.props.dates.endMinute,
			coords: this.props.coords,
			filterURI: this.props.filterURI,
			//filterURI: "../assets/thanksgiving.png",
			message: this.props.message
		})
	}

	// componentWillReceiveProps(newProps,oldProps){
	// 	if(newProps.eventTitle !== oldProps.eventTitle){
	// 		this.setState({
	// 			eventID: this.props.eventID,
	// 			eventTitle: this.props.eventTitle,
	// 			startDate: this.props.startDate,
	// 			startTime: this.props.startTime,
	// 			endDate: this.props.endDate,
	// 			endTime: this.props.endTime,
	// 			coords: this.props.coords,
	// 			filterURI: this.props.filterURI,
	// 			//filterURI: "../assets/thanksgiving.png",
	// 			message: this.props.message
	// 		})
	// 	}
	// }

	handleEventPress(){		
		Actions.camera({filterURI: this.props.image});

		// either load the filter or an 'out of bounds/event not started yet' popup

		// if within bounds and event dates:
		// 1) launch camera
		// 2) ping API to get filter
		// 3) start minting $$$ bitchezzzzzzzzz

		// we only need to convert an image to base64 if a user chooses to share it.

		// TODO: add 'event owner' field to display if the user created the filter?
		//		-- will have extra options (cancel, revise, etc.);

	}
//					<Text style={{fontSize: 14, textAlign: 'center'}}> {this.props.message} </Text>
	render(){
		return (
			<TouchableOpacity onPress={this.handleEventPress} >
				<View style={this.props.isActive ? this.props.isInRange ? [styles.containerActive, {borderColor: 'gold', borderWidth: 2}] : styles.containerActive : styles.containerInactive}>		
					<Text style={this.props.isActive ? styles.textActive : styles.textInactive}> { this.props.title } </Text>
					  {this.props.isActive
					  	?
					  	(<View style={styles.statusMessages}>
					  		<View style={{marginRight: 5,flexDirection:'row', justifyContent: 'center',alignItems: 'center'}}>
								<View style={styles.greenLight} />
								<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, color: 'green',marginBottom:1}}>Active Now</Text>
					  		</View>
					  		
					  		  {this.props.isInRange
					  		  	?
								(<View style={{marginLeft: 5,flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
									<View style={styles.greenLight} />
									<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, color: 'green',marginBottom:1}}>In Range</Text>
								</View>

								)
								:
								(<View style={{marginLeft: 5,flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
									<View style={styles.redLight} />
									<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 14, color: 'red',marginBottom:1}}>Out of Range</Text>
								</View>)
							  }

					  	</View>)
					  	:
					  	(<View style={{flexDirection:'row', justifyContent: 'center',alignItems: 'center'}}>
							<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, textAlign: 'center', color:"#c6c6c6" }}>Filter unlocks <Text style={{fontWeight: 'bold'}}>{_formatDate(this.state.startMonth,this.state.startDay,this.state.startYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.state.startHour, this.state.startMinute)}</Text></Text>
					  	</View>)
					  }
				</View>
			</TouchableOpacity>	
		)
	}
}

const _formatTime = (hour, minute) => {
  let suffix = 'AM';
  if(hour > 12){
    hour = hour - 12;
    suffix = 'PM';
  }
  if(hour === 12){
    suffix = 'PM';
  }
  if(hour === 0){
    hour = 12;
  }
  return hour + ':' + (minute < 10 ? '0' + minute : minute) + suffix;
}

const _formatDate = (m,d,y) => {
	m += 1;
	if(m === 13){
		m = 1;
	}
	return m + "/" + d + "/" + y;
}

const styles = StyleSheet.create({
	containerActive:{
		height: 80, 
		width: 280, 
		margin:10, 
		paddingLeft:5,
		paddingRight:5,
		borderColor: 'black', 
		borderWidth: 1, 
		borderRadius: 4,
		flexDirection: 'column',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		elevation: 5
	},
	containerInactive:{
		height: 80, 
		width: 280, 
		margin:10, 
		paddingLeft:5,
		paddingRight:5,
		borderColor: 'black', 
		borderWidth: 1, 
		borderRadius: 4,
		flexDirection: 'column',
		justifyContent: 'space-around',
		backgroundColor: '#e3e3e5',
		elevation: 5
	},
	textActive: {
		fontSize: 20, 
		color: 'black', 
		textAlign: 'center', 
		fontWeight:'bold',
		fontFamily: 'RobotoCondensed-Regular'
	},
	textInactive: {
		fontSize: 20, 
		color: "#c6c6c6",
		textAlign: 'center', 
		fontWeight:'bold'
	},
	statusMessages: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5
	},
	greenLight:{
		height: 15,
		width: 15,
		backgroundColor: 'green',
		borderRadius: 25,
		marginRight: 5,
		borderColor: 'black',
		borderWidth:1
	},
	redLight:{
		height: 15,
		width: 15,
		backgroundColor: 'red',
		borderRadius: 25,
		marginRight: 5,
		borderColor: 'black',
		borderWidth:1
	}
})

const mapStateToProps = (state) => {
  return {
    currentPosition: state.filterReducer.currentPosition
  }
}

const SingleEvent = connect(mapStateToProps, null)(SingleEventComponent);
export default SingleEvent;

