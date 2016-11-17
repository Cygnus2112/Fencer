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

        this.state = {
            title: "",
            message: ""
        }
    }


    render(){
        return (
          <View style={styles.container}>
            <View style={{width: screenWidth,flexDirection: 'row',  justifyContent: 'center'}}>
              <View style={{width: 30, marginRight:10,marginTop:5}}>
                <Icon name="home" size={30} color={"#c7adff"} />
              </View>
                <View style={{borderColor:'black',borderWidth:2, width: 250,marginTop: 50,flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>

                    <Text style={{fontSize: 22, textAlign: 'center', fontFamily: 'RobotoCondensed-Regular'}}>Give your filter a name: </Text>
                    <View style={{width: 250}}>
                        <TextInput 
                            style={{fontSize: 20, textAlign: 'center',fontFamily: 'RobotoCondensed-Regular'}} 
                            autoCorrect={false} 
                            maxLength={28} 
                            onChangeText={(text) => this.setState({title: text})}
                            value={this.state.title}/>
                    </View>
                    <Text style={{fontSize: 22, textAlign: 'center', fontFamily: 'RobotoCondensed-Regular'}}>Add an optional message {'for'} your friends:</Text>
                    <View style={{width: 250, borderColor: 'black', borderWidth: 2}}>
                        <TextInput 
                            style={{fontSize: 18,fontFamily: 'RobotoCondensed-Regular'}} 
                            multiline={true} 
                            numberOfLines={4}  
                            autoCorrect={false} 
                            maxLength={140} 
                            onChangeText={(text) => this.setState({message: text})}
                            value={this.state.message} />
                    </View>
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
    backgroundColor: '#0c12ce',
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 10
  }
});

const mapStateToProps = (state) => {
  return {
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    uploadFilterComplete: state.uploadReducer.uploadFilterComplete,
    selectDatesComplete: state.uploadReducer.selectDatesComplete,
    chooseAreaComplete: state.uploadReducer.chooseAreaComplete,
    fenceCoordinates: state.uploadReducer.fenceCoordinates,
    selectedDates: state.uploadReducer.selectedDates,
    filterToUpload: state.uploadReducer.filterToUpload       
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitTitle: (info) => {
            uploadActions.submitTitleAndMessage(dispatch, info)
        }
    }
}

export default connect(mapStateToProps, null)(Send);
