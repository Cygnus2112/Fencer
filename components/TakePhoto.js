import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    BackAndroid,
    Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

import Camera from 'react-native-camera';
import PreviewWithFilter from './PreviewWithFilter';
import Preview from './Preview';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Share from 'react-native-share';
import RNViewShot from "react-native-view-shot";

const { width, height } = Dimensions.get('window');

const screenWidth = width;
const screenHeight = height;

const imageHeight = screenHeight;
const imageWidth = (imageHeight *1080)/1920;

class TakePhotoComponent extends Component {
	constructor(props){
		super(props);

		this.takePicture = this.takePicture.bind(this);
    this.switchType = this.switchType.bind(this);
    this.switchFlash = this.switchFlash.bind(this);
    this.handleTrash = this.handleTrash.bind(this);

    this.share = this.share.bind(this);

    this.onBackPress = this.onBackPress.bind(this);

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

  onBackPress(){
    if(this.props.test){
      Actions.pop();
    }
    if (this.state.applyFilter) {
      this.setState({
        applyFilter: !this.state.applyFilter
      })
      return true;
    }
  }

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', this.onBackPress );
  }

  componentWillReceiveProps(newProps){
    if(newProps.currentTime > this.props.endUTC && this.props.currentTime <= this.props.endUTC){
      Alert.alert('Geofilter Expired', "Sorry, but the Geofilter you are using has expired.", [{text: 'okay', onPress: () => {
        Actions.pop();
      }}])
    }
  }

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackPress );
  }

  handleTrash() {
    Actions.pop()
  }
      
	takePicture() {
	  	this.camera.capture()
	      .then((data) => {                
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

  }

  share(platform){

    let start = Date.now();

      RNViewShot.takeSnapshot(this.refs["photoAndFilter"], {
        format: "jpeg",
        quality: 1.0,
        result: 'data-uri'
      })
      .then(uri => {
        if(platform) {
          let shareImage = {
            message: "",
            url: uri,
            social: platform
          };
          Share.shareSingle(shareImage).catch(err => {
            console.log('Error in TakePhoto share:', err);
          })
        } else {
          let shareImage = {
            message: "",
            url: uri,
            subject: "Check out my pic" //  for email
          };
          Share.open(shareImage);
        }
      },error => console.error("Oops, snapshot failed", error))
  }

  render() {
    let filterURI = "data:image/png;base64,"+this.props.filterURI;   

    return (<View >
        {!this.state.applyFilter
          ?
       
       (<View style={styles.container}>
            {this.props.test
                ?
              (<View style={styles.trash}>
              <TouchableOpacity style={{zIndex: 50}} onPress={ this.handleTrash }>
                  <Icon name="circle-with-cross" size={30} color="black" />  
              </TouchableOpacity>
            </View>
                )
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
              this.camera = cam;           
            }}
            style={styles.preview}
            orientation={"portrait"}
            aspect={Camera.constants.Aspect.fill}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            mirrorImage={this.state.camera.mirror}
            defaultTouchToFocus
            captureTarget={Camera.constants.CaptureTarget.temp}>  

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
        </View>)
      }
      </View>)

  }
}

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
    height: imageHeight,
    width: imageWidth
  },
  filter:{
    width: imageWidth, 
    height: imageHeight
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
    width: imageWidth,
    height: imageHeight, 
 //   marginBottom:20
  },
  photo:{
    width: imageWidth,
    height: imageHeight,
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
    left: (imageWidth)/2 - 50,
    zIndex: 5
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: (imageWidth) - 65,
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
    right:20,
    elevation:3,
    height:35,
    width:35,
    // justifyContent: 'center',
    // alignItems: 'center',
   //     borderColor: 'black',
   // borderWidth:1,
   zIndex: 5
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
    filterImage: state.filterReducer.filterImage,
    currentTime: state.authReducer.currentTime
  }
}

const TakePhoto = connect(mapStateToProps, null)(TakePhotoComponent);
export default TakePhoto;