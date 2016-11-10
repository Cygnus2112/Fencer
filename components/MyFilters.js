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
			- on component (and/or application) mount, we ping back-end to get the user's events (or whatever we call them)
				- can also do this on startup/welcome screen (prob should)

			- sorting/filtering the events array is going to be a pain. Will need to:
				- filter out events that have already finished (if they're not deleted on back-end)
				- sort based on 1) start year, 2) start month, 3) start day, 4) start time, 5) end day, 6) end time

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
		filterURI: "../event2.png",
		message: "Let's do this!",
		isActive: true,							//  REMEMBER TO REMOVE
		isInRange: true
	},
	{
		eventTitle: "SwoleFest 2016",
		startDate: "11/12/16",
		startTime: "12:00AM",
		endDate: "11/13/16",
		endTime: "2:00AM",
		coords: null,
		eventID: 2,
		filterURI: "../event3.png",
		message: "Time to get your swole on ...",
		isActive: true,							//  REMEMBER TO REMOVE
		isInRange: false
	},
	{
		eventTitle: "Kappa Sigma Winter Formal",
		startDate: "12/1/16",
		startTime: "12:00AM",
		endDate: "12/2/16",
		endTime: "2:00AM",
		coords: null,
		eventID: 2,
		filterURI: "../weho_halloween.png",
		message: "Celebrating Turkey Day With the Parks",
		isActive: false,							//  REMEMBER TO REMOVE
		isInRange: false
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

			this.setState({
				dataSource: ds.cloneWithRows( newProps.events )
			})
		}
	}

	render(){

		//style={{height: 25, borderBottomWidth: 1, borderColor: 'black'
		//	    <View style={{position: 'absolute', top: 30, left: 10, right: 10, bottom:50, paddingLeft:10, paddingRight:10,borderWidth: 1, borderRadius: 3, borderColor:'black'}}>
        //<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 20,color:'#0c12ce'}}>Lenses</Text>

		return (
		<View style={styles.container}>
			<View style={styles.fakeNavBar}>
				<View style={{marginLeft: 10}}>
					<Icon name="menu" size={30} color="white" />
				</View>
				<Text style={{fontFamily: 'RobotoCondensed-Regular',marginLeft: 10, marginBottom: 2,fontSize: 24,  textAlign: 'center', color: 'white'}}>Fencer</Text>
			</View>
			<View style={styles.titleContainer}>
            	<View style={{width: 30, marginLeft: 15}}>
              		<Icon name="home" size={30} color="#0c12ce" />
            	</View>
            	<View style={styles.searchBox}>
              		<Text style={{textAlign: 'center',fontFamily: 'RobotoCondensed-Regular',fontWeight:'bold', fontSize: 24,color:'#0c12ce'}}>My GeoLenses</Text>
              		
            	</View>
            	<View style={{width: 30, marginRight: 15}}>
              		<Icon name="info" size={30} color="#0c12ce" />
            	</View>
          	</View>
          	  <View style={styles.eventListContainer}>
            	<ListView

              		dataSource={this.state.dataSource}
              		renderRow={(rowData) => {										// REMEMBER TO REMOVE
                	return (
                		<View key={rowData.id} >									
                  			<SingleEvent { ...rowData } isActive={rowData.isActive} isInRange={rowData.isInRange}/>
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
    alignItems: 'center',
    borderBottomColor: 'white',
  	borderBottomWidth: 2
  },
  eventListContainer: {
  	position: 'absolute',
    top: 100,
    left: 5,
    right: 5,
    bottom: 50,
    paddingTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f2',
    //borderColor: 'black',
    //borderWidth: 1
  },
  fakeNavBar:{
  	height: 50,
  	width: screenWidth,
  	backgroundColor: 'blue',
  	flexDirection: 'row',
  	justifyContent: 'flex-start',
  	alignItems: 'center',
  	//borderBottomColor: 'white',
  	//borderBottomWidth: 1,
  	elevation: 4
  },
  searchBox: {
    height: 45,
    width: screenWidth - 120,
    //padding: 6,
  //  borderColor: 'black',
  //  borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

