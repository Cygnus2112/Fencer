import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    DatePickerAndroid,
    TimePickerAndroid,
    Dimensions
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

import UploadNav from './UploadNav';

import Icon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

function _formatTime(hour, minute) {
  return hour + ':' + (minute < 10 ? '0' + minute : minute);
}
export default class ChooseDates extends Component{
  constructor(props){
    super(props);
    this.launchCal = this.launchCal.bind(this);
    this.launchTime = this.launchTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = ({
    //  presetDate: new Date(2020, 4, 5),
      // allDate: new Date(),
      // simpleText: 'pick a date',
      // minText: 'pick a date, no earlier than today',
      // maxText: 'pick a date, no later than today',
      // presetText: 'pick a date, preset to 2020/5/5',
      // allText: 'pick a date between 2020/5/1 and 2020/5/10',
      startDate: new Date(),
      endDate: new Date(),
      startText: (new Date()).toLocaleDateString(),
      endText: (new Date()).toLocaleDateString(),
      isoFormatText: 'pick a time (24-hour format)',
      startHour: 17,
      startMinute: 0,
      startTimeText: '5:00PM',
      endHour: 18,
      endMinute: 0,
      endTimeText: '6:00PM',
    })
  }

  handleSubmit(){
    //Actions.createmap();
    Actions.polygon();
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
        newState[stateKey + 'Date'] = date;
      }
      console.log('newState: ', newState)
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in datepicker: `, message);
    }
  };
  // <View style={{justifyContent: 'center', alignItems: 'center',height: 50, width:175, borderWidth:2, borderColor: 'black', borderRadius: 4}}>
  //   <Text style={{fontSize: 20}}>
  //     { this.state.startText }
  //   </Text>
  // </View>
  render(){
    return (
      <View style={styles.container}>
        <UploadNav />
      <View style={{height: screenHeight / 1.7, width: screenWidth,flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{width: 30, marginRight: 35}}>
          <Icon name="home" size={30} color="#0c12ce" />
        </View>
        <View style={styles.dateFieldsContainer}>
          <Text style={{fontSize:20}}>
            This filter will become
          </Text> 
          <Text style={{fontSize:20}}><Text style={{fontWeight: 'bold'}}>active</Text> on:
          </Text>
          <View style={styles.dateBox}>
            <Button
              onPress={()=>(this.launchCal('start', {
                date: this.state.allDate,
                minDate: new Date(),
                maxDate: new Date(2020, 4, 10),
              }))}
              style={{color: 'white',fontSize:22}}>
              { this.state.startText }
            </Button>
          </View>


          <Text style={{fontSize:20}}>
            at:
          </Text>
          <View style={styles.dateBox}>
            <Button
              style={{flex:1,color: 'white',fontSize:22}}
              onPress={()=>{
                this.launchTime('start',{
                  hour: this.state.startHour,
                  minute: this.state.startMinute,
                })
              }}>
              { this.state.startTimeText }
            </Button>
          </View>
  
        
          <Text style={{fontSize:20}}>
            and <Text style={{fontWeight: 'bold'}}>end</Text> on:
          </Text>
          <View style={styles.dateBox}>
            <Button
              onPress={()=>(this.launchCal('end', {
                date: this.state.allDate,
                minDate: new Date(),
                maxDate: new Date(2020, 4, 10),
              }))}
              style={{color: 'white',fontSize:22}}>
              { this.state.endText }
            </Button>
          </View>
        
          <Text style={{fontSize:20}}>
            at:
          </Text>
          <View style={styles.dateBox}>
            <Button
              style={{flex:1,color: 'white',fontSize:22}}
              onPress={()=>{
                this.launchTime('end',{
                  hour: this.state.endHour,
                  minute: this.state.endMinute,
                })
              }}>
              { this.state.endTimeText }
            </Button>
          </View>
        </View>
        <View style={{width: 30,marginLeft:35}}>
          <Icon name="info" size={30} color="#0c12ce" />
        </View>
      </View>
        <View style={styles.errorBox}>
          <Text style={{fontSize: 16, color: 'red'}}>Filter can be active for</Text>
          <Text style={{fontSize: 16, color: 'red'}}>no more than 48 hours.</Text>
        </View>
      
          <View style={styles.buttonBox}>
            <Button
              style={{color: 'white',margin: 5,fontSize:16}}
              onPress={this.handleSubmit}>
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
    height: screenHeight - 25,
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
    width: 130, 
    backgroundColor: 'silver', 
    borderWidth:2, 
    borderColor: 'black', 
    borderRadius: 1, 
    paddingTop: 1,
    margin: 5
  }
  })
