import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TouchableHighlight
} from 'react-native';

import SingleEvent from './SingleEvent'

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

import Icon from 'react-native-vector-icons/Entypo';

/*
		Basic concept:
			- on component mount, we ping back-end to get the user's events (or whatever we call them)
				- can also do this on startup/welcome screen (prob should)

			- it will prob be a List View

			- each of the 'events' will be its own component (ie, Event)

			- Event component will need the following props:
				- event title
				- event date/time
				- geocoords (not shown)

			- 

*/

let sampleEvents = [
	{
		eventTitle: "Kendra's House Party",
		startDate: "11/12/16",
		startTime: "12:00AM",
		endDate: "11/13/16",
		endTime: "2:00AM",
		coords: null,
		eventID: 1,
		filterURI: "../event2.png"
	},
	{
		eventTitle: "SwoleFest 2016",
		startDate: "11/12/16",
		startTime: "12:00AM",
		endDate: "11/13/16",
		endTime: "2:00AM",
		coords: null,
		eventID: 2,
		filterURI: "../event3.png"
	},
	{
		eventTitle: "Thanksgiving at the Park house!",
		startDate: "11/12/16",
		startTime: "12:00AM",
		endDate: "11/13/16",
		endTime: "2:00AM",
		coords: null,
		eventID: 2,
		filterURI: "../weho_halloween.png"
	}
]

export default class MyFilters extends Component {
	constructor(props){
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			events: sampleEvents,
			dataSource: ds.cloneWithRows(sampleEvents)
		}
	}

	componentDidMount(){
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.setState({
			dataSource: ds.cloneWithRows( sampleEvents )
		})

	}

	componentWillReceiveProps(newProps, oldProps){
		console.log('newProps.events in componentWillReceiveProps: ', newProps.events)

		if(newProps.events !== oldProps.events){		// THIS COMPARISON PROBABLY DOESN'T WORK

			const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

			console.log(' newProps ... ')
			this.setState({
				dataSource: ds.cloneWithRows( newProps.events )
			})
		}
	}

	render(){

		//style={{height: 25, borderBottomWidth: 1, borderColor: 'black'
		//	    <View style={{position: 'absolute', top: 30, left: 10, right: 10, bottom:50, paddingLeft:10, paddingRight:10,borderWidth: 1, borderRadius: 3, borderColor:'black'}}>
        

		return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
            	<View style={{width: 30, marginLeft: 15}}>
              		<Icon name="home" size={30} color="#0c12ce" />
            	</View>
            	<View style={styles.searchBox}>
              		<Text style={{fontSize: 16}}>My GeoLenses</Text>
            	</View>
            	<View style={{width: 30, marginRight: 15}}>
              		<Icon name="info" size={30} color="#0c12ce" />
            	</View>
          	</View>
          	  <View style={styles.eventListContainer}>
    
            	<ListView

              		dataSource={this.state.dataSource}
              		renderRow={(rowData) => {
                	return (
                		<View key={rowData.id} >
                  			<SingleEvent { ...rowData } />
                		</View>
                	)
               		}
              		}/>
              </View>

        </View>
        )
    }
}



const styles = StyleSheet.create({
  container: {
    height: screenHeight - 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f2'
  },
  titleContainer: {
    height: 45, 
    position: 'absolute',
    top: 50,
    width: screenWidth,
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventListContainer: {
  	position: 'absolute',
    top: 100,
    left: 5,
    right: 5,
    bottom: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1
  }
});
