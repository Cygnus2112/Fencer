import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native';

import Share from 'react-native-share';
import RNViewShot from "react-native-view-shot";
import Button from 'react-native-button';

const { width, height } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

class ApplyFilterComponent extends Component{
    constructor(props){
      super(props);

    }

    componentDidMount(){

    //   Image.prefetch(this.props.filterURI).then(() => {    // see if this speeds things up
    //      // this.setState({
    //      //      imageLoaded: true
    //      //  })
    //   })

       // setTimeout(() => {

    //  1)  CHANGE SETTIMEOUT TO COMPONENT WILL RECEIVE PROPS
    //          ... or Redux it    
    //  2)  SHARE BUTTON SHOULDN'T APPEAR TILL IMG IS READY  

    //  this may be happening too early...

         // },1000)
    }

    render(){

      let dataURI = "data:image/png;base64,"+this.props.filterURI;

      return(
      <View style={styles.container}>

        <View ref="photoAndFilter" collapsable={false} style={styles.photoAndFilter}>
          <Image style={styles.photo} source={{ uri: this.props.photoURI}}>
            <Image source={{uri: dataURI}} style={styles.filter}/>
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
}

const styles = StyleSheet.create({
  instructions: {
    // marginTop: 20,
    // marginBottom: 20,
  },
  container: {
    //flex: 1,
    //width: undefined,
    //height: undefined,
    width: screenWidth,
    height: screenHeight,
    flexDirection: 'column',
    backgroundColor:'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center'
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
  }
});

  const ApplyFilter = ApplyFilterComponent;
  export default ApplyFilter;
