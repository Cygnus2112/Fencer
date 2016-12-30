import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert         
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

      this.handleTest = this.handleTest.bind(this);

      this.state = {
        png: {data: null},
        buttonState: '',
        isFetchingImage: false
      }
    }

    componentDidMount(){
     // console.log('this.props.filterToUpload: ', this.props.filterToUpload);
    }

    handleTest( uri ){
      Actions.camera({test: true, filterURI: uri });

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
          if(response.type !== 'image/png'){

            Alert.alert('Error', 'Image must be in PNG format.', [{text: 'OK', onPress: () => console.log('OK Pressed!')}])

            this.setState({
              isFetchingImage: false
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

              if(byteLength > 1000000){

                Alert.alert('Error', 'Image size must be less than 1mb.', [{text: 'OK', onPress: () => {
                  this.setState({
                    isFetchingImage: false
                  })
                  console.log('OK Pressed!')


              }}])

              } else {

                    this.setState({
                      png: {data: data},
                      isFetchingImage: false
                    });
}



                  })

                }).catch((err) => {

                });


            } else{
              const source = {data: response.data};

            // only when we do the final submit do we convert the image URI into data

              if(response.fileSize > 1000000){

                Alert.alert('Error', 'Image size must be less than 1mb.', [{text: 'OK', onPress: () => {
                    console.log('OK Pressed!');
                    this.setState({
                      isFetchingImage: false
                    })

                  }
                }])

              } else {

                let byteLength = parseInt((response.data).replace(/=/g,"").length * 0.75);
                console.log('file size in base64 convert: ', byteLength);

                this.setState({
                  png: {data: source.data},
                  isFetchingImage: false
                });

              }

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

      if(this.props.isValidatingImage){
        return ( <Spinner /> );
      } else {
        return (
            <View style={ styles.container }>
                <View style={{height: 482*.94, width: screenWidth, flexDirection: 'row', justifyContent: 'center'}}>
                  
                  <View style={{width: 30,marginRight:10,marginTop:5}}>
                    <TouchableOpacity onPress={() => { 
                      this.props.clearProps();
                      Actions.loading(); 
                    }}>
                      <Icon name="home" size={30} color="#0c12ce" />
                    </TouchableOpacity >
                  </View>
                  
                  <Image source={require('../assets/png_background.png')} style={styles.preview}>
                  {this.state.isFetchingImage
                    ?
                  (<ActivityIndicator style={styles.insidespinner} size={75} color="white"/>)
                    :
                   this.props.filterToUpload
                      ?
                    (<Image source={{uri: `data:image/png;base64,${this.props.filterToUpload.data}` }} resizeMode={'contain'} style={{height: 480*.94, width: 274*.94}}>
                        <View style={styles.testButton}>
                          <TouchableOpacity onPress={() => { this.handleTest( this.props.filterToUpload.data ) } }>
                            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>Test</Text>
                          </TouchableOpacity>
                        </View>
                      </Image>)
                      :
                    this.state.png.data
                      ?
                    (<Image source={{uri: `data:image/png;base64,${this.state.png.data}` }} resizeMode={'contain'} style={{height: 480*.94, width: 274*.94}}>
                        <View style={styles.testButton}>
                          <TouchableOpacity onPress={() => { this.handleTest( this.state.png.data ) } }>
                            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>Test</Text>
                          </TouchableOpacity>
                        </View>
                      </Image>)
                      :
                      (        <View style={styles.guidelines}>
                                  
            <Text style={{fontSize: 20, paddingTop: 4,paddingLeft: 6}}>Filter {"Image"} Guidelines</Text>
            <Text style={{fontSize: 12, padding: 3,paddingLeft: 6}}>- Files must be in <Text style={{fontWeight: 'bold'}}>PNG</Text> format.</Text>
            <Text style={{fontSize: 12, padding: 3,paddingLeft: 6}}>- Images should be <Text style={{fontWeight: 'bold'}}>1080px</Text> wide by <Text style={{fontWeight: 'bold'}}>1920px</Text> high, with a transparent background. (Images exceeding max dimensions will be resized to fit.)</Text>
            <Text style={{fontSize: 12, padding: 3,paddingLeft: 6}}>- File size must be under <Text style={{fontWeight: 'bold'}}>1mb</Text>. (For best results, try to keep it under 400kb.)</Text>
            <Text style={{fontSize: 12, padding: 3,paddingLeft: 6}}>- To preview a filter on your device, tap <Text style={{fontWeight: 'bold'}}>"test"</Text> after selecting an image.</Text>
            <Text style={{fontSize: 12, padding: 3,paddingLeft: 6}}>- Need help designing your filter? Tap the <Text style={{fontWeight: 'bold'}}>info</Text> icon for a list of free online resources.</Text>
   {/*       <View style={styles.guidelineTitle}>
            <Text style={{fontSize: 20,color: 'red'}}>Filter image guidelines:</Text>
          </View>
          <View style={styles.guideline}>
            <Text style={{fontSize: 14}}>Files must be in PNG format.</Text>
          </View>
          <View style={styles.guideline}>
            <Text>Images should be 1080px wide by 1920px high, with a transparent background. (Images exceeding max dimensions will be resized to fit.)</Text>
          </View>
          <View style={styles.guideline}>
            <Text>File size must be under 1mb. (For best results, try to keep it under 400kb.)</Text>
          </View>
          <View style={styles.guideline}>
            <Text>To preview a filter on your device, tap "test" after selecting an image.</Text>
          </View>
                    <View style={styles.guideline}>
            <Text>Need help designing your filter? Tap the info icon for a list of free apps and online resources.</Text>
          </View> */}
        </View>)
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
        justifyContent: 'center',
    alignItems: 'center',
    borderWidth:2, 
    borderColor:'black',
    backgroundColor: 'white',
    marginBottom: 2,
  //  elevation: 3,

  },
  guidelines: {
   // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    width: 220,
    height: 275,
    backgroundColor: 'white',
    elevation: 3,
  },
  guidelineTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 225,
  },
  guideline: {
    width: 225,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderColor: 'black',
    borderWidth: 1,
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
   // marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  testButton: {
    position: 'absolute',
    bottom: 25,
    left: (274*.94)/2 - 40,             //  WILL NEED TO CHANGE ONCE WE DIAL DOWN POSITIONING
    width: 80,
    height: 36,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
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
    },
    clearProps: () => {
      uploadActions.clearUploadProps(dispatch);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFilter);


