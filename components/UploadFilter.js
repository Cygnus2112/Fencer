import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
var ImagePicker = require('react-native-image-picker');

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

          // let formdata = new FormData();
          // formdata.append("avatar",response)

          // fetch(globalConfigs.api_url+"/gallery_upload_mobile",{
          //   method: 'post',
          //   headers: {
          //     'Accept': 'application/json',
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify(formdata)
          // }).then(response => {
          //   console.log("image uploaded")
          // }).catch(err => {
          //   console.log(err)
          // })
          //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

            const source = {uri: response.uri, isStatic: true};

            this.setState({
                png: source
            });
          }
        }
      });
    }
    render(){
      return(
        <View style={{flex:1,alignItems: 'center',justifyContent: 'center',backgroundColor: 'silver'}}>
          <Text style={{fontSize: 16}}>
            Preview:
          </Text>
          <View style={{flex: 1,height: 480, width: 274,borderWidth:2, borderColor:'black',backgroundColor: 'white'}}>
            <Image source={this.state.png} style={{height: 1920/4, width: 1080/4}}/>
          </View>
          <View style={{
             elevation:3,
             padding:10,
             margin: 5,
             height:45,
             width: 150,
             overflow:'hidden',
             borderRadius:4,
             backgroundColor: 'blue',
           }}>
            <Button
              style={{fontSize: 20, color: 'white',borderRadius:4}}
              styleDisabled={{color: 'red'}}
              onPress={this.state.png ? this.handleUpload : this.handlePress }>
              { this.state.png ? ("Upload") : ("Select PNG") }
            </Button>
          </View>
        </View>
      )
    }
}
//<Image source={this.state.jpg} style={{height: 1920/4, width: 1080/4}}>
//<View style={{flex: 1, alignItems: 'center',justifyContent: 'center',borderColor: 'black',borderRadius:2}}>
