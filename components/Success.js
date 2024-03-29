import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableNativeFeedback,
    Dimensions,
    Text,
    TouchableOpacity,
    BackAndroid,
    Clipboard,
    ToastAndroid,
    Modal,
    ActivityIndicator
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

class Success extends Component {
	constructor(props){
		super(props);

		this.state = {
			isLoadingMyFilters: false
		}

		this.onBackPress = this.onBackPress.bind(this);

	}

	onBackPress(){
	   // console.log('back button pressed in SUCCESS');
	    return true;
  	}

	componentDidMount(){
		//console.log('this.props in Success: ', this.props);
	
	    BackAndroid.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount(){
   // console.log('main SUCCESS component unmounting...')

    BackAndroid.removeEventListener('hardwareBackPress', this.onBackPress);

  }

	render(){

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
						New geofilter created. 
					</Text>
					<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
					<Text style={[styles.message, {textAlign: 'center', fontSize: 20}]}>ID: <Text style={{fontWeight: 'bold'}}>{this.props.id} </Text></Text>
						<TouchableOpacity onPress={()=>{
							Clipboard.setString(this.props.id);
							ToastAndroid.showWithGravity('Geofilter ID copied to clipboard!', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
						}}>
							<Icon name="clipboard" size={20} color="#0c12ce"/>
						</TouchableOpacity>
					</View>
	
				</View>

				<View style={styles.buttons}>
					<TouchableOpacity
		                onPress={() => {	
				            let shareText = {
				                //  title: "React Native",
			message: "Hi! I've created a geofilter I wanted to share with you:\n" + this.props.title + "\n" + this.props.bitlyURL + "\nTo access it, first download the Fencer app from the Google Play Store (play.google.com/store/apps/details?id=com.fencer), then open the enclosed link.",
			subject: "You've Got a New Geofilter!" 
				            };

				            Share.open(shareText)
				            .then((resp) => {
				                console.log('successfully sent filter???', resp);
				                console.log('#####################################################');

				            })
		                }}
		                style={styles.buttonSend}>
		                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 18, color: 'white'}}>Send to Friends!</Text>
		            </TouchableOpacity>
				</View>
				<View style={[styles.buttons,{top: 460}]}>
					<TouchableOpacity
		                onPress={() => {
		                	this.setState({
		                		isLoadingMyFilters: true
		                	})
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
				{this.state.isLoadingMyFilters
						&&
					(<LoadingModal modalVisible={true} toggleModal={() => {this.setState( {isLoadingMyFilters:false}) } } />)
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
              <ActivityIndicator style={{alignItems: 'center',justifyContent: 'center',padding: 8}} size={75} color="white" />
	        </View>
	    </Modal>
		)
	}
}

const styles = StyleSheet.create({
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
	check: {
		position: 'absolute',
		top: 0,
		width: screenWidth,
		height: 150,
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
	// success: {
	// 	flex: 0.7,
	// 	width: screenWidth,
	// 	justifyContent: 'center',
	// 	alignItems: 'center'
	// },
	success: {
		position: 'absolute',
		width: screenWidth,
		top: 150,
		height: 130,
		justifyContent: 'center',
		alignItems: 'center'
	},
	message: {
		fontFamily: 'RobotoCondensed-Regular',
		fontSize: 20,
		marginLeft: 10,
		marginRight: 10
	},
	details: {
		position: 'absolute',
		top: 280,
		width: screenWidth,
		height: 110,
		flexDirection: 'column',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'black'
	},
	buttons: {
		position: 'absolute',
		top: 390,
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
      authActions.loadMyFilters(dispatch,true);
    },
    clearProps: () => {
      uploadActions.clearUploadProps(dispatch);
    }
  }
}

export default connect(null, mapDispatchToProps)(Success);

