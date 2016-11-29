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
    // this.handleZoom = this.handleZoom.bind(this);

    this.state = {
      photo: null,
      applyFilter: false,
      camera: {
        type: Camera.constants.Type.back,
        flashMode: Camera.constants.FlashMode.auto,
        mirror: false
      }
    }
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

  _handleFocusChange(e){
    console.log('focus???')
  }
  _handleZoomChange(e){
    console.log('zoom????')
  }


  render() {
  //  let filterURI = "data:image/png;base64,"+this.props.filterImage;
  let filterURI = "data:image/png;base64,"+this.props.filterURI;
    return (<View>
        {!this.state.applyFilter
          ?

        (<View style={styles.container}>
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

          <TouchableOpacity
            style={styles.flashButton}
            onPress={this.switchFlash}>
            <Image
              source={this.flashIcon}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.switchType}>
            <View style={{width: 50, height: 50,
                  flex: 0,
                  marginBottom: 40
            }}>
            <Image source={require('../assets/camera-switch.png')} style={{width: 50, height: 50,backgroundColor: 'white'}} />

            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.takePicture}>
            <View style={{width: 50, height: 50,
                  flex: 0,
                  padding: 10,
                  margin: 40,
                  borderRadius: 25,
                  borderColor: 'white',
                  borderWidth: 2

            }} />
          </TouchableOpacity>

        </Camera>
        </View>)

        :
        (<View style={styles.container}>
        <View ref="photoAndFilter" collapsable={false} style={styles.photoAndFilter}>
          <Image style={styles.photo} source={{ uri: this.state.photo}}>
            <Image source={{uri: filterURI}} style={styles.filter}/>
          </Image>  
        </View>
            <View style={styles.button}>
              <TouchableOpacity onPress={()=>{
                console.log("----------------------------------------")

                RNViewShot.takeSnapshot(this.refs["photoAndFilter"], {
                  format: "jpeg",
                  quality: 1.0,
                  result: 'data-uri'
                })
                .then(
                    uri => {
                      console.log("Image saved to uri")
                      console.log("----------------------------------------")

                      let shareImage = {
                        title: "React Native",
                        message: "Hola mundo",
                       // url: this.state.snapshotURI,
                        url: uri,
                        subject: "Share Link" //  for email
                      };
                      Share.open(shareImage);


                },
                error => console.error("Oops, snapshot failed", error)
              )}}>
              <View style={styles.instructions}>
                <Text>Share</Text>
              </View>
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
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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
    marginBottom:20,
    // borderColor: 'red', 
    // borderWidth: 2 
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
  filter:{
    width: screenWidth * .9, 
    height: screenHeight *.95,
    // borderColor: 'green', 
    // borderWidth: 2
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
  flashButton: {
    padding: 5,
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