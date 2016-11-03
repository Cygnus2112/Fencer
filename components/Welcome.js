import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Text,
} from 'react-native';

import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

export default class Welcome extends Component{
  constructor(props){
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
    this.loadMyFilters = this.loadMyFilters.bind(this);
  }
  handleCreate(){
    Actions.upload();
  }
  loadMyFilters(){
    Actions.myfilters({events: [
      {eventTitle: "Tyson's Cock Party!", dates:'11/4/16 - 11/6/16', coords: null, id:1  }, 
      {eventTitle: "Jazmyne's Gangbang", dates:'11/5/16 - 11/5/16', coords: null, id:2  }, 
      {eventTitle: "Lizzy's Drum Circle", dates:'11/5/16 - 11/5/16', coords: null, id:3  }] 
    })
  }


//justifyContent: 'center', alignItems: 'center'
//containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
  render(){
    return (
      <View style={{flex:1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <Text style={{fontSize: 24 }}>
            Welcome!
          </Text>
        </View>
        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:50,
             width: 200,
             overflow:'hidden',
             borderRadius:4,
             borderWidth:2,
             borderColor: 'black',
             backgroundColor: 'blue',
           }}>
              <Button
                style={{fontSize: 18, color: 'white'}}
                styleDisabled={{color: 'red'}}
                onPress={ this.handleCreate }>
                Create New Geofilter
              </Button>
          </View>
        </View>
        <View style={{flex:2,justifyContent: 'center',alignItems: 'center'}}>
          <View style={{
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             margin: 5,
             height:50,
             width: 200,
             overflow:'hidden',
             borderRadius:4,
             borderWidth:2,
             borderColor: 'black',
             backgroundColor: 'blue',
           }}>
              <Button
                style={{fontSize: 18, color: 'white'}}
                styleDisabled={{color: 'red'}}
                onPress={ this.loadMyFilters } >
                My Geofilters
              </Button>
          </View>
        </View>
        <View style={{flex:1}}>
        </View>
      </View>
    )
  }
}
