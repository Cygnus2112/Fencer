import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    DatePickerAndroid,
    TimePickerAndroid,
    Dimensions,
    TouchableOpacity
} from 'react-native';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as uploadActions from '../actions/uploadActions';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

//import Icon from 'react-native-vector-icons/Entypo';
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

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = ({
      startMonth: this.props.selectedDates.startMonth || (new Date()).getMonth(),
      startDay: this.props.selectedDates.startDay || (new Date()).getDate(),
      startYear: this.props.selectedDates.startYear || (new Date()).getFullYear(),
      endMonth: this.props.selectedDates.endMonth || (new Date()).getMonth(),
      endDay: this.props.selectedDates.endDay || (new Date()).getDate(),
      endYear: this.props.selectedDates.endYear || (new Date()).getFullYear(),
      startText: (new Date()).toLocaleDateString(),
      endText: (new Date()).toLocaleDateString(),
      isoFormatText: 'pick a time (24-hour format)',
      startHour: this.props.selectedDates.startHour || 17,
      startMinute: this.props.selectedDates.startMinute || 0,
      startTimeText: '12:00PM',
      endHour: this.props.selectedDates.endHour || 18,
      endMinute: this.props.selectedDates.endMinute || 0,
      endTimeText: '1:00PM',
    })
  }

  componentDidMount(){
      console.log('this.props.selectedDates in ChooseDates: ', this.props.selectedDates);

      let d = new Date();
      let t = d.toLocaleTimeString();
      let currentHour = Number( t.split(' ')[0].split(':')[0] );

      let suffix = 'AM';
      if(currentHour >= 12){
        suffix = 'PM';
      }
      let initEndSuffix = suffix;
      let initStartHour, initEndHour;
      if(currentHour === 11 && suffix === 'PM'){
        initStartHour = currentHour + 1;
        suffix = 'AM'
      } else {
        initStartHour = currentHour + 1;
      }
      if(currentHour === 10 && suffix === 'PM' || currentHour === 11 && suffix === 'PM'){
        initEndHour = currentHour + 2;
        initEndSuffix = 'AM';
      } else {
        initEndHour = currentHour + 2;
      }

      this.setState({
        startHour: initStartHour,
        endHour: initEndHour,
        startTimeText: _formatTime(currentHour+1, 0),
        endTimeText: _formatTime(currentHour+2, 0)
        // startTimeText: initStartHour + ':00' + suffix,
        // endTimeText: initEndHour + ':00' + initEndSuffix
      })

    if(this.props.selectedDates.startMonth){
      let startSuffix = 'AM'; 
      let endSuffix = 'PM';
      let startHour = Number(this.props.selectedDates.startHour);
      let endHour = Number(this.props.selectedDates.endHour);

      if(startHour > 12){
        startHour = startHour - 12;
        startSuffix = 'PM';
      }
      if(endHour > 12){
        endHour = endHour - 12;
        endSuffix = 'PM';
      }
      if(startHour === 0){
        startHour = 12;
      }
      if(endHour === 0){
        endHour = 12;
      }

      const { startMonth, startYear, startDay, endMonth,endYear,endDay } = this.props.selectedDates;
      const startString = new Date(startYear, startMonth, startDay);
      const endString = new Date(endYear, endMonth, endDay);

      this.setState({
        startText: startString.toLocaleDateString(), 
        endText: endString.toLocaleDateString(),
        startTimeText: _formatTime(this.props.selectedDates.startHour, this.props.selectedDates.startMinute),
        endTimeText: _formatTime(this.props.selectedDates.endHour, this.props.selectedDates.endMinute)
      })
    }
  }

  componentWillReceiveProps(newProps, oldProps){
    console.log('---------------------------------')
    console.log('new props incoming in ChooseDates ...');
    console.log('---------------------------------')
  }

  handleSubmit(){
    // if(this.state.startYear > this.state.endYear){

    // }
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
      console.log('this.state.startHour: ', this.state.startHour);
      console.log('this.state.endHour: ', this.state.endHour);

      if(this.state.startYear === this.state.endYear && this.state.startMonth === this.state.endMonth && 
          this.state.startDay === this.state.startDay && this.state.startHour > this.state.endHour){

          let endHour = this.state.startHour + 1;

          if(endHour === 24){
            let newDate = new Date(this.state.startYear, this.state.startMonth, this.state.startDay, endHour);
            this.setState({
              endYear: newDate.getFullYear(),
              endMonth: newDate.getMonth(),
              endDay: newDate.getDate(),
              endHour: newDate.getHours(),
              endTimeText: _formatTime(newDate.getHours(), newDate.getMinutes())
            })
          } else {
            this.setState({
              endHour: endHour,
              endTimeText: _formatTime(endHour, this.state.endMinute)
            })
          }
      } else if(this.state.startYear === this.state.endYear && this.state.startMonth === this.state.endMonth && 
          this.state.startDay === this.state.endDay && 
            (new Date(this.state.endYear, this.state.endMonth, this.state.endDay, this.state.endHour, this.state.endMinute).getTime() - 
              new Date(this.state.startYear, this.state.startMonth, this.state.startDay, this.state.startHour, this.state.startMinute).getTime() < 3600000) ) {

            let st = new Date(this.state.startYear, this.state.startMonth, this.state.startDay, this.state.startHour, this.state.startMinute);
            let newDate = new Date(st.getTime() + 3600000);

            this.setState({
              endYear: newDate.getFullYear(),
              endMonth: newDate.getMonth(),
              endDay: newDate.getDate(),
              endHour: newDate.getHours(),
              endMinute: newDate.getMinutes(),
              endTimeText: _formatTime(newDate.getHours(), newDate.getMinutes())
            })
          
      }

            // if(this.state.startYear === this.state.endYear && this.state.startMonth === this.state.endMonth && 
      //     this.state.startDay === this.state.startDay && this.state.startHour === this.state.endHour &&
      //     this.state.endMinute < this.state.startMinute){

      //     let smin = this.state.startMinute;
      //     let emin = this.state.endMinute;

      //     this.setState({
      //       endMinute: smin,
      //       startMinute: 
      //     })
      // }


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
      if(this.state.startMonth > this.state.endMonth || this.state.startYear > this.state.endYear){
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
    } catch ({code, message}) {
      console.warn(`Error in datepicker: `, message);
    }
  };
  // <View style={{justifyContent: 'center', alignItems: 'center',height: 50, width:175, borderWidth:2, borderColor: 'black', borderRadius: 4}}>
  //   <Text style={{fontSize: 20}}>
  //     { this.state.startText }
  //   </Text>
  // </View>

//                  <Image source={require('../assets/ic_date_range_black_24dp.png')} style={{height:35, width:35}} />


  render(){
    return (
      <View style={styles.container}>
      <View style={{height: screenHeight / 1.7, width: screenWidth,flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{width: 30, marginRight: 35}}>
          <Icon name="home" size={30} color={"#c7adff"} />
        </View>
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
        <View style={{width: 30,marginLeft:35}}>
          <Icon name="info" size={30} color="#0c12ce" />
        </View>
      </View>
        <View style={styles.errorBox}>
          <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'red'}}>Filter can be active for</Text>
          <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'red'}}>no more than 48 hours.</Text>
        </View>
      
          <View style={styles.buttonBox}>
            <Button
              style={{fontFamily: 'RobotoCondensed-Regular', color: 'white',fontSize:20}}
              onPress={()=> { this.props.submitDates({
                startMonth: this.state.startMonth,
                startDay: this.state.startDay,
                startYear: this.state.startYear,

                endMonth: this.state.endMonth,
                endDay: this.state.endDay,
                endYear: this.state.endYear,
                startHour: this.state.startHour,
                startMinute: this.state.startMinute,
                endHour: this.state.endHour,
                endMinute: this.state.endMinute
              });
              this.handleSubmit();

            }
            }>
              Submit
            </Button>
          </View>

      </View>
    )
  }
}
//{height: 50, width: 175, backgroundColor: 'blue', borderWidth:2, borderColor: 'black', borderRadius: 4}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: screenHeight - 75,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    backgroundColor: '#0c12ce',
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10
  },
  dateFieldsContainer: {
    height: screenHeight / 1.7,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  errorBox: {
    height: 50,
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
    selectedDates: state.uploadReducer.selectedDates
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitDates: (dates) => {
      console.log('dates in mapDispatch: ', dates);
      uploadActions.submitDates(dispatch, dates)
    }
  }
}

const ChooseDates = ChooseDatesComponent;

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDates);
