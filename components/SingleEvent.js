import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native';

let utils = require('../utils');

import { connect } from 'react-redux';
import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';

import GeoFencing from 'react-native-geo-fencing';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get('window');
const screenWidth = width;

import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';

// use linear gradient on red and green lights

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

class SingleEventComponent extends Component {
	constructor(props){
		super(props);

		this.handleEventPress = this.handleEventPress.bind(this);
		this.handleTrash = this.handleTrash.bind(this);
		this.handleShare = this.handleShare.bind(this);
		this.handleDetails = this.handleDetails.bind(this);
		this.handleEdit = this.handleEdit.bind(this);

		this.fetchImage = this.fetchImage.bind(this);

		this.currentTime = Date.now();
		this.checkTime = null;

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
			//eventID: null,
			filterID: null,
			filterURI: null,
			message: "",
			isActive: this.props.isActive,
			isInRange: false,					
			filterImage: null,
			isLoadingFilter: false,
			detailsPressed: false,
			editPressed: false,
			isExpired: false
		}
	}

	fetchImage(){
		    AsyncStorage.getItem("fencer-token").then((token) => {
	        	if(token){

	  				return fetch(utils.filterImagesURL+"?filterid="+this.props.filterID, {   
	    			  method: 'GET',
	    			  headers: {
	        			'Accept': 'application/json',
	        			'Content-Type': 'application/json',
	        			'x-access-token': token
	        		  }
	    		 	})
	    		 	.then(response => {
	        			//  console.log('first response: ', response);
	          			return response.json();
	    		 	})
	    		 	.then(response => {

	        			//dispatch(loadFilterImageSuccess(response));
	        			this.setState({
	        				filterURI: response.data
	        			})
	            
	    		 	})
				 	.catch(err => {
				      	console.error('Error in loadFilterImage:', err);
			     	});
	  			} else {
	            	// dispatch(authFail());
	        	}
	    	}).done();
	}

	componentDidMount(){
		this.props.getCurrentTime();

		// this.checkTime = setInterval(() => {
		// 	this.currentTime = Date.now();
		// 	let startTime = this.props.startUTC;
		// 	if(startTime < this.currentTime){
		// 		this.setState({isActive: true})
		// 	}
		// 	let endTime = this.props.endUTC;
		// 	if(this.currentTime > endTime){
		// 		this.setState({isActive: false, isExpired: true})
		// 	}
		// }, 2000);

		if(this.props.currentPosition){

	        GeoFencing.containsLocation(this.props.currentPosition, this.props.polyCoordsForGeo)
	        	.then(() =>	{ 
	        		console.log('point is within polygon');
	        		this.setState({
	        			isInRange: true
	        		})	
	        	})
	        	.catch(() => {
		        	console.log('position is NOT within polygon')
		        })
	        	//this.props.fetchFilterImage({ filterID: this.props.filterID });
        }

        if(this.props.isActive){

        	this.fetchImage();

        }

		let st = new Date(this.props.startUTC);
		let en = new Date(this.props.endUTC);

		this.setState({
			//eventID: this.props.eventID,
			filterID: this.props.filterID,
			eventTitle: this.props.title,
			startYear: st.getFullYear(),
			startMonth: st.getMonth(),
			startDay: st.getDate(),
			startDate: this.props.startUTC,
			startHour: st.getHours(),
			startMinute: st.getMinutes(),
			endMonth: en.getMonth(),
			endDay: en.getDate(),
			endHour: en.getHours(),
			endMinute: en.getMinutes(),
			endYear: en.getFullYear(),
			coordinates: this.props.coordinates,
		//	filterURI: this.props.filterURI,
			filterImage: this.props.filterImage,
			message: this.props.message,
			isActive: this.props.isActive
		})
	}

	componentWillReceiveProps(newProps){
		let startTime = this.props.startUTC;

		if(startTime < newProps.currentTime){
			this.setState({isActive: true})

			if(!this.state.filterURI){
				this.fetchImage();
			}
		}

		let endTime = this.props.endUTC;

		if(newProps.currentTime > endTime){
			this.setState({isActive: false, isExpired: true})
		}


		if(newProps.isDeletingFilter === false && this.props.isDeletingFilter === true){

			this.props.getMyFilters({username: this.props.username, filters: this.props.myFilters || [] });
			
			Alert.alert('Success', 'Filter successfully deleted.', [{text: 'okay', onPress: () => {
				console.log('okay pressed');
				//this.setState({isLoadingFilter: false});
			}}])
		}

		if(newProps.currentPosition !== this.props.currentPosition){

		//	console.warn('new position received in SingleEvent: ', newProps.currentPosition);

			GeoFencing.containsLocation(newProps.currentPosition, this.props.polyCoordsForGeo)
	        	.then(() =>	{ 
	        		console.warn('new position is within polygon');
	        		this.setState({
	        			isInRange: true
	        		})	
	        	})
	        	.catch(() => {
	        		this.setState({
	        			isInRange: false
	        		})	
	        		console.warn('position is NOT within polygon')
	        	})
		}


	}

	componentWillUnmount(){
		//console.warn('componentWillUnmount called in SingleEvent ');
		//clearInterval(this.checkTime);

		this.props.clearTimer();
	}

	handleTrash(){
		Alert.alert('Delete Filter', 'Are you sure you want to delete this filter? This cannot be undone.', [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},, 
			{text: 'yes, delete', onPress: () => {
				this.props.deleteFilter(this.props.filterID);
                //console.log('OK Pressed!');
		    }
        }])
	}

	handleShare(){
		let shareText = {
                //  title: "React Native",
			message: "Hi! I've created a geofilter I wanted to share with you:\n" + this.props.title + "\n" + this.props.bitlyURL + "\nTo access it, first download the Fencer app from the Google Play Store (play.google.com/store/apps/details?id=com.fencer), then open the enclosed link.",
			subject: "You've Got a New Geofilter!" 
        };

        Share.open(shareText)
            .then((resp) => {
             //   console.log('successfully sent filter???', resp);
             //   console.log('#####################################################');
               // this.props.clearProps();
                //Actions.loading();
            })}

    handleDetails(){
    	this.setState({ detailsPressed:!this.state.detailsPressed })
    }

    handleEdit(){
    	this.setState({ editPressed:!this.state.editPressed })
    }

	handleEventPress(){		
		// HOW DO WE DELAY THIS TRANSITION UNTIL THE FILTER IS LOADED???

		if(this.state.isExpired){
			Alert.alert('Geofilter Expired', 'This Geofilter expired on '+_formatDate(this.state.startMonth,this.state.startDay,this.state.startYear) +' at '+_formatTime(this.state.startHour, this.state.startMinute)+'.', [{text: 'okay', onPress: () => {
				console.log('okay pressed');
				this.setState({isLoadingFilter: false});
			}}])

		} else if(!this.state.isActive){
			Alert.alert('Geofilter Not Active Yet', 'This Geofilter does not become active until '+_formatDate(this.state.startMonth,this.state.startDay,this.state.startYear) +' at '+_formatTime(this.state.startHour, this.state.startMinute)+'.', [{text: 'okay', onPress: () => {
				console.log('okay pressed');
				this.setState({isLoadingFilter: false});
			}}])


		} else {
			if(!this.state.isInRange){
				Alert.alert('Out of Range', "You are out of range of this Geofilter's designated geofence area.", [{text: 'okay', onPress: () => {
					console.log('okay pressed');
					this.setState({isLoadingFilter: false});
				}}])


			} else {
				let start = Date.now();
				this.setState({
					isLoadingFilter: true
				})
				let that = this;
				let interval = setInterval(()=>{
					if(that.state.filterURI){
						clearInterval(interval);
						Actions.camera({filterURI: this.state.filterURI, endTime: this.props.endUTC});
					//	console.log('opening camera. time elapsed: ', Date.now() - start);

						setTimeout(() => {
							this.setState({
								isLoadingFilter: false
							})
						},50)
						clearInterval(this.checkTime);
					}
				},50)
			}	
		}
	}

	render(){
		return (
				<View style={this.state.isActive ? this.state.isInRange ? [styles.containerActive, {borderColor: 'gold', borderWidth: 2}] : styles.containerActive : styles.containerInactive}>		

			  	  {this.props.userCreated &&
				  	(<View style={styles.bookmarkIcon}>
				      <Icon name="bookmark" size={20} color="#0c12ce" />
				  	</View>
				  	)
				  }
				  {this.props.userCreated &&
				  	(
				  	<View style={styles.trashIcon}>
				  	  <TouchableOpacity onPress={this.handleTrash} >
				      	<Icon name="trash-o" size={22} color="black" />
				      </TouchableOpacity>
				  	</View>
				  	)
				  }
				  {this.props.userCreated &&
				  	(
				  	<View style={styles.shareIcon}>
				  	  <TouchableOpacity onPress={this.handleShare} >
				        <Icon name="share-alt" size={20} color="black" />
				      </TouchableOpacity>
				  	</View>
				  	)
				  }
			{/*	  {this.props.userCreated && !this.props.isActive ?
				  	(  
				  	<View style={styles.editIcon}>
				  	  <TouchableOpacity onPress={this.handleEdit} >
				        <Icon name="edit" size={20} color="black" />
				      </TouchableOpacity>
				  	</View>
			   	)
				  	:    
				  	(    */}
				  	<View style={styles.editIcon}>
				  	  <TouchableOpacity onPress={this.handleDetails} >
				      	<Icon name="file-text-o" size={17} color="black" />
				      </TouchableOpacity >
				  	</View>
			{/*		  	)
				  }*/}

				  <TouchableOpacity onPress={this.handleEventPress} style={styles.innerContainer} >
					<Text style={this.state.isActive ? styles.textActive : styles.textActive}> { this.props.title } </Text>
					  {this.state.isActive
					  	?
					  	(<View style={styles.statusMessages}>
					  		<View style={{marginRight: 5,flexDirection:'row', justifyContent: 'center',alignItems: 'center'}}>
								<View style={styles.greenLight} />
								<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, color: 'green',marginBottom:1}}>Active Now</Text>
					  		</View>
					  		
					  		  {this.state.isInRange
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
					  		{this.state.isExpired
					  		  	?
							  (<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, textAlign: 'center', color:"#c6c6c6" }}>Filter expired <Text style={{fontWeight: 'bold'}}>{_formatDate(this.state.endMonth,this.state.endDay,this.state.endYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.state.endHour, this.state.endMinute)}</Text></Text>)
					  		  	:
							  (<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, textAlign: 'center', color:"#c6c6c6" }}>Filter unlocks <Text style={{fontWeight: 'bold'}}>{_formatDate(this.state.startMonth,this.state.startDay,this.state.startYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.state.startHour, this.state.startMinute)}</Text></Text>)
					  		}
							
					  	</View>)
					  }
				  </TouchableOpacity>	
					{this.state.isLoadingFilter || this.props.isDeletingFilter
						?
					(<LoadingModal modalVisible={true} toggleModal={() => {this.setState( {isLoadingFilter:false}) } } />)
						:
					this.state.detailsPressed
						?
					(<DetailsModal modalVisible={true} toggleModal={() => { this.handleDetails() }} {...this.props} />)
						:
					this.state.editPressed
						?
					(<EditModal modalVisible={true} toggleModal={() => { this.handleEdit() }} {...this.props} />)	
						:
					(null)
					}

				</View>
			

		)
	}
}

class LoadingModal extends Component {
	constructor(props){
		super(props);
		
		this.state = {
      		modalVisible: this.props.modalVisible
    	}
	}

	componentDidMount(){
		console.log('LoadingModal mounted ...');
	}

	render(){
		return(
      	<Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { 

          	console.log("Modal has been closed.")
          }}>
            <View collapsable={false} style={styles.modalContainer}>
          {/*    <View style={styles.loadingModal}>           
	            	<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>Fetching filter...</Text>	*/}
<ActivityIndicator style={{alignItems: 'center',justifyContent: 'center',padding: 8}} size={75} color="white" />
	      {/*     </View>	*/}
	        </View>
	    </Modal>
		)
	}
}

//	            	

class DetailsModal extends Component {
	constructor(props){
		super(props);
		
		this.state = {
      		modalVisible: this.props.modalVisible,
      		startYear: new Date(this.props.startUTC).getFullYear(),
      		startMonth: new Date(this.props.startUTC).getMonth(),
      		startDay: new Date(this.props.startUTC).getDate(),
      		startHour: new Date(this.props.startUTC).getHours(),
      		startMinute: new Date(this.props.startUTC).getMinutes(),
      		endYear: new Date(this.props.endUTC).getFullYear(),
      		endMonth: new Date(this.props.endUTC).getMonth(),
      		endDay: new Date(this.props.endUTC).getDate(),
      		endHour: new Date(this.props.endUTC).getHours(),
      		endMinute: new Date(this.props.endUTC).getMinutes()
      	}
	}

	render(){
		return(
      	<Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { 
          	          	this.props.toggleModal();
          	console.log("Modal has been closed.")}}>
            <View style={styles.modalContainer}>
          	  	<View style={this.props.message.length ? styles.infoModal : [styles.infoModal, {top: 120, bottom: 120}]}  >

	          	    <View style={{position: 'absolute', top: 15, left: 10, right: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
					  <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 20, margin: 5, textDecorationLine: 'underline' }}>Geofilter Details</Text>
		            </View>

		              <View style={styles.details}>
		                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
			            	<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>Title:</Text>
			            	<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>{this.props.title}</Text>
			            </View>
			            {!this.state.isActive &&
			              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
			            	<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>Starts:</Text> 
			            	<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>{_formatDate(this.state.startMonth, this.state.startDay, this.state.startYear)} at {_formatTime(this.state.startHour, this.state.startMinute)}</Text>
						  </View>
						}    
						<View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>       
							<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>Ends:</Text> 
							<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>{_formatDate(this.state.endMonth, this.state.endDay, this.state.endYear)} at {_formatTime(this.state.endHour, this.state.endMinute)}</Text>
						</View>
						{this.props.message.length 
							? 
						  (<View>
							  <View style={{flexDirection: 'row', justifyContent: 'center'}}>    
								<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize:18, margin: 5, textDecorationLine: 'underline' }}>Message</Text>  	
				              </View>
				              <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>  

				            	  <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize:18, margin: 5 }}>{'"'}{this.props.message}{'"'}</Text>
				          
				              </View>
				            </View>)
						  	:
						  	(null)
			            }
		              </View>

		             	<View style={{position: 'absolute', bottom: 15, left: 10, right: 10, flexDirection: 'row', justifyContent: 'center'}}> 
				           	<TouchableHighlight 
			                  style={{height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
			                  onPress={() => {
			                    this.props.toggleModal();
			                    this.setState({modalVisible: !this.state.modalVisible})
			                  }
			                }>
			              	  	<Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
			            	</TouchableHighlight>
		            	</View>

	          	</View>
	        </View>
	    </Modal>
		)
	}
}

const styles = StyleSheet.create({
	details: {
		position: 'absolute',
		top: 75,
		left: 5, 
		right: 5
	},
	innerContainer: {
		// height: 80, 
		// width: 200, 
		// borderColor: 'black', 
	 //    borderWidth: 1, 
		marginLeft:20,
		marginRight:20,
		marginBottom: 25
	},
	containerActive:{
		height: 100, 
		//width: 280, 
		width: screenWidth - 20,
		margin: 7, 
		paddingLeft:5,
		paddingRight:5,
		borderColor: 'black', 
		borderWidth: 1, 
		borderRadius: 4,
		flexDirection: 'column',
	//	justifyContent: 'space-around',
	    justifyContent: 'center',
		backgroundColor: 'white',
		elevation: 5
	},
	containerInactive:{
		height: 100, 
		//width: 280, 
		width: screenWidth - 20,
		margin: 7, 
		paddingLeft:5,
		paddingRight:5,
		borderColor: 'black', 
		borderWidth: 1, 
		borderRadius: 4,
		flexDirection: 'column',
	//	justifyContent: 'space-around',
	//	justifyContent: 'flex-start',
	    justifyContent: 'center',
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
		paddingTop: 2,
		// borderColor: 'black',
		// borderWidth:1
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
	},
	bookmarkIcon: {
		height: 20,
		width: 20,
		// borderWidth: 1,
		// borderColor: 'black',
		position: 'absolute',
		top: -2,
		left: 10
	},
	trashIcon: {
		height: 30,
		width: 30,
		// borderWidth: 1,
		// borderColor: 'black',
		position: 'absolute',
		bottom: 1,
		right: 1,
		paddingTop: 4,
		paddingLeft: 8
	},
	shareIcon: {
		height: 30,
		width: 30,
		position: 'absolute',
		// top: 0,
		// right: 1,
		bottom: 0,
		left: (screenWidth/2) - 25,
		paddingTop: 3,
		paddingLeft: 8
	},
	editIcon: {
		height: 30,
		width: 30,
		position: 'absolute',
		bottom: 1,
		left: 1,
		paddingTop: 7,
		paddingLeft: 4,
		//zIndex:3
	},
	modalContainer: {
	    position: 'absolute', 
	    top: 0, 
	    left: 0, 
	    right: 0, 
	    bottom: 0, 
	    backgroundColor: 'rgba(0,0,0,0.5)',
	    justifyContent: 'center',
	    alignItems: 'center'
	},
  	loadingModal: {
	    position: 'absolute', 
	    top: 60, 
	    left:40, 
	    right: 40, 
	    bottom: 60, 
	    justifyContent: 'center', 
	    alignItems: 'center', 
	   // backgroundColor:'white',
	    backgroundColor: 'white',
	    borderWidth:1, 
	    borderColor:'black', 
	    borderRadius:10,
	    padding: 10
  	},
  	infoModal: {
	    position: 'absolute', 
	    top: 60, 
	    left: 30, 
	    right: 30, 
	    bottom: 60, 
	    justifyContent: 'center', 
	    alignItems: 'flex-start', 
	   // backgroundColor:'white',
	    backgroundColor: 'white',
	    borderWidth:1, 
	    borderColor:'black', 
	    borderRadius:10,
	    padding: 5
    }
})

const mapStateToProps = (state) => {
  return {
    currentPosition: state.filterReducer.currentPosition,
    //username: state.authReducer.username,
    filterImage: state.filterReducer.filterImage,
    isDeletingFilter: state.authReducer.isDeletingFilter,
    myFilters: state.authReducer.myFilters,
    username: state.authReducer.username,
    currentTime: state.authReducer.currentTime,
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
		// fetchFilterImage: (data) => {
		// 	filterActions.loadFilterImage(dispatch, data);
		// },
		deleteFilter: (filterID) => {
			authActions.deleteFilter(dispatch, filterID);
		},
		getMyFilters: (data) => {
    		filterActions.loadAllFilters(dispatch, {username: data.username, filters: data.filters});
    	},
    	getCurrentTime: () => {
    		authActions.getCurrentTime(dispatch);
    	},
    	clearTimer: () => {
    		authActions.clearTimer(dispatch);
    	}
	}
}

const SingleEvent = connect(mapStateToProps, mapDispatchToProps)(SingleEventComponent);
export default SingleEvent;

