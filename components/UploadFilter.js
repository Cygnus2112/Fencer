import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    Dimensions,
    ActivityIndicator         
} from 'react-native';




import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;




import Spinner from './Spinner';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
var ImagePicker = require('react-native-image-picker');
   import ImageResizer from 'react-native-image-resizer';

import Icon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');
let screenHeight = height;
let screenWidth = width;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as filterActions from '../actions/filterActions';
import * as uploadActions from '../actions/uploadActions';

class UploadFilter extends Component {
    constructor(props){
      super(props);

      this.handlePress = this.handlePress.bind(this);
    //  this.handleUpload = this.handleUpload.bind(this);

      this.state = {
        png: {data: null},
        buttonState: '',
        isFetchingImage: false
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

  //    setTimeout(() => {
              this.setState({
        isFetchingImage: true
      })
  //    },200)

     ImagePicker.launchImageLibrary({}, (response) => {
        if (response.didCancel) {
          console.log('User cancelled photo picker');

          this.setState({
            isFetchingImage: false
          })

        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);

            this.setState({
              isFetchingImage: false
            })

        } else {
          console.log('-----------------------------------------');
          console.log('image height in ImagePicker: ', response.height);
          console.log('image height in ImagePicker: ', response.width);
          console.log('image size in ImagePicker: ', response.fileSize);
          if(response.type === 'image/jpeg'){


            // TRIGGER ERROR HERE
            // should prob just be if(response.type !== 'image/png')



            const source = {uri: response.uri, isStatic: true};
            this.setState({
              jpg: source
            })
          } else {

            if(response.height > 1920 || response.width > 1080) {

              const baseUri = "data:image/png;base64," + response.data;
              console.log('baseUri: ', baseUri.slice(0,40));
              ImageResizer.createResizedImage(baseUri, 1080, 1920, 'PNG',100).then((resizedImageUri) => {
                console.log('resized image url: ', resizedImageUri);

              // only when we do the final submit do we convert the image URI into data


                fs.readFile(resizedImageUri, 'base64')
                  .then((data) => {
                    var byteLength = parseInt((data).replace(/=/g,"").length * 0.75);
                    console.log('file size in base64 convert: ', byteLength);

                    this.setState({
                      png: {data: data},
                      isFetchingImage: false
                    });


                  })




                }).catch((err) => {

                });


            } else{
              const source = {data: response.data};

              // TRIGGER FILE SIZE ERROR HERE
              // in case the height and width are within limits but file is super big anyway
              // if(response.fileSize > 1mg)




            // only when we do the final submit do we convert the image URI into data

              let byteLength = parseInt((response.data).replace(/=/g,"").length * 0.75);
              console.log('file size in base64 convert: ', byteLength);

              this.setState({
                png: {data: source.data},
                isFetchingImage: false
              });


            }






          }
        }
      });

    }     
//height: 1920/4, width: 1080/4


    render(){
      // if(this.state.png.data){
      //   console.log('this.state.png.data (first 20 chars): ', this.state.png.data.slice(0,20));
      //   console.log('this.state.png.data (last 20 chars): ', this.state.png.data.slice(this.state.png.data.length-20,this.state.png.data.length-1));
      // }

      //this.state.png.uri ? {uri: this.state.png.uri} : 

      if(this.props.isValidatingImage){
        return ( <Spinner /> );
      } else {
        return (
            <View style={ styles.container }>
                <View style={{height: 482*.94, width: screenWidth, flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableHighlight onPress={() => { Actions.loading() }}>
                    <View style={{width: 30,marginRight:10,marginTop:5}}>
                      <Icon name="home" size={30} color="#0c12ce" />
                    </View>
                  </TouchableHighlight>
                  <Image source={require('../assets/png_background.png')} style={styles.preview}>
                  {this.state.isFetchingImage
                    ?
                  (<ActivityIndicator style={styles.insidespinner} size={75} color="white"/>)
                    :
                   this.props.filterToUpload
                      ?
                    (<Image source={{uri: `data:image/png;base64,${this.props.filterToUpload.data}` }} resizeMode={'contain'} style={{height: 480*.94, width: 274*.94}}/>)
                      :
                    (<Image source={{uri: `data:image/png;base64,${this.state.png.data}` }} resizeMode={'contain'} style={{height: 480*.94, width: 274*.94}}/>)
                    
                  }
                  </Image>
                
                  <View style={{width: 30,marginLeft:10,marginTop:5}}>
                    <Icon name="info" size={28} color="#0c12ce" />
                  </View>
                </View>

                <View style={{width: screenWidth-25, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginTop:5}}>
                {this.props.filterToUpload
                    ?
                  (<View style={ styles.buttonBoxDiscard }>
                    <Button
                      style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'white',borderRadius:4}}
                      styleDisabled={{color: 'red'}}
                      onPress={ () => {

                        // clear out filter image prop
                        this.props.clearFilterImage();

                      }}>
                      {"Discard & Start Over"}
                    </Button>
                  </View>)
                    :
                  this.state.png.data
                    ?
                  (<View style={ styles.buttonBoxLarge} >
                    <View style={ [styles.buttonBox, {backgroundColor: 'red' }] }>
                      <Button
                        style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'white',borderRadius:4}}
                        onPress={( ) => { this.setState({png:{data: null}})} }>
                        Discard
                      </Button>
                    </View>
                    <View style={ [styles.buttonBox, {backgroundColor: 'green' }] }>
                      <Button
                        style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'white',borderRadius:4}}
                        styleDisabled={{color: 'red'}}
                        onPress={( ) => { this.props.submitUpload(this.state.png) } }>
                        {"Submit"}
                      </Button>
                    </View>
                  </View>
                  )
                    :
                  (<View style={ styles.buttonBox }>
                    <Button
                      style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 16, color: 'white',borderRadius:4}}
                      styleDisabled={{color: 'red'}}
                      onPress={ this.handlePress }>
                      {"Select"} Filter
                    </Button>
                  </View>)
                }

                </View>
            </View>)
      }
      
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
    paddingTop: 5,
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
    // marginLeft: 40,
    // marginRight: 40
   // marginBottom: 5
  },
  buttonBoxLarge:{
    height:40,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonBox:{
    elevation:3,
    padding:7,
    height:40,
    width: 130,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce',
    // marginLeft: 40,
    // marginRight: 40
   // marginBottom: 5
  },
  buttonBoxDiscard:{
    elevation:3,
    padding:7,
    height:40,
    width: 180,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce',
    // marginLeft: 40,
    // marginRight: 40
   // marginBottom: 5
  },
  insidespinner: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
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
    clearFilterImage: () => {
      uploadActions.clearFilterImage(dispatch);
    },
    submitUpload: (filterData) => {
     // console.log('filter in mapDispatch: ', filter);
      uploadActions.submitFilter(dispatch, filterData)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFilter);


