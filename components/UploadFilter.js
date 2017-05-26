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
    Alert,
    Modal,
    Linking,
    ScrollView         
} from 'react-native';

import Spinner from './Spinner';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
var ImagePicker = require('react-native-image-picker');
import ImageResizer from 'react-native-image-resizer';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

import Icon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');

let screenHeight = height;
let screenWidth = width;

let imageHeight = height - 130;
let imageWidth = (imageHeight * 1080)/1920;

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
        isFetchingImage: false,
        infoPressed: false
      }
    }

  //  componentDidMount(){

   //   console.log('screenHeight: ', screenHeight);
    //  console.log('screenWidth: ', screenWidth);

     // FOR AVD TESTING:

      // this.setState({
      //   png: {data:baseUri}
      // })
  //  }

    handleTest( uri ){
      Actions.camera({test: true, filterURI: uri });

    }

    handlePress(){

  //    setTimeout(() => {
      this.setState({
        isFetchingImage: true
      })
  //    },200)

     ImagePicker.launchImageLibrary({}, (response) => {
        if (response.didCancel) {
          console.log('User canceled photo picker');

          this.setState({
            isFetchingImage: false
          })

        } else if (response.error) {
            console.warn('ImagePicker Error: ', response.error);

            this.setState({
              isFetchingImage: false
            })

        } else {
          console.log('-----------------------------------------');
       //   console.log('image height in ImagePicker: ', response.height);
       //   console.log('image height in ImagePicker: ', response.width);
          console.warn('image size in ImagePicker: ', response.fileSize);
          if(response.type !== 'image/png'){

            Alert.alert('Error', 'Image must be in PNG format.', [{text: 'OK', onPress: () => console.log('OK Pressed!')}])

            this.setState({
              isFetchingImage: false
            })

          } else {

            if(response.height > 1920 || response.width > 1080) {

              const baseUri = "data:image/png;base64," + response.data;
              console.warn('baseUri: ', baseUri.slice(0,40));

              ImageResizer.createResizedImage(baseUri, 1080, 1920, 'PNG',100).then((resizedImageUri) => {
                console.warn('resized image url: ', resizedImageUri);

              // only when we do the final submit do we convert the image URI into data


                fs.readFile(resizedImageUri, 'base64')
                  .then((data) => {
                    var byteLength = parseInt((data).replace(/=/g,"").length * 0.75);
                    console.warn('file size in base64 convert: ', byteLength);

                  if(byteLength > 1050000){

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

              if(response.fileSize > 1050000){

                Alert.alert('Error', 'Image size must be less than 1mb.', [{text: 'OK', onPress: () => {
                    console.log('OK Pressed!');
                    this.setState({
                      isFetchingImage: false
                    })

                  }
                }])

              } else {

                let byteLength = parseInt((response.data).replace(/=/g,"").length * 0.75);
                console.warn('file size: ', byteLength);

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
    render(){

      if(this.props.isValidatingImage){
        return ( <Spinner /> );
      } else {
        return (
            <View style={ styles.container }>
                <View style={{position: 'absolute', top: 8, left: 10, width: 30, height: 30 }}>
                    <TouchableOpacity onPress={() => { 
                      this.props.clearProps();
                      Actions.loading({isStartup: false}); 
                    }}>
                      <Icon name="home" size={30} color="#0c12ce" />
                    </TouchableOpacity >
                </View>

                <View style={{position: 'absolute', top: 8, right: 10, width: 30,height:30 }}>
                    <TouchableOpacity onPress={() => {this.setState({infoPressed: true})}} >
                      <Icon name="info" size={30} color="#0c12ce" />
                    </TouchableOpacity>
                </View>

                <View style={{height: imageHeight + 2, width: screenWidth, flexDirection: 'row', justifyContent: 'center'}}>
                  
                  
                  <Image source={require('../assets/png_background.png')} style={styles.preview}>
                  {this.state.isFetchingImage
                    ?
                  (<ActivityIndicator style={styles.insidespinner} size={75} color="white"/>)
                    :
                   this.props.filterToUpload
                      ?
                    (<Image source={{uri: `data:image/png;base64,${this.props.filterToUpload.data}` }} resizeMode={'contain'} style={{height: imageHeight, width: imageWidth}}>
                        <View style={styles.testButton}>
                          <TouchableOpacity onPress={() => { this.handleTest( this.props.filterToUpload.data ) } }>
                            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>Test</Text>
                          </TouchableOpacity>
                        </View>
                      </Image>)
                      :
                    this.state.png.data
                      &&
                    (<Image source={{uri: `data:image/png;base64,${this.state.png.data}` }} resizeMode={'contain'} style={{height: imageHeight, width: imageWidth}}>
                        <View style={styles.testButton}>
                          <TouchableOpacity onPress={() => { this.handleTest( this.state.png.data ) } }>
                            <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white'}}>Test</Text>
                          </TouchableOpacity>
                        </View>
                      </Image>)

                  }
                  </Image>
                

                </View>

                <View style={{position: 'absolute', bottom: 2, width: screenWidth, height: 45, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {this.props.filterToUpload
                    ?
                  (<View style={ styles.buttonBoxDiscard }>
                    <Button
                      style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white',borderRadius:4}}
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
                        style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white',borderRadius:4}}
                        onPress={( ) => { this.setState({png:{data: null}})} }>
                        Discard
                      </Button>
                    </View>
                    <View style={ [styles.buttonBox, {backgroundColor: 'green' }] }>
                      <Button
                        style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white',borderRadius:4}}
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
                      style={{fontFamily: 'RobotoCondensed-Regular',fontSize: 20, color: 'white',borderRadius:4}}
                      styleDisabled={{color: 'red'}}
                      onPress={ this.handlePress }>
                      {"Select"}
                    </Button>
                  </View>)
                }

                </View>
      {this.state.infoPressed || !this.props.filterModalDismissed
        ?
      (<InfoModal dismissFilterModal={this.props.dismissFilterModal} modalVisible={true} toggleModal={() => { this.setState({ infoPressed: false}) }} />)
        :
      (null)
      }
            </View>)
      }
      
    }
}

class InfoModal extends Component {
  constructor(props){
    super(props);
    
    this.state = {
          modalVisible: this.props.modalVisible
      }
  }
//<View style={styles.infoModal}>
  render(){
    return(
      <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { console.log("Modal has been closed.")}}>
            <View style={styles.modalContainer}>
              <View style={styles.infoModal}>

                <ScrollView contentContainerStyle={styles.modalScroll}>
                  <View style={{position: 'absolute', top: 10, left: 10,right:10, height: 35}}>
                    <Text style={{textAlign: 'center', fontFamily: 'RobotoCondensed-Regular', textDecorationLine: 'underline', fontSize: 20, paddingLeft: 6}}>{"Filter Image Guidelines"}</Text>
                  </View>
                  <View style={{ marginTop: 40, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={{ fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>- Files must be in <Text style={{fontWeight: 'bold'}}>PNG</Text> format.</Text>
                    <Text style={{ fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>- Images should be <Text style={{fontWeight: 'bold'}}>1080px</Text> wide by <Text style={{fontWeight: 'bold'}}>1920px</Text> high, with a transparent background. (Images exceeding max dimensions will be resized to fit.)</Text>
                    <Text style={{ fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>- File size must be under <Text style={{fontWeight: 'bold'}}>1mb</Text>. (For best results, try to keep it under 400kb.)</Text>
                    <Text style={{ paddingBottom:10, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6, borderBottomColor: 'black', borderBottomWidth: 1}}>- To preview a filter on your device, tap <Text style={{fontWeight: 'bold'}}>"test"</Text> after selecting an image.</Text>
                  </View>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, marginTop:10, marginBottom: 10}}>Need help designing your geofilter? There are lots of great free photo editors available online. Here are a few of our favorites:</Text>
                
                <View style={{position: 'absolute', left: 10,right:10, justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity onPress={()=>{Linking.openURL('https://www.picmonkey.com/')}}>
                    <Text style={{textAlign: 'center',fontFamily: 'RobotoCondensed-Regular',fontSize:16, color: 'blue', margin: 5}}>PicMonkey (picmonkey.com)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{Linking.openURL('https://pixlr.com/editor/')}}>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, color: 'blue', margin: 5}}>Pixlr (pixlr.com/editor)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{Linking.openURL('http://www.fotor.com/')}}>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, color: 'blue', margin: 5}}>Fotor (fotor.com)</Text>
                  </TouchableOpacity>
                </View>

                  <Text style={{fontFamily: 'RobotoCondensed-Regular',fontSize:16, marginTop: 100, marginBottom: 10}}>{"If you need inspiration, Snapchat's geofilter site "} 
                    <Text style={{fontWeight: 'bold'}} onPress={()=>{Linking.openURL('https://geofilters.snapchat.com/')}}> (geofilters.snapchat.com) </Text> 
                      offers a variety of customizable Photoshop and Illustrator templates. (You can also <Text style={{fontWeight: 'bold'}} onPress={()=>{Linking.openURL('https://unlockables-odg-templates.storage.googleapis.com/geofilter-templates.zip')}}>download the filters in .zip format</Text>.)</Text>
             
                </ScrollView>
                  <TouchableHighlight 
                    style={{marginTop: 7, height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                    onPress={() => {
                      this.props.toggleModal();
                      this.setState({modalVisible: !this.state.modalVisible});
                      this.props.dismissFilterModal();
                    }
                  }>
                    <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
                  </TouchableHighlight>
            </View>
          </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalScroll: {
    //margin:10,
   // marginTop: 5,
    //paddingTop: 5,
    paddingBottom: 5,
    backgroundColor:'white',
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  container: {
    height: screenHeight - 75,    // 517, minus 45 for buttonBox = 472 max height for pics
    paddingTop: 2,                //  buttonBox + navBar = 120. Plus 10 for padding = 130.
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f9f9f2',

    // borderColor: 'red',
    // borderWidth: 1,
  },
  preview:{
    height: imageHeight + 4,    //  451.1
    width: imageWidth + 4,     //  257.56
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor:'black',
  //  backgroundColor: 'white',
  //  marginBottom: 2,
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
    padding:5,
    height:40,
    width: 130,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce',
    borderColor: 'black',
    borderWidth: 1,
    // marginLeft: 40,
    // marginRight: 40
   // marginBottom: 5
  },
  buttonBoxLarge:{
    height:45,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: 'black',
    // borderWidth: 1,
  },
  buttonBoxDiscard:{
    elevation:3,
    paddingTop:4,
    height:40,
    width: 200,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce',
    // marginLeft: 40,
    // marginRight: 40
    //marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1
  },
  insidespinner: {
   // marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8
  },
  testButton: {
    position: 'absolute',
    bottom: 20,
    left: imageWidth/2 - 40,             //  WILL NEED TO CHANGE ONCE WE DIAL DOWN POSITIONING
    width: 80,
    height: 36,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
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
    top: 60, 
    left:40, 
    right: 40, 
    bottom: 60, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
   // backgroundColor:'white',
   backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
    padding: 10
  }
})

const mapStateToProps = (state) => {
  return {
    filterToUpload: state.uploadReducer.filterToUpload, 
    isValidatingImage: state.uploadReducer.isValidatingImage,
    filterUploadError: state.uploadReducer.filterUploadError,
    uploadFilterComplete: state.uploadReducer.uploadFilterComplete,
    filterModalDismissed: state.uploadReducer.filterModalDismissed
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
    },
    dismissFilterModal: () => {
      uploadActions.dismissFilterModal(dispatch);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFilter);


