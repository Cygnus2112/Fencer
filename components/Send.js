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
    TextInput
} from 'react-native';

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
        console.log('this.props.fenceCoordinates ', this.props.fenceCoordinates);
        console.log('this.props.selectedDates', this.props.selectedDates);

        setTimeout(()=>{
            if(!this.props.uploadFilterComplete || !this.props.selectDatesComplete || !this.props.chooseAreaComplete || !this.props.filterTitle){

                // trigger error modal: 'oops! one or more of the steps is incomplete...'

            } else {
                let dataToSend = {
                    fenceCoordinates: this.props.fenceCoordinates,
                    selectedDates: this.props.selectedDates,
                    filterToUpload: this.props.filterToUpload,
                    title: this.props.filterTitle,
                    message: this.props.filterMessage
                }
                this.props.finalSumbit(dataToSend);
            }
        },100)

    }


    render(){
        return (
          <View style={styles.container}>
            <View style={{width: screenWidth,flexDirection: 'row',  justifyContent: 'center'}}>
              <View style={{width: 30, marginRight:10,marginTop:5}}>
                <Icon name="home" size={30} color={"#0c12ce"} />
              </View>
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
                            this.handleSubmit();

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
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    uploadFilterComplete: state.uploadReducer.uploadFilterComplete,
    selectDatesComplete: state.uploadReducer.selectDatesComplete,
    fenceCoordinates: state.uploadReducer.fenceCoordinates,
    selectedDates: state.uploadReducer.selectedDates,
    filterToUpload: state.uploadReducer.filterToUpload,
    filterTitle: state.uploadReducer.filterTitle,
    filterMessage: state.uploadReducer.filterMessage,
    bitlyURL: state.uploadReducer.bitlyURL    
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
            
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
