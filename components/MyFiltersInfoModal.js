import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    TouchableHighlight,
    Modal,
    ScrollView 
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

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

                  <Text style={{marginTop: 20, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>Tap any geofilter to open it in your camera. A geofilter can only be opened if it is <Text style={{fontWeight: 'bold'}}>unlocked</Text> -- i.e., if the geofilter is active and you are within its designated geofence area. (Note: Location services MUST be enabled on your device for {"Fencer's"} geofencing features to work. You will not be able to access any geofilters if location is not enabled.) </Text>

                  <Text style={{marginTop: 10, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>Tap the <Icon name={"file-text-o"} size={17} color={"black"}/> icon to view relevant details, including Start Date, End Date, and any other additional information provided by the {"geofilter's"} creator. (Like driving directions, scavenger hunt details, etc.)</Text>

                  <Text style={{marginTop: 10, fontFamily: 'RobotoCondensed-Regular',fontSize: 16, padding: 3,paddingLeft: 6}}>A <Icon name={"bookmark"} size={17} color={"blue"}/> indicates a geofilter that {"you've"} created. You can share any geofilter {"you've"} created using the <Icon name={"share-alt"} size={18} color={"black"}/> icon, or delete it using the <Icon name={"trash-o"} size={17} color={"black"}/> icon. <Text style={{fontWeight: 'bold'}}>Note:</Text> This will also remove your geofilter from the devices of any Fencer users with whom {"you've"} shared it. This process can sometimes take a few minutes, depending on how many users have added the geofilter.</Text>
         
                </ScrollView>
                  <TouchableHighlight 
                    style={{marginTop: 7, height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                    onPress={() => {
                      this.props.toggleModal();
                      this.setState({modalVisible: !this.state.modalVisible});
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
  modalContainer: {
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center'
  },
  modalScroll: {
    paddingBottom: 5,
    backgroundColor:'white',
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
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

export default InfoModal;