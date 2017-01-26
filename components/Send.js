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
    Alert,
    Modal,
 //   Share
} from 'react-native';

import LoginModal from './LoginModal';

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

class Send extends Component {
    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            title: this.props.filterTitle || "",
            message: this.props.filterMessage || "",
            showLoginModal: false,
            showReviewModal: false
        }
    }

    handleSubmit(){
        console.log('handleSubmit called ');
    //    console.log('this.props.selectedDates in handleSubmit: ', this.props.selectedDates);
      //  console.log('AppState.currentState: ', AppState.currentState);

        // setTimeout(()=>{
          let currentTime = new Date().getTime();
          const { startMonth, startYear, startDay, startHour, startMinute} = this.props.selectedDates;
          let startTime = new Date(startYear, startMonth, startDay, startHour, startMinute).getTime();

     //     console.log('startTime minus currentTime: ', (startTime - currentTime));


            if(!this.props.uploadFilterComplete || !this.props.selectDatesComplete || !this.props.chooseAreaComplete || !this.state.title){
                const errMessage = () => {
                  if(!this.props.uploadFilterComplete){
                    return "Upload Filter";
                  } else if(!this.props.selectDatesComplete){
                    return "Select Dates";
                  } else if(!this.props.chooseAreaComplete) {
                    return "Choose Area";
                  } else {
                    return "Name Your Filter";
                  }
                }

                Alert.alert('Oops!',"You geofilter is incomplete. Please complete the following step before proceeding:\n\n" + errMessage(), [{text: 'OK', onPress: () => {
                    console.log('OK Pressed!');
                  }
                }])

                // trigger error modal: 'oops! one or more of the steps is incomplete...'
                // console.log('oops! one or more of the steps is incomplete...');
                // console.log(this.props.uploadFilterComplete);
                // console.log(this.props.selectDatesComplete);
                // console.log(this.props.chooseAreaComplete);
                // console.log(this.props.filterTitle);
            } else if((startTime - currentTime) < 1800000){
            Alert.alert('Oops!',"Please select a start time that is at least one hour from now.", [{text: 'OK', onPress: () => {
                    console.log('OK Pressed!');
                  }
            }])

            return;

            // } else if(!this.props.isLoggedIn){
            //   console.log('not logged in!!!!');
            //   this.setState({showLoginModal: true});
            } else {
                // let dataToSend = {
                //     fenceCoordinates: this.props.fenceCoordinates,
                //     selectedDates: this.props.selectedDates,
                //     filterToUpload: this.props.filterToUpload,
                //     title: this.state.title,
                //     message: this.state.message,
                //     username: this.props.username
                // }
                // this.props.finalSumbit(dataToSend);

                this.setState({showReviewModal:true})

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

        // if( newProps.filterTitle ){                //  this triggers an infinite loop of filter submissions. WHY???
        //   console.log('newProps.filterTitle');
        //   this.handleSubmit();
        // }
    }


    render(){
        return (
          <View style={styles.container}>

              <View style={{position: 'absolute', top: 8, left: 10, width: 30, height: 30}}>
                <TouchableOpacity onPress={() => { 
                  this.props.clearProps();
                  Actions.loading();
                }}>
                  <Icon name="home" size={30} color={"#0c12ce"} />
                </TouchableOpacity>
              </View>

              <View style={{position: 'absolute', top: 8, right: 10, width: 30,height:30}}>
                <Icon name="info" size={30} color="#0c12ce" />
              </View>

              <View style={styles.buttonBox}>
                        <Button
                          style={{fontFamily: 'RobotoCondensed-Regular', color: 'white',fontSize:20}}
                          onPress={()=> { 

                            if(!this.state.title.length){
                              Alert.alert('Oops!','Please name your geofilter before proceeding.', [{text: 'OK', onPress: () => {
                                console.log('OK Pressed!');
                              }}])

                            } else if(!this.props.isLoggedIn){
                                console.log('not logged in!!!!');
                                this.setState({showLoginModal: true});
                            } else if(this.state.title === this.props.filterTitle){
                                this.handleSubmit();
                            } else {
                              this.props.submitTitle({title: this.state.title, message: this.state.message});
                            }

                         }
                        }>
                          Review & Submit
                        </Button>
              </View>
              

            <View style={{width: screenWidth,flexDirection: 'row',  justifyContent: 'center'}}>

                <View style={{height: 315, width: 250,marginTop: 50,flexDirection: 'column',justifyContent: 'space-between',alignItems: 'center'}}>
  
                  <View style={{height: 150}}>
                    <Text style={{fontSize: 22, textAlign: 'center', fontFamily: 'RobotoCondensed-Regular'}}>Give your filter a name:</Text>
                    <View style={{width: 250}}>
                        <TextInput 
                            style={{fontSize: 20, textAlign: 'center',fontFamily: 'RobotoCondensed-Regular',color: 'blue'}} 
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
                            style={{fontSize: 18,fontFamily: 'RobotoCondensed-Regular',color: 'blue'}} 
                            // multiline={true} 
                            // numberOfLines={4}  
                            autoCorrect={false} 
                            maxLength={140} 
                            onChangeText={(text) => this.setState({message: text})}
                            value={this.state.message} />
                    </View>
                  </View>

              {/*    <View style={{height: 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderColor:'black', borderWidth: 1}}> */}

                 {/*    </View> */}

                </View>

            </View>
          {this.state.showLoginModal
            ?
            (<LoginModal alert={true} modalVisible={true} toggleModal={() => {this.setState( {showLoginModal: false}) } } />)
            :
            (null)
          }
          {this.state.showReviewModal
            ?
            (<ReviewModal {...this.props} title={ this.state.title } message={this.state.message} modalVisible={true} toggleModal={() => {this.setState( {showReviewModal: false}) } } />)
            :
            (null)
          }
          </View>
            )
    }
}

class ReviewModal extends Component {
  constructor(props){
    super(props);
    
    this.state = {
          modalVisible: this.props.modalVisible
      }
  }
//<View style={styles.infoModal}>

  componentDidMount(){
    console.log('this.props.filterToUpload.data in ReviewModal: ', this.props.filterToUpload.data);
  }

  render(){

    let startDateObj = new Date(this.props.selectedDates.startYear, this.props.selectedDates.startMonth,this.props.selectedDates.startDay,this.props.selectedDates.startHour,this.props.selectedDates.startMinute);
    let endDateObj = new Date(this.props.selectedDates.endYear, this.props.selectedDates.endMonth,this.props.selectedDates.endDay,this.props.selectedDates.endHour,this.props.selectedDates.endMinute);

    let startDate = startDateObj.toLocaleDateString();
    let endDate = endDateObj.toLocaleDateString();

    return(
      <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { console.log("Modal has been closed.")}}>
            <View style={styles.modalContainer}>
              <View style={styles.infoModal}>



                  <View style={styles.cancel}>
                    <TouchableOpacity onPress={ () => { 
                        this.props.toggleModal();
                        this.setState({modalVisible: !this.state.modalVisible});  } 
                    }>
                      <Icon name="circle-with-cross" size={30} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.header} >
                    <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'black', textDecorationLine: 'underline', fontSize: 22}}>Your Geofilter Details</Text>
                  </View>
       
                  <View style={styles.filterAndMapPreview} >
                    <Image source={{uri: `data:image/png;base64,${this.props.filterToUpload.data}` }} style={{height: 160, width: 90, borderWidth: 1, borderColor: 'black'}} />  
                  </View>

                  <View style={styles.details}>

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
                            {startDate + " " +  _formatTime(this.props.selectedDates.startHour, this.props.selectedDates.startMinute)}
                          </Text>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.message}>
                            Ends: 
                          </Text>
                          <Text style={styles.message}>
                            {endDate + " " + _formatTime(this.props.selectedDates.endHour, this.props.selectedDates.endMinute)}
                          </Text>
                      </View>

                    {this.props.message.length > 0 &&
                      <View style={styles.messageContainer}>
                        <View style={styles.messageHeader}>
                          <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18,color: 'black', textDecorationLine: 'underline'}}>Message</Text>
                        </View>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'black', fontSize: 14}}>{'"'}{this.props.message}{'"'}</Text>
                        </View>
                      </View>

                    }

                </View>  



                <View style={styles.finalSumbitButtonContainer}>
  
                  <TouchableHighlight 
                    style={styles.finalSumbitButton}
                    onPress={() => {
                      // this.props.toggleModal();
                      // this.setState({modalVisible: !this.state.modalVisible});

                      let dataToSend = {
                        fenceCoordinates: this.props.fenceCoordinates,
                        selectedDates: this.props.selectedDates,
                        filterToUpload: this.props.filterToUpload,
                        title: this.props.title,
                        message: this.props.message,
                        username: this.props.username
                      }

                    //  console.log('dataToSend in ReviewModal: ', dataToSend);

                      this.props.finalSumbit(dataToSend);

                      this.props.toggleModal();
                      this.setState({modalVisible: !this.state.modalVisible});
                    }
                  }>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'black', fontSize: 20}}>Submit!</Text>
                  </TouchableHighlight>

                </View>

          {/*        <TouchableHighlight 
                    style={{marginTop: 7, height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                    onPress={() => {
                      this.props.toggleModal();
                      this.setState({modalVisible: !this.state.modalVisible});
                    }
                  }>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
                  </TouchableHighlight>   */}
            </View>
          </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalScroll: {
    paddingBottom: 5,
    backgroundColor: 'white',
    height: 300,
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
  },
  messageContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
   // marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // borderWidth: 1,
    // borderColor: 'black'

  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancel: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  finalSumbitButtonContainer: {
    position: 'absolute',
    height: 42,
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //     borderWidth: 1,
    // borderColor: 'black'
  },
  finalSumbitButton: {
   // marginTop: 7, 
    height: 40, 
    width: 130, 
    backgroundColor: 'silver', 
    borderColor: 'black', 
    borderWidth: 1, 
    borderRadius: 5,
    paddingTop:3, 
    alignItems: 'center',
    borderRadius: 15
  },
  header: {
    position: 'absolute',
    top: 25,
    left: 10, 
    right: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  details: {
    position: 'absolute',
    left: 10,
    right: 10,
    marginTop: 225,
  //  bottom: 60,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  filterAndMapPreview: {
    position: 'absolute',
    left: 10,
    right: 10,
    marginTop: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black'
  },
  message: {
    fontFamily: 'RobotoCondensed-Regular',
    fontSize: 18,
    color: 'black',
      //marginLeft: 10,
     // marginRight: 10
  },
  modalContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  infoModal: {
    position: 'absolute', 
    top: 40, 
    left:30, 
    right: 30, 
    bottom: 40, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
   // backgroundColor:'white',
   backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
    padding: 10
  },
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
    padding:5,
    height:40,
    width: 180,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce',
    position: 'absolute',
    left: (screenWidth/2) - 65,
    bottom: 10,
    borderColor: 'black',
    borderWidth: 1
  }
});

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authReducer.isLoggedIn,
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
    finalSubmitComplete: state.uploadReducer.finalSubmitComplete,
    mapPreviewURI: state.uploadReducer.mapPreviewURI   
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitTitle: (info) => {

                uploadActions.submitTitleAndMessage(dispatch, info)
            
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
