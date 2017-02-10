import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    DatePickerAndroid,
    TimePickerAndroid,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    Modal
} from 'react-native';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uploadActions from '../actions/uploadActions';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

function _formatTime(hour, minute) {
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

class ChooseDatesComponent extends Component{
  constructor(props){
    super(props);

    this.launchCal = this.launchCal.bind(this);
    this.launchTime = this.launchTime.bind(this);

    this.state = ({
      startMonth: this.props.startUTC ? new Date(this.props.startUTC).getMonth() : (new Date()).getMonth(),
      startDay: this.props.startUTC ? new Date(this.props.startUTC).getDate() : (new Date()).getDate(),
      startYear: this.props.startUTC ? new Date(this.props.startUTC).getFullYear() : (new Date()).getFullYear(),
      endMonth: this.props.endUTC ? new Date(this.props.endUTC).getMonth() : (new Date()).getMonth(),
      endDay: this.props.endUTC ? new Date(this.props.endUTC).getDate() : (new Date()).getDate(),
      endYear: this.props.endUTC ? new Date(this.props.endUTC).getFullYear() : (new Date()).getFullYear(),

      startText: (new Date()).toLocaleDateString(),
      endText: (new Date()).toLocaleDateString(),
      startHour: this.props.startUTC ? new Date(this.props.startUTC).getHours() : 17,
      startMinute: this.props.startUTC ? new Date(this.props.startUTC).getMinutes() : 0,
      startTimeText: '12:00PM',
      endHour: this.props.endUTC ? new Date(this.props.endUTC).getHours() : 18,
      endMinute: this.props.endUTC ? new Date(this.props.endUTC).getMinutes() : 0,
      endTimeText: '1:00PM',
      infoPressed: false
    })
  }

  componentDidMount(){

    if(typeof(this.props.startUTC) === 'number'){

      const startString = new Date( this.props.startUTC );
      const endString = new Date( this.props.endUTC );

      this.setState({
        startText: startString.toLocaleDateString(), 
        endText: endString.toLocaleDateString(),
        startTimeText: _formatTime(startString.getHours(), startString.getMinutes()),
        endTimeText: _formatTime(endString.getHours(), endString.getMinutes())
      })
    } else {
      let currentTime = new Date().getTime();

      let initStartTime = new Date(currentTime + 3600000);
      let initEndTime = new Date(currentTime + 7200000);

      let initStartHour = initStartTime.getHours();
      let initEndHour = initEndTime.getHours();

      let initMinute = initStartTime.getMinutes();

      let initEndMonth = initEndTime.getMonth();
      let initEndDay = initEndTime.getDate();

      this.setState({
        startMonth: initStartTime.getMonth(),
        endMonth: initEndMonth,
        startDay: initStartTime.getDate(),
        endDay: initEndDay,
        endText: initEndTime.toLocaleDateString(),
        startHour: initStartHour,
        endHour: initEndHour,
        startMinute: initMinute,
        endMinute: initMinute,
        startTimeText: _formatTime(initStartHour, initMinute),
        endTimeText: _formatTime(initEndHour, initMinute)
      })


    }
  }

  async launchTime(stateKey, options) {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      var newState = {};

      if (action === TimePickerAndroid.timeSetAction) {
        newState[stateKey + 'TimeText'] = _formatTime(hour, minute);
        newState[stateKey + 'Hour'] = hour;
        newState[stateKey + 'Minute'] = minute;
      } else if (action === TimePickerAndroid.dismissedAction) {
        //newState[stateKey + 'Text'] = 'dismissed';
        return;
      }

      this.setState(newState);

      let currentTime = Date.now();

      let newStartTime = new Date(this.state.startYear, this.state.startMonth, this.state.startDay, this.state.startHour, this.state.startMinute).getTime();

      let endTime = new Date(this.state.endYear, this.state.endMonth, this.state.endDay, this.state.endHour, this.state.endMinute);

      if(newStartTime < currentTime + 3600000) {        //  Start Time must be at least one hour from now
   
          let d = new Date().getTime();
          let initStartTime = new Date(d + 3600000);

          let initStartHour = initStartTime.getHours();
          let initMinute = initStartTime.getMinutes();

          this.setState({
            startYear: initStartTime.getFullYear(),
            startMonth: initStartTime.getMonth(),
            startDay: initStartTime.getDate(),
            startHour: initStartHour,
            startMinute: initMinute,
            startText: initStartTime.toLocaleDateString(),
            startTimeText: _formatTime(initStartHour, initMinute)
          });

          if(endTime.getTime() < initStartTime.getTime() + 3600000){      //  End Time must be at least one hour after Start Time
     

             let newEndTime = new Date(initStartTime.getTime() + 3600000);

            this.setState({
              endUTC: newEndTime.getTime(),
              endYear: newEndTime.getFullYear(),
              endMonth: newEndTime.getMonth(),
              endDay: newEndTime.getDate(),
              endHour: newEndTime.getHours(),
              endMinute: newEndTime.getMinutes(),
              endText: newEndTime.toLocaleDateString(),
              endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes())
            })
          }

          
      } else if (newStartTime >= endTime.getTime()) {      //  Start Time must be before End Time

            let newEndTime = new Date(newStartTime + 3600000);
            this.setState({
              endYear: newEndTime.getFullYear(),
              endMonth: newEndTime.getMonth(),
              endDay: newEndTime.getDate(),
              endHour: newEndTime.getHours(),
              endMinute: newEndTime.getMinutes(),
              endText: newEndTime.toLocaleDateString(),
              endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes())
            })

      } else if((endTime.getTime() - newStartTime) < 3600000 ) {

            let newEndTime = new Date(newStartTime + 3600000);

            this.setState({
              endYear: newEndTime.getFullYear(),
              endMonth: newEndTime.getMonth(),
              endDay: newEndTime.getDate(),
              endHour: newEndTime.getHours(),
              endMinute: newEndTime.getMinutes(),
              endText: newEndTime.toLocaleDateString(),
              endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes())
            })
          
      } 


    } catch ({code, message}) {
      console.warn(`Error in TimePickerAndroid: `, message);
    }
  };

  async launchCal(stateKey, options){

    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        return;
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Month'] = month;
        newState[stateKey + 'Day'] = day;
        newState[stateKey + 'Year'] = year;
      }

      this.setState(newState);

      let newStartTime = new Date(this.state.startYear, this.state.startMonth, this.state.startDay, this.state.startHour, this.state.startMinute).getTime();

      let endTime = new Date(this.state.endYear, this.state.endMonth, this.state.endDay, this.state.endHour, this.state.endMinute);

      if(endTime.getTime() < newStartTime){

        if(newStartTime - endTime.getTime() > 259200000){   //  if the length of active time is greater than 72 hours
          let newEndTime = new Date(endTime.getTime() + 259200000);

          this.setState({
            startYear: endTime.getFullYear(),
            startMonth: endTime.getMonth(),
            startDay: endTime.getDate(),
            startHour: endTime.getHours(),
            startMinute: endTime.getMinutes(),
            endYear: newEndTime.getFullYear(),
            endMonth: newEndTime.getMonth(),
            endDay: newEndTime.getDate(),
            endHour: newEndTime.getHours(),
            endMinute: newEndTime.getMinutes(),
            startTimeText: _formatTime(endTime.getHours(), endTime.getMinutes()),
            endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes()),
            startText: endTime.toLocaleDateString(),
            endText: newEndTime.toLocaleDateString(),
          })
        } else if( newStartTime - endTime.getTime() < 3600000 ){
          let newEndTime = new Date(endTime.getTime() + 3600000)
          this.setState({
            startYear: endTime.getFullYear(),
            startMonth: endTime.getMonth(),
            startDay: endTime.getDate(),
            startHour: endTime.getHours(),
            startMinute: endTime.getMinutes(),
            endYear: newEndTime.getFullYear(),
            endMonth: newEndTime.getMonth(),
            endDay: newEndTime.getDate(),
            endHour: newEndTime.getHours(),
            endMinute: newEndTime.getMinutes(),
            startTimeText: _formatTime(endTime.getHours(), endTime.getMinutes()),
            endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes()),
            startText: endTime.toLocaleDateString(),
            endText: newEndTime.toLocaleDateString(),
          })


        } else {
            let sm = this.state.startMonth;
            let em = this.state.endMonth;
            let sd = this.state.startDay;
            let ed = this.state.endDay;
            let ey = this.state.endYear;
            let sy = this.state.startYear;
            let smText = this.state.startText;
            let emText = this.state.endText;
            this.setState({
              startMonth: em,
              endMonth: sm,
              startDay: ed,
              endDay: sd,
              startYear: ey,
              endYear: sy,
              startText: emText,
              endText: smText
            })
        }
      } else if (endTime.getTime() - newStartTime < 3600000) {    //  if the time period is less than 1 hour
          let newEndTime = new Date(endTime.getTime() + 3600000);
          this.setState({
            endYear: newEndTime.getFullYear(),
            endMonth: newEndTime.getMonth(),
            endDay: newEndTime.getDate(),
            endHour: newEndTime.getHours(),
            endMinute: newEndTime.getMinutes(),
            endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes()),
            endText: newEndTime.toLocaleDateString()
          })
      } else if(endTime.getTime() - newStartTime > 259200000){   //  if the time period is greater than 72 hours
          let newEndTime = new Date(newStartTime + 259200000);
          this.setState({
            endYear: newEndTime.getFullYear(),
            endMonth: newEndTime.getMonth(),
            endDay: newEndTime.getDate(),
            endHour: newEndTime.getHours(),
            endMinute: newEndTime.getMinutes(),
            endTimeText: _formatTime(newEndTime.getHours(), newEndTime.getMinutes()),
            endText: newEndTime.toLocaleDateString(),
          })
        } 
    } catch ({code, message}) {
      console.log(`Error in datepicker: `, message);
    }
  };

  render(){
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', top: 8, left: 10, width: 30, height: 30}}>
          <TouchableOpacity onPress={() => { 
            this.props.clearProps();
            Actions.loading({isStartup: false}); 
          }}>
            <Image source={require('../assets/home_icon.png')} style={{width: 30, height:30}}/>
          </TouchableOpacity>
        </View>

        <View style={{position: 'absolute', top: 8, right: 10, width: 30,height:30}}>
          <TouchableOpacity onPress={() => {this.setState({infoPressed: true})}} >
            <Image source={require('../assets/info_unedited.png')} style={{width: 31, height:31}}/>
          </TouchableOpacity>
        </View>
          
     {/*    <View style={{height: 345, width: screenWidth,flexDirection: 'row', justifyContent: 'center',borderWidth: 1, borderColor: 'black'}}> */}

          <View style={styles.dateFieldsContainer}>
            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20}}>
              This filter will become
            </Text> 
            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20}}><Text style={{fontWeight: 'bold'}}>active</Text> on:
            </Text>

              <TouchableOpacity onPress={()=>{
                let d = new Date();
                let mm = d.getMonth();
                let dd = d.getDate();
                let yy = d.getFullYear();
                this.launchCal('start', {
                  date: this.state.startDate,
                  minDate: new Date(),
                  maxDate: new Date(yy, mm+1, dd),
                })}}>

                  <View style={styles.dateAndIconContainer}>
                      <View style={[styles.dateBox]}>
                        <Text style={{fontFamily: 'RobotoCondensed-Regular',color: 'black', fontSize:22,textAlign: 'center'}}>
                          { this.state.startText }
                        </Text>
                      </View>
                      <View style={styles.calendarIcon} >
                        <Icon name="calendar-o" size={30} color={"black"} />
                      </View>
                  </View>
              </TouchableOpacity>

                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20}}>
                  at:
                </Text>

                <TouchableOpacity onPress={() => {
                  let d = new Date();
                  let t = d.toLocaleTimeString();
                  let currentHour = Number( t.split(' ')[0].split(':')[0] );
                  let options = {hour: currentHour+1, minute: 0}
                  this.launchTime('start', options)} 
                }>
                  <View style={styles.dateAndIconContainer}>

                    <View style={styles.dateBox}>
                      <Text style={{fontFamily: 'RobotoCondensed-Regular',color: 'black', fontSize:22,textAlign: 'center'}}>
                        { this.state.startTimeText }
                      </Text>
                    </View>
                    <View style={{borderWidth: 2, borderLeftWidth: 0,borderColor: 'black', justifyContent: 'center',alignItems:'center', height:38, width:38}} >
                      <Icon name="clock-o" size={32} color={"black"} />
                    </View>
                  </View>

                </TouchableOpacity>
        
                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20}}>
                  and <Text style={{fontWeight: 'bold'}}>end</Text> on:
                </Text>

                <TouchableOpacity onPress={()=>{
                    let d = new Date();
                    let mm = d.getMonth();
                    let dd = d.getDate();
                    let yy = d.getFullYear();

                    this.launchCal('end', {
                        date: this.state.endDate,
                        minDate: new Date(),
                        maxDate: new Date(yy, mm+1, dd),
                    })}} >
                  <View style={styles.dateAndIconContainer}>

                    <View style={styles.dateBox}>
                      <Text style={{fontFamily: 'RobotoCondensed-Regular', textAlign: 'center',color: 'black',fontSize:22}}>
                        { this.state.endText }
                      </Text>
                    </View>
                    <View style={styles.calendarIcon} >
                      <Icon name="calendar-o" size={30} color={"black"} />
                    </View>

                  </View>
                </TouchableOpacity>
        
                <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:20}}>
                  at:
                </Text>

                <TouchableOpacity onPress={() => {
                  let d = new Date();
                  let t = d.toLocaleTimeString();
                  let currentHour = Number( t.split(' ')[0].split(':')[0] );
                  let options = {hour: currentHour+2, minute: 0}
                  this.launchTime('end', options)} 
                }>
                  <View style={styles.dateAndIconContainer}>

                    <View style={styles.dateBox}>
                      <Text style={{fontFamily: 'RobotoCondensed-Regular',color: 'black', fontSize:22,textAlign: 'center'}}>
                        { this.state.endTimeText }
                      </Text>
                    </View>
                    <View style={{borderWidth: 2, borderLeftWidth: 0,borderColor: 'black', justifyContent: 'center',alignItems:'center', height:38, width:38}} >
                      <Icon name="clock-o" size={32} color={"black"} />
                    </View>
                  </View>

                </TouchableOpacity>

        </View>

     {/* </View> */}

     {/*   <View style={styles.errorBox}>
          <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'red'}}>Filter can be active for</Text>
          <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'red'}}>no more than 48 hours.</Text>
        </View> */}
      
        <View style={styles.buttonBox}>
            <Button
              style={{fontFamily: 'RobotoCondensed-Regular', color: 'white',fontSize:20}}
              onPress={()=> { 
                let startUTC = new Date(this.state.startYear, this.state.startMonth, this.state.startDay, this.state.startHour, this.state.startMinute).getTime();
                let endUTC = new Date(this.state.endYear, this.state.endMonth, this.state.endDay, this.state.endHour, this.state.endMinute).getTime();

                this.props.submitDates({
                  startUTC: startUTC,
                  endUTC: endUTC
                })}
            }>
              Submit
            </Button>
        </View>
      {this.state.infoPressed
        ?
      (<InfoModal modalVisible={true} toggleModal={() => { this.setState({ infoPressed: false}) }} />)
        :
      (null)
      }
      </View>
    )
  }
}
//{height: 50, width: 175, backgroundColor: 'blue', borderWidth:2, borderColor: 'black', borderRadius: 4}

class InfoModal extends Component {
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
          onRequestClose={() => { console.log("Modal has been closed.")}}>

            <View style={styles.modalContainer}>
              <View style={styles.infoModal}>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, margin: 5}}>The <Text style={{fontWeight: 'bold'}}>Start Date</Text> determines when your Geofilter becomes unlockable for users who are within your preset geofence area. The <Text style={{fontWeight: 'bold'}}>Start Date </Text>must be set for at least one hour from the current time. Currently, Geofilters can be live for a maximum of <Text style={{fontWeight: 'bold'}}>72 hours</Text>.</Text>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, margin: 5}}>If a Geofilter is shared with a user in a different time zone, the start and end times will adjust according to whichever time zone in which the user is located (i.e., if you are in L.A. and set a start time for 5:00PM, it will appear as 8:00PM to a user in New York).</Text>

                <View style={{position: 'absolute', bottom: 10, left: 10, right: 10, justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableHighlight 
                        style={{marginTop: 15,height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                        onPress={() => {
                          
                          this.props.toggleModal();
                          this.setState({modalVisible: !this.state.modalVisible})
                        }
                    }>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
                  </TouchableHighlight>
                </View>
              </View >
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
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  infoModal: {
    position: 'absolute', 
    top: 90, 
    left: 30, 
    right: 30, 
    bottom: 90, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
    padding: 10
  },
  container: {
    // flex: 1,
    height: screenHeight - 75,
 //height: screenHeight - 125,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f2'
  },
  buttonBox:{
    elevation:3,
    padding:5,
    height:40,
    width: 130,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce',
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10,
    borderWidth: 1, 
    borderColor: 'black'
  },
  dateFieldsContainer: {
    height: 330,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30, 
    // borderWidth: 1, 
    // borderColor: 'black'
  },
  errorBox: {
    height: 50,
    borderWidth: 1, 
    borderColor: 'black'
  },
  dateBox:{
    height: 38, 
    width: 120, 
    backgroundColor: 'white', 
    borderWidth:2, 
    borderColor: 'black', 
    borderRadius: 1, 
    paddingTop: 1
  },
  dateAndIconContainer:{
    height: 38,
    width: 160,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  calendarIcon:{
    borderWidth: 2, 
    borderColor: 'black', 
    borderLeftWidth: 0, 
    paddingBottom:2,
    height:38, 
    width:38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clockIcon: {

  }
})

const mapStateToProps = (state) => {
  return {
    selectDatesComplete: state.uploadReducer.selectDatesComplete,
    startUTC: state.uploadReducer.startUTC,
    endUTC: state.uploadReducer.endUTC
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitDates: (dates) => {
      console.log('dates in mapDispatch: ', dates);
      uploadActions.submitDates(dispatch, dates)
    },
    clearProps: () => {
      uploadActions.clearUploadProps(dispatch);
    }
  }
}

const ChooseDates = ChooseDatesComponent;

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDates);
