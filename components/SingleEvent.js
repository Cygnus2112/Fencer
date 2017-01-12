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
			isActive: false,
			isInRange: false,					
			filterImage: null,
			isLoadingFilter: false,
			detailsPressed: false,
			editPressed: false
		}
	}

	componentDidMount(){

		console.log('this.props.bitlyURL: ', this.props.bitlyURL);

        GeoFencing.containsLocation(this.props.currentPosition, this.props.polyCoordsForGeo)
        	.then(() =>	{ 
        		console.log('point is within polygon');
        		this.setState({
        			isInRange: true
        		})	
        	})
        	//this.props.fetchFilterImage({ filterID: this.props.filterID });

      //  if(this.props.isActive){
       		console.log('this.props.filterID in SingleEvent: ', this.props.filterID);
       	//	this.props.fetchFilterImage({ filterID: this.props.filterID });

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

     //  	}

	//	console.log("this.props.coordinates in SingleEvent: ", this.props.coordinates);
		console.log("##################################");
	//	console.log("this.props.filterImage in SingleEvent: ", this.props.filterImage);		//  NULL

		this.setState({
			//eventID: this.props.eventID,
			filterID: this.props.filterID,
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
			coordinates: this.props.coordinates,
		//	filterURI: this.props.filterURI,
			filterImage: this.props.filterImage,
			message: this.props.message
		})
	}

	componentWillReceiveProps(newProps){
		if(newProps.isDeletingFilter === true){						// TEMPORARY WORKAROUND
			this.setState({isLoadingFilter: true});
		}

		if(newProps.isDeletingFilter === false && this.props.isDeletingFilter === true){
			this.props.getMyFilters({username: this.props.username, filters: this.props.myFilters || [] });
			this.setState({isLoadingFilter: false});

			Alert.alert('Success', 'Filter successfully deleted.', [
				{text: 'okay', onPress: () => console.log('okay pressed')}
        	])
		}

		//if(newProps.filterImage !== oldProps.filterImage){
			// console.log('filterImage data received in SingleEvent ');
			// console.log('filterID: ', newProps.filterID);
			// console.log("first 20 chars: ", newProps.filterImage.slice(0,20));
			// console.log("last 20 chars: ", newProps.filterImage.slice(newProps.filterImage.length-20,newProps.filterImage.length-1));
		//}
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
            })}

    handleDetails(){
    	this.setState({ detailsPressed:!this.state.detailsPressed })
    }

    handleEdit(){
    	this.setState({ editPressed:!this.state.editPressed })
    }

	handleEventPress(){		
		//Actions.camera({filterURI: this.props.filterImage});

		// HOW DO WE DELAY THIS TRANSITION UNTIL THE FILTER IS LOADED???

		let start = Date.now();

		this.setState({
			isLoadingFilter: true
		})

		let that = this;

		let interval = setInterval(()=>{
			if(that.state.filterURI){
				clearInterval(interval);
				Actions.camera({filterURI: this.state.filterURI});
				console.log('opening camera. time elapsed: ', Date.now() - start);

				this.setState({
					isLoadingFilter: false
				})
			}
		},50)

		//Actions.camera({filterURI: this.state.filterURI});

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

				  // {this.props.userCreated &&
				  // 	(<View style={styles.bookmarkIcon}>
				  // 		<Text>Cock</Text>
				  //     <Icon name="bookmark" size={30} color="#0c12ce" />
				  // 	</View>)
				  // }
	render(){
		return (
				<View style={this.props.isActive ? this.state.isInRange ? [styles.containerActive, {borderColor: 'gold', borderWidth: 2}] : styles.containerActive : styles.containerInactive}>		

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
					<Text style={this.props.isActive ? styles.textActive : styles.textActive}> { this.props.title } </Text>
					  {this.props.isActive
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
							<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 14, textAlign: 'center', color:"#c6c6c6" }}>Filter unlocks <Text style={{fontWeight: 'bold'}}>{_formatDate(this.state.startMonth,this.state.startDay,this.state.startYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.state.startHour, this.state.startMinute)}</Text></Text>
					  	
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

	render(){
		return(
      	<Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { 

          	console.log("Modal has been closed.")
          }}>
            <View style={styles.modalContainer}>
          {/*    <View style={styles.loadingModal}>           
	            	<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>Fetching filter...</Text>	*/}
	            	<ActivityIndicator style={{alignItems: 'center',justifyContent: 'center',padding: 8}} size={75} color="white" />
	        {/*    </View>	*/}
	        </View>
	    </Modal>
		)
	}
}

class DetailsModal extends Component {
	constructor(props){
		super(props);
		
		this.state = {
      		modalVisible: this.props.modalVisible
    	}
	}

	componentDidMount(){
		console.log('this.props in details modal: ', this.props);
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
          	  <View style={styles.infoModal}>
				<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>Geofilter details</Text>
	            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>Title: {this.props.title}</Text>
	            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color:"#c6c6c6" }}>Starts: <Text style={{fontWeight: 'bold'}}>{_formatDate(this.props.dates.startMonth,this.props.dates.startDay,this.props.dates.startYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.props.dates.startHour, this.props.dates.startMinute)}</Text></Text> 
				<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color:"#c6c6c6" }}>Ends: <Text style={{fontWeight: 'bold'}}>{_formatDate(this.props.dates.endMonth,this.props.dates.endDay,this.props.dates.endYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.props.dates.endHour, this.props.dates.endMinute)}</Text></Text> 
				<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>message: {this.props.message}</Text>  	
	           
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
	    </Modal>
		)
	}
}

class EditModal extends Component {
	constructor(props){
		super(props);
		
		this.state = {
      		modalVisible: this.props.modalVisible
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
          <View style={styles.infoModal}>

	            	<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>Editing details for:</Text>
	            	<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>title: {this.props.title}</Text>
	            		            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color:"#c6c6c6" }}>Starts: <Text style={{fontWeight: 'bold'}}>{_formatDate(this.props.dates.startMonth,this.props.dates.startDay,this.props.dates.startYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.props.dates.startHour, this.props.dates.startMinute)}</Text></Text> 
				<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color:"#c6c6c6" }}>Ends: <Text style={{fontWeight: 'bold'}}>{_formatDate(this.props.dates.endMonth,this.props.dates.endDay,this.props.dates.endYear)}</Text> at <Text style={{fontWeight: 'bold'}}>{_formatTime(this.props.dates.endHour, this.props.dates.endMinute)}</Text></Text> 
				<Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20, color: 'blue'}}>message: {this.props.message}</Text>  	
	           
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
	    </Modal>
		)
	}
}

//<View style={{position: 'absolute', top: 75, left:50, right: 50, bottom: 75, justifyContent: 'center', alignItems: 'center', backgroundColor:'blue',borderWidth:1, borderColor:'black', borderRadius:10}}>
const styles = StyleSheet.create({
	innerContainer: {
		// height: 80, 
		// width: 200, 
		borderColor: 'black', 
		borderWidth: 1, 
		marginLeft:20,
		marginRight:20
	},
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
		// borderWidth: 1,
		// borderColor: 'black',
		position: 'absolute',
		top: 0,
		right: 1,
		paddingTop: 3,
		paddingLeft: 8
	},
	editIcon: {
		height: 30,
		width: 30,
		// borderWidth: 1,
		// borderColor: 'black',
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
    	}
	}
}

const SingleEvent = connect(mapStateToProps, mapDispatchToProps)(SingleEventComponent);
export default SingleEvent;

