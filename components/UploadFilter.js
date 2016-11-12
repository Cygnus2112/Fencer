import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
var ImagePicker = require('react-native-image-picker');

import Icon from 'react-native-vector-icons/Entypo';

import UploadNav from './UploadNav'

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

// - User clicks 'upload png' button
// - Opens camera roll

export default class UploadFilter extends Component{
    constructor(props){
      super(props);
      this.handlePress = this.handlePress.bind(this);
      this.handleUpload = this.handleUpload.bind(this);
      this.state = {
        png: null,
        jpg: null,
        buttonState: ''
      }
    }

    handleUpload(){
        Actions.dates();
    }

    handlePress(){
      // const options = {
      //   chooseFromLibraryButtonTitle: 'Choose from Library...',
      //   quality: 1,
      //   noData: true,
      // };
      const options = {

      };
     ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled photo picker');
        } else if (response.error) {
           console.log('ImagePicker Error: ', response.error);
        } else {
          console.log('-----------------------------------------');
          if(response.type === 'image/jpeg'){
            const source = {uri: response.uri, isStatic: true};
            this.setState({
              jpg: source
            })
          } else {
            const source = {uri: response.uri, isStatic: true};

            this.setState({
                png: source
            });
          }
        }
      });
    }     
//height: 1920/4, width: 1080/4
    render(){
      return(
        <View style={ styles.container }>
          <UploadNav isOneComplete={true} isTwoComplete={true} isThreeActive={true}/>
          <View style={{height: 480*.94, width: screenWidth, flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{width: 30,marginRight:10,marginTop:5}}>
              <Icon name="home" size={30} color="#0c12ce" />
            </View>
            <Image source={require('../assets/png_background.png')} style={styles.preview}>
              <Image source={this.state.png} style={{height: 480*.94, width: 274*.94}}/>
            </Image>
            <View style={{width: 30,marginLeft:10,marginTop:5}}>
              <Icon name="info" size={28} color="#0c12ce" />
            </View>
          </View>
          <View style={{width: screenWidth-25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginTop:5}}>
            <View style={ styles.buttonBox }>
              <Button
                style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'white',borderRadius:4}}
                styleDisabled={{color: 'red'}}
                onPress={this.state.png ? this.handleUpload : this.handlePress }>
                { this.state.png ? ("Upload") : ("Upload Filter") }
              </Button>
            </View>
          </View>
        </View>
      )
    }
}

            // <View style={{width: 50,marginLeft:30, marginBottom: 10}}>
            //   <Icon name="info" size={25} color="#0c12ce" />
            // </View>
//#eb42f4

//<Image source={this.state.jpg} style={{height: 1920/4, width: 1080/4}}>
//<View style={{flex: 1, alignItems: 'center',justifyContent: 'center',borderColor: 'black',borderRadius:2}}>

const styles = StyleSheet.create({
  container: {
    height: screenHeight - 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f2'
  },
  preview:{
    height: 480*.94, 
    width: 274*.94,
    borderWidth:2, 
    borderColor:'black',
    backgroundColor: 'white',
    marginBottom: 5
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
  }
})


