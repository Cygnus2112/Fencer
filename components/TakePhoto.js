import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    //  ListView,
    BackAndroid
} from 'react-native';

// WILL NEED TO TRACK CURRENT LOCATION AND END TIME/DATE IN CASE USER STAYS IN THIS VIEW AFTER EVENT EXPIRES

// import {
//   CameraKitCamera
// } from 'react-native-camera-kit';

// const FLASH_MODE_AUTO = "auto";
// const FLASH_MODE_ON = "on";
// const FLASH_MODE_OFF = "off";
// const FLASH_MODE_TORCH = "torch";

//  const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

import Icon from 'react-native-vector-icons/Entypo';

import PreviewWithFilter from './PreviewWithFilter';
import Preview from './Preview';

import { connect } from 'react-redux';

var ImagePicker = require('react-native-image-picker');
import { Actions } from 'react-native-router-flux';

import Camera from 'react-native-camera';

import Share from 'react-native-share';
import RNViewShot from "react-native-view-shot";
import Button from 'react-native-button';

const { width, height } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

class TakePhotoComponent extends Component {
	constructor(props){
		super(props);

		this.takePicture = this.takePicture.bind(this);
    this.switchType = this.switchType.bind(this);
    this.switchFlash = this.switchFlash.bind(this);

    this.share = this.share.bind(this);

    this.onCancel = this.onCancel.bind(this);
    // this.handleZoom = this.handleZoom.bind(this);

    this.state = {
      filterInPreview: true,
      photo: null,
      applyFilter: false,
      camera: {
        type: Camera.constants.Type.back,
        flashMode: Camera.constants.FlashMode.auto,
        mirror: false
      }
    }
	}

    componentDidMount(){
      console.log('TakePhoto mounted')
    }
    componentWillUnmount(){
      console.log('TakePhoto un-mounting ... ');
    }


  // constructor(props) {

  //   super(props);
  //   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  //   this.state = {
  //     albums:{},
  //     albumsDS: ds,
  //     shouldOpenCamera: false,
  //     shouldShowListView: false,
  //     image: null,
  //     flashMode:FLASH_MODE_AUTO
  //   }
  // }

  // render() {
  //   return (
  //     this._renderCameraView()
  //   );
  // }


  // _renderCameraView() {
  //   return (
  //     <View style={{ flex:1,  backgroundColor: 'gray', marginBottom:8}}>

  //       <View style={{flex: 1, flexDirection:'column', backgroundColor:'black'}} onPress={this.onTakeIt.bind(this)}>
  //         <CameraKitCamera
  //           ref={(cam) => {
  //                 this.camera = cam;
  //               }}
  //           style={{flex: 1}}
  //           cameraOptions= {{
  //                   flashMode: 'auto',    // on/off/auto(default)
  //                   focusMode: 'off',      // off/on(default)
  //                   zoomMode: 'on'        // off/on(default)
  //                 }}/>
  //         <TouchableOpacity style={{alignSelf:'center', marginHorizontal: 4}} onPress={this.onTakeIt.bind(this)}>
  //           <Text style={{fontSize: 22, color: 'lightgray', backgroundColor: 'hotpink'}}>TAKE IT!</Text>
  //         </TouchableOpacity>
  //       </View>


  //       <View style={{flexDirection: 'row'}}>


  //         {this.state.image &&
  //         <Image
  //           style={{ flexDirection:'row', backgroundColor: 'black', width: 100, height: 100}}
  //           source={{uri: this.state.image.imageURI, scale: 3}}/>}


  //         <TouchableOpacity style={{alignSelf:'center', marginHorizontal: 4}} onPress={this.onLogData.bind(this)}>
  //           <Text>log data</Text>
  //         </TouchableOpacity>

  //         <TouchableOpacity style={{alignSelf:'center', marginHorizontal: 4}} onPress={this.onSwitchCameraPressed.bind(this)}>
  //           <Text>switch camera</Text>
  //         </TouchableOpacity>

  //         <View style={{ flexDirection:'column', justifyContent: 'space-between'}}>
  //           <TouchableOpacity style={{ marginHorizontal: 4}} onPress={this.onSetFlash.bind(this, FLASH_MODE_AUTO)}>
  //             <Text>flash auto</Text>
  //           </TouchableOpacity>

  //           <TouchableOpacity style={{ marginHorizontal: 4, }} onPress={this.onSetFlash.bind(this, FLASH_MODE_ON)}>
  //             <Text>flash on</Text>
  //           </TouchableOpacity>

  //           <TouchableOpacity style={{ marginHorizontal: 4,}} onPress={this.onSetFlash.bind(this, FLASH_MODE_OFF)}>
  //             <Text>flash off</Text>
  //           </TouchableOpacity>

  //           <TouchableOpacity style={{ marginHorizontal: 4,}} onPress={this.onSetFlash.bind(this, FLASH_MODE_TORCH)}>
  //             <Text>flash torch</Text>
  //           </TouchableOpacity>
  //         </View>

  //       </View>
  //     </View>
  //   )
  // }

  // async onSwitchCameraPressed() {
  //   const success = await this.camera.changeCamera();
  // }

  // async onLogData() {
  //   const success = await this.camera.logData();
  // }


  // async onSetFlash(flashMode) {
  //   const success = await this.camera.setFlashMode(flashMode);
  // }

  // async onTakeIt() {
  //   const imageURI = await this.camera.capture(true);
  //   let newImage = {imageURI: "file://" + imageURI.uri};

  //   this.setState({...this.state, image:newImage});
  // }

  componentDidMount(){
    let that = this;

    BackAndroid.addEventListener('hardwareBackPress', function() {

      if (that.state.applyFilter) {
        that.setState({
          applyFilter: !that.state.applyFilter
        })
        return true;
      }

      //return false;
    });
  }
      
	takePicture() {
	  	this.camera.capture()
	      .then((data) => {                
	      	//Actions.applyfilter({photoURI: data.path, filterURI: this.props.filterImage})

          this.setState({
            applyFilter: !this.state.applyFilter,
            photo: data.path
          })

	      })
	      .catch(err => console.error(err));
	}

  switchType() {
    let newType;
    let newMirror;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
      newMirror = true;
    } else if (this.state.camera.type === front) {
      newMirror = false;
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
        mirror: newMirror
      },
    });
  }

  switchFlash() {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('../assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('../assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('../assets/ic_flash_off_white.png');
    }

    return icon;
  }

  onCancel() {
    console.log("CANCEL")
    //this.setState({visible:false});
  }

  share(platform){

    let start = Date.now();
    console.log('getting snapshot...');

    //whatsapp works. facebook works.

                RNViewShot.takeSnapshot(this.refs["photoAndFilter"], {
                  format: "jpeg",
                  quality: 1.0,
                  result: 'data-uri'
                })
                .then(
                    uri => {
                      console.log("Image saved to uri. Time to complete: ", Date.now()-start);
                      console.log("----------------------------------------")

                   //   console.log('image uri: ', uri);

                    if(platform) {

                      let shareImage = {
                      //  title: "React Native",
                        message: "",
                        url: uri,
                        social: platform
                      };
 
                      Share.shareSingle(shareImage).catch(err => {
                        console.log('Error in TakePhoto share:', err);
                      })
                    } else {
                      let shareImage = {
                      //  title: "React Native",
                        message: "",
                        url: uri,
                        subject: "Share Link" //  for email
                      };
                      Share.open(shareImage);
                    }
                },
                error => console.error("Oops, snapshot failed", error)
              )



  }

  _handleFocusChange(e){
    console.log('focus???')
  }
  _handleZoomChange(e){
    console.log('zoom????')
  }


  render() {
  //  let filterURI = "data:image/png;base64,"+this.props.filterImage;

//          <Image source={{uri: filterURI}} style={styles.filter}>
//            {this.state.filterInPreview ? (<Image source={{uri: filterURI}} style={styles.filter}>) : null} 
  //  console.log('this.props.filterURI: ', this.props.filterURI);
    let filterURI = "data:image/png;base64,"+this.props.filterURI;

    //   <Image source={{uri: filterURI}} style={styles.filter}>


    return (<View >
        {!this.state.applyFilter
          ?
       
       (<View style={styles.container}>
            {this.props.test
                ?
              (
                <View style={[styles.backButton,{borderColor: 'white'}]}>
                  <TouchableOpacity onPress={ () => { Actions.pop() }}>
                    <Icon name="chevron-left" size={30} color="white"/>
                  </TouchableOpacity>
                </View>)
                :
              (<TouchableOpacity
                style={styles.flashButton}
                onPress={this.switchFlash}>
                  <Image source={this.flashIcon} style={{width: 32, height: 32,opacity:0.8}}/>
              </TouchableOpacity>)
            }

            {!this.props.test &&
              (<TouchableOpacity 
                onPress={this.switchType}
                style={styles.cameraButton}>
                  <Image source={require('../assets/cameraswitch.png')} style={{width: 32, height: 32, opacity:0.8}} />
              </TouchableOpacity>)
            }

           {/*   COULDN'T MAKE THIS WORK DUE TO PREVIEW IMAGE INEXPLICABLY REMAINING ON SCREEN
                <TouchableOpacity onPress={()=>{
                  //console.log('filter button pressed');
                  this.setState({ filterInPreview: !this.state.filterInPreview });
                } }
                style={{position: 'absolute',top: 10, zIndex:5, left:(screenWidth *.9)/2 - 15} }>
                <Icon name="image" size={30} color="rgba(255,255,255, 0.7)"/>
              </TouchableOpacity> */}

            {!this.props.test &&
              (<TouchableOpacity onPress={this.takePicture} style={styles.takePictureButton}>
                <View style={{width: 50, height: 50,
                  flex: 0,
                  padding: 10,
                  margin: 40,
                  borderRadius: 25,
                  borderColor: 'white',
                  borderWidth: 2,
                  zIndex: 5

                }} />
              </TouchableOpacity>)
            }

       <Camera
            ref={(cam) => {
              this.camera = cam;              //  the new (correct) callback refs style
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            mirrorImage={this.state.camera.mirror}
            defaultTouchToFocus
            captureTarget={Camera.constants.CaptureTarget.temp}
            onZoomChanged={this._handleZoomChange.bind(this)}
            onFocusChanged={this._handleFocusChange.bind(this)}>  

              <PreviewWithFilter filterURI={filterURI} />

         </Camera>     

        </View>)

        :
        (<View style={styles.container}>

          <View ref="photoAndFilter" collapsable={false} style={styles.photoAndFilter}>
            <Image style={styles.photo} source={{ uri: this.state.photo}}>
              <Image source={{uri: filterURI}} style={styles.filter} resizeMode={'contain'} />
            </Image>  
          </View>

            <View style={styles.snapchat}>
              <TouchableOpacity onPress={()=>{this.share('snapchat')} }>
                <Image source={require("../assets/snapchat.png")} style={{width: 25, height: 25}}/>
              </TouchableOpacity>
            </View>

            <View style={styles.whatsapp}>
              <TouchableOpacity onPress={()=>{this.share('whatsapp')} }>
                <Image source={require("../assets/whatsapp.png")} style={{width: 27, height: 27}}/>
              </TouchableOpacity>
            </View>

            <View style={styles.facebook}>
              <TouchableOpacity onPress={()=>{this.share('facebook')} }>
                  <Icon name="facebook" size={25} color="white"/>
              </TouchableOpacity>
            </View>

            <View style={styles.trash}>
              <TouchableOpacity onPress={()=>{this.setState({applyFilter: !this.state.applyFilter})}}>
                  <Icon name="circle-with-cross" size={27} color="white" />
              </TouchableOpacity>
            </View>

          <View style={styles.share}>
            <TouchableOpacity onPress={()=>{ this.share() } }>
              <Icon name="share" size={30} color="white"/>
            </TouchableOpacity>
          </View>

        </View>

          )


      }
      </View>)

  }
}

//  <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>

const styles = StyleSheet.create({
  container: {
  //  flex: 1
    width: screenWidth,
    height: screenHeight,
    flexDirection: 'column',
    backgroundColor:'white',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  filter:{
    width: screenWidth * .9, 
    height: screenHeight *.95
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  photoAndFilter:{
    width: screenWidth * .9, 
    height: screenHeight * .95, 
    marginBottom:20
  },
  photo:{
    width: screenWidth * .9,
    height: screenHeight * .95,
   // backgroundColor:'transparent',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'blue', 
    // borderWidth: 2
  },
  takePictureButton: {
    position: 'absolute',
    bottom: 25,
    left: (screenWidth *.9)/2 - 50,
    zIndex: 5
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: (screenWidth/2) - 65,
    elevation:3,
    padding:7,
    height:40,
    width: 130,
    overflow:'hidden',
    borderRadius:15,
    backgroundColor: '#0c12ce'
  },
  trash: {
    position: 'absolute',
    top: 5,
   // left: (screenWidth/2) - 65,
    right:20,
    elevation:3,
    height:35,
    width:35,
    // borderColor: 'black',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    // borderRadius:5,
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth:1
  },
  facebook: {
    position: 'absolute',
    bottom: 45,
   // left: (screenWidth/2) - 65,
    left: 50,
    elevation:3,
    height:40,
    width:40,
    borderColor: 'black',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1
  },
  snapchat: {
    position: 'absolute',
    bottom: 45,
   // left: (screenWidth/2) - 65,
    left: 115,
    elevation:3,
    height:40,
    width:40,
    borderColor: 'black',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1
  },
  whatsapp: {
    position: 'absolute',
    bottom: 45,
   // left: (screenWidth/2) - 65,
    right: 115,
    elevation:3,
    // height: 35,
    // width: 35,
    height:40,
    width:40,
    borderColor: 'black',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1
  },
  share: {
    position: 'absolute',
    bottom: 45,
   // left: (screenWidth/2) - 65,
    right: 50,
    elevation:3,
    height:40,
    width:40,
    borderColor: 'black',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1
  },
  flashButton: {
    position: 'absolute',
    top: 10,
    left: 30,
    zIndex: 5
  //  padding: 5,
  },
  cameraButton: {
    position: 'absolute',
    top: 10,
    right: 30,
    zIndex: 5
  },
  backButton: {
    position: 'absolute',
    top: 10,
   // left: (screenWidth/2) - 65,
    left: 30,
    zIndex: 5,
    height:40,
    width:40,
    borderColor: 'black',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1
  },
});

const mapStateToProps = (state) => {
  return {
    filterImage: state.filterReducer.filterImage
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {

//   }
// }

const TakePhoto = connect(mapStateToProps, null)(TakePhotoComponent);
export default TakePhoto;