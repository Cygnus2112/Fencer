import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    ListView,
    Dimensions,
    Linking,
    TextInput,
    AppState,
 //   Share
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux'
import * as uploadActions from '../actions/uploadActions';
 
import Share from 'react-native-share';

import Button from 'react-native-button';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

class Send extends Component {
    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            title: "",
            message: ""
        }
    }

    handleSubmit(){
        console.log('this.props.fenceCoordinates in handleSubmit: ', this.props.fenceCoordinates);
        console.log('this.props.selectedDates in handleSubmit: ', this.props.selectedDates);
      //  console.log('AppState.currentState: ', AppState.currentState);

        // setTimeout(()=>{
            if(!this.props.uploadFilterComplete || !this.props.selectDatesComplete || !this.props.chooseAreaComplete || !this.state.title){

                // trigger error modal: 'oops! one or more of the steps is incomplete...'
                console.log('oops! one or more of the steps is incomplete...');
                console.log(this.props.uploadFilterComplete);
                console.log(this.props.selectDatesComplete);
                console.log(this.props.chooseAreaComplete);
                console.log(this.props.filterTitle);
            } else {
                let dataToSend = {
                    fenceCoordinates: this.props.fenceCoordinates,
                    selectedDates: this.props.selectedDates,
                    filterToUpload: this.props.filterToUpload,
                    title: this.state.title,
                    message: this.state.message,
                    username: this.props.username
                }
                this.props.finalSumbit(dataToSend);

                // we can send the actual text message in UploadActions or maybe on the backend.

            }
        // },100)

    }

    componentWillReceiveProps(newProps){
      //  if(newProps.finalSubmitComplete !== this.props.finalSubmitComplete){
      // //   if(newProps.filterTitle !== this.props.filterTitle){

      //       console.log('newProps.bitlyURL: ', newProps.bitlyURL);
      //       console.log('this.props.bitlyURL: ', this.props.bitlyURL);

      //       let shareText = {
      //           //  title: "React Native",
      //           message: "Here is your new Fencer filter: " + this.state.title + " ",
      //           url: newProps.bitlyURL,
      //           subject: "Share Link" //  for email
      //       };

      //       Share.open(shareText)
      //       .then((resp) => {
      //           console.log('successfully sent filter???', resp);
      //           console.log('#####################################################');
      //          // this.props.clearProps();
      //           //Actions.loading();
      //       })


      //   }

        
        if(newProps.filterTitle !== this.props.filterTitle){
            this.handleSubmit();
        }
    }


    render(){
        return (
          <View style={styles.container}>
            <View style={{width: screenWidth,flexDirection: 'row',  justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => { Actions.loading() }}>
                <View style={{width: 30, marginRight:10,marginTop:5}}>
                  <Icon name="home" size={30} color={"#0c12ce"} />
                </View>
              </TouchableOpacity>
                <View style={{height: screenHeight-150, width: 250,marginTop: 50,flexDirection: 'column',justifyContent: 'space-between',alignItems: 'center'}}>
  
                  <View style={{height: 150}}>
                    <Text style={{fontSize: 22, textAlign: 'center', fontFamily: 'RobotoCondensed-Regular'}}>Give your filter a name:</Text>
                    <View style={{width: 250}}>
                        <TextInput 
                            style={{fontSize: 20, textAlign: 'center',fontFamily: 'RobotoCondensed-Regular'}} 
                            autoCorrect={false} 
                            maxLength={28} 
                            onChangeText={(text) => this.setState({title: text})}
                            value={this.state.title}/>
                    </View>
                  </View>

                  <View style={{height: 150}}>
                    <Text style={{fontSize: 22, textAlign: 'center', fontFamily: 'RobotoCondensed-Regular'}}>Add an optional message <Text style={{fontSize: 16}}>(directions, contact info, etc.):</Text></Text>
                    <View style={{width: 250, height: 50 }}>
                        <TextInput 
                            style={{fontSize: 18,fontFamily: 'RobotoCondensed-Regular'}} 
                            // multiline={true} 
                            // numberOfLines={4}  
                            autoCorrect={false} 
                            maxLength={140} 
                            onChangeText={(text) => this.setState({message: text})}
                            value={this.state.message} />
                    </View>
                  </View>

                  <View style={{height: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.buttonBox}>
                        <Button
                          style={{fontFamily: 'RobotoCondensed-Regular', color: 'white',fontSize:20}}
                          onPress={()=> { 

                            this.props.submitTitle({title: this.state.title, message: this.state.message}); 

                         }
                        }>
                          Submit
                        </Button>
                    </View>
                  </View>
                </View>

              <View style={{width: 30,marginLeft:10,marginTop:5}}>
                <Icon name="info" size={30} color="#0c12ce" />
              </View>

            </View>
          </View>
            )
    }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: screenHeight - 75,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f2'
  },
   buttonBox:{
    elevation:3,
    padding:7,
    height:40,
    width: 130,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce'
  }
});

const mapStateToProps = (state) => {
  return {
    username: state.authReducer.username,
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    uploadFilterComplete: state.uploadReducer.uploadFilterComplete,
    selectDatesComplete: state.uploadReducer.selectDatesComplete,
    fenceCoordinates: state.uploadReducer.fenceCoordinates,
    selectedDates: state.uploadReducer.selectedDates,
    filterToUpload: state.uploadReducer.filterToUpload,
    filterTitle: state.uploadReducer.filterTitle,
    filterMessage: state.uploadReducer.filterMessage,
    bitlyURL: state.uploadReducer.bitlyURL,
    finalSubmitComplete: state.uploadReducer.finalSubmitComplete   
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitTitle: (info) => {
            if(info.title.length < 1){

                // trigger error modal: "fence must have a title"

            } else {
                uploadActions.submitTitleAndMessage(dispatch, info)
            }
        },
        finalSumbit: (data) => {
            uploadActions.finalSubmitFilter(dispatch, data);
        },
        clearProps: (action) => {
            uploadActions.clearUploadProps(dispatch);
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
