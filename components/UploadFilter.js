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

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActions from '../actions/filterActions';
import * as uploadActions from '../actions/uploadActions';


class UploadFilter extends Component{
    constructor(props){
      super(props);

      this.handlePress = this.handlePress.bind(this);
    //  this.handleUpload = this.handleUpload.bind(this);

      this.state = {
        png: {data: null},
        buttonState: ''
      }
    }

    componentDidMount(){
     // console.log('this.props.filterToUpload: ', this.props.filterToUpload);
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

           // const source = {uri: response.uri, isStatic: true};

            const source = {data: response.data};

            console.log('response: ', response);

            // only when we do the final submit do we convert the image URI into data

            this.setState({
                png: {data: source.data}
            });
          }
        }
      });
    }     
//height: 1920/4, width: 1080/4
    render(){
      return(
        <View style={ styles.container }>

          <View style={{height: 482*.94, width: screenWidth, flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{width: 30,marginRight:10,marginTop:5}}>
                <Icon name="home" size={30} color="#0c12ce" />
              </View>
              <Image source={require('../assets/png_background.png')} style={styles.preview}>
                {this.props.filterToUpload
                  ?
                (<Image source={{uri: `data:image/png;base64,${this.props.filterToUpload.data}` }} style={{height: 480*.94, width: 274*.94}}/>)
                  :
                (<Image source={{uri: `data:image/png;base64,${this.state.png.data}` }} style={{height: 480*.94, width: 274*.94}}/>)
                }
              </Image>
              <View style={{width: 30,marginLeft:10,marginTop:5}}>
                <Icon name="info" size={28} color="#0c12ce" />
              </View>
          </View>

          <View style={{width: screenWidth-25, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginTop:5}}>
              <View style={ styles.buttonBox }>
                <Button
                  style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'white',borderRadius:4}}
                  styleDisabled={{color: 'red'}}
                  onPress={this.state.png.data ? ( ) => { this.props.submitUpload(this.state.png) } : this.handlePress }>
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
    height: screenHeight - 75,
    marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f2'
  },
  preview:{
    height: 480*.94, 
    width: 274*.94,
    borderWidth:2, 
    borderColor:'black',
    backgroundColor: 'white',
    marginBottom: 2
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
    marginRight: 40
   // marginBottom: 5
  }
})

const mapStateToProps = (state) => {
  return {
    filterToUpload: state.uploadReducer.filterToUpload, 
    isValidatingImage: state.uploadReducer.isValidatingImage,
    filterUploadError: state.uploadReducer.filterUploadError,
    uploadFilterComplete: state.uploadReducer.uploadFilterComplete
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitUpload: (filterData) => {
     // console.log('filter in mapDispatch: ', filter);
      uploadActions.submitFilter(dispatch, filterData)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFilter);


