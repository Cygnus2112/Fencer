import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

import * as authActions from '../actions/authActions';
import * as uploadActions from '../actions/uploadActions';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/Entypo';

import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

class Success extends Component {
	constructor(props){
		super(props);

	}

	componentDidMount(){
		console.log('this.props in Success: ', this.props);
	}

	render(){

		let startDateObj = new Date(this.props.dates.startYear, this.props.dates.startMonth,this.props.dates.startDay,this.props.dates.startHour,this.props.dates.startMinute);
		let endDateObj = new Date(this.props.dates.endYear, this.props.dates.endMonth,this.props.dates.endDay,this.props.dates.endHour,this.props.dates.endMinute);

		let startDate = startDateObj.toLocaleDateString();
		let endDate = endDateObj.toLocaleDateString();

		let startTime = startDateObj.toLocaleTimeString();
		let endTime = endDateObj.toLocaleTimeString();

		return(
			<View style={styles.container}>
				<View style={styles.check} >
					<Image source={require('../assets/check.png')} style={{width: 75, height: 75}}/>
				</View>
				<View style={styles.success}>
					<Text style={{fontSize: 36,fontFamily: 'RobotoCondensed-Regular'} }>
						Success!
					</Text>
				</View>
				<View style={{height:60}}>
					<Text style={[styles.message, {textAlign: 'center', fontSize: 20}]}>
						A new geofilter with the following details has been created:
					</Text>
				</View>

		{/*}	<View style={{flex:2,flexDirection: 'row',width: screenWidth}}> */}
				<View style={styles.details}>
				  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<Text style={styles.message}>
						ID: 
					</Text>
					<Text style={[styles.message,{fontWeight: 'bold'}] }>
						{this.props.id}
					</Text>
				  </View>
				  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<Text style={styles.message}>
						Title: 
					</Text>
					<Text style={[styles.message] }>
						{this.props.title}
					</Text>
				  </View>
				  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<Text style={styles.message}>
						Starts:
					</Text>
					<Text style={[styles.message] }>
					 	{startDate + " " + startTime}
					</Text>
				  </View>
				  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<Text style={styles.message}>
						Ends: 
					</Text>
					<Text style={styles.message}>
						{endDate + " " + endTime}
					</Text>
				</View>




		{/*}		</View>  */}

				<View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
					<Icon name="image" size={45} color="black" style={{marginRight: 20, marginTop: 10} }/>
					<Icon name="map" size={45} color="black" style={{marginLeft: 20, marginTop: 10}}/>
				</View>
			</View>

				<View style={styles.buttons}>
					<TouchableOpacity
		                onPress={() => {	


            let shareText = {
                //  title: "React Native",
                message: "Here is your new Fencer filter: " + this.props.title + " ",
                url: this.props.bitlyURL,
                subject: "Share Link" //  for email
            };

            Share.open(shareText)
            .then((resp) => {
                console.log('successfully sent filter???', resp);
                console.log('#####################################################');
               // this.props.clearProps();
                //Actions.loading();
            })



		                }}
		                style={styles.buttonSend}>
		                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}>Send to Friends!</Text>
		            </TouchableOpacity>
				</View>
				<View style={styles.buttons}>
					<TouchableOpacity
		                onPress={() => {
		                	this.props.loadMyFilters();
		                	this.props.clearProps();
		                }}
		                style={styles.buttonBottom}>
		                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}>View in MyFilters</Text>
		            </TouchableOpacity>
		            <TouchableOpacity
		                onPress={() => {
		                	this.props.clearProps();
		                	setTimeout(() => {
		                		Actions.upload();
		                	},100)
		                }}
		                style={styles.buttonBottom}>
		                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}>Create Another</Text>
		            </TouchableOpacity>

				</View>
			</View>
		)

	}

}

const styles = StyleSheet.create({
	check: {
		flex: 1,
		width: screenWidth,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: 'black',
		borderBottomWidth: 2,
		elevation: 3,

	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	success: {
		flex: 0.7,
		width: screenWidth,
		justifyContent: 'center',
		alignItems: 'center',

	//	borderWidth: 1,
	//	borderColor: 'black'

	},
	message: {
		fontFamily: 'RobotoCondensed-Regular',
		fontSize: 20,
		marginLeft: 10,
		marginRight: 10
	},
	details: {
		flex: 2,
		width: screenWidth,
		flexDirection: 'column',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'black'
	},
	buttons: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: screenWidth
	},
	buttonSend:{
	    width: 200,
	    height: 40,
	    paddingHorizontal: 12,
	    alignItems: 'center',
	    marginHorizontal: 10,
	    backgroundColor: 'blue',
	    paddingHorizontal: 10,
	    paddingVertical: 5,
	    borderRadius: 15,
	    borderColor: 'black', 
	    borderWidth: 1, 
	    elevation: 3
  	},
  	buttonBottom:{
	    width: 150,
	    height: 40,
	    paddingHorizontal: 12,
	    alignItems: 'center',
	    marginHorizontal: 10,
	    backgroundColor: 'blue',
	    paddingHorizontal: 10,
	    paddingVertical: 5,
	    borderRadius: 15,
	    borderColor: 'black', 
	    borderWidth: 1, 
	    elevation: 3
  	}
});

// const mapStateToProps = (state) => {
//   return {

//   }
// }

const mapDispatchToProps = (dispatch) => {
  return {
    loadMyFilters: () => {
      authActions.loadMyFilters(dispatch);
    },
    clearProps: () => {
      uploadActions.clearUploadProps(dispatch);
    }
  }
}

export default connect(null, mapDispatchToProps)(Success);

