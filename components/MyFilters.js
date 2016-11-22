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

import { connect } from 'react-redux';
import * as filterActions from '../actions/filterActions';

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

class MyFiltersComponent extends Component {
	constructor(props){
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			//events: sampleEvents,
			dataSource: ds.cloneWithRows( [] )
		}
	}

	componentDidMount(){
		console.log('mounting MyFilters...');
		this.props.getMyFilters();

		// const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		// this.setState({
		// 	dataSource: ds.cloneWithRows( this.props.myFilters )
		// })

	}

	componentWillReceiveProps(newProps, oldProps){
	//	console.log('newProps.myFilters in componentWillReceiveProps: ', newProps.myFilters)
		if(newProps.myFilters !== oldProps.myFilters){		// THIS COMPARISON PROBABLY DOESN'T WORK
			// console.log('=====================================')
			
			//console.log('is Array newProps.myFilters: ', Array.isArray(newProps.myFilters) );

			let arr = Object.keys(newProps.myFilters).map((k) => newProps.myFilters[k])

			let sortedFilters = arr.sort((f1,f2)=>{
				return f1.dates.startYear - f2.dates.startYear;
			}).sort((f1,f2)=>{
				return f1.dates.startMonth - f2.dates.startMonth;
			}).sort((f1,f2)=>{
				return f1.dates.startDay - f2.dates.startDay;
			}).sort((f1,f2)=>{
				return f1.dates.startHour - f2.dates.startHour;
			})

			const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({
				dataSource: ds.cloneWithRows( sortedFilters )
			})
		}
	}

	render(){
		//	style={{height: 25, borderBottomWidth: 1, borderColor: 'black'
		//	    <View style={{position: 'absolute', top: 30, left: 10, right: 10, bottom:50, paddingLeft:10, paddingRight:10,borderWidth: 1, borderRadius: 3, borderColor:'black'}}>
        //	<Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 20,color:'#0c12ce'}}>Lenses</Text>
		//	<Text style={{fontFamily: 'RobotoCondensed-Regular',marginLeft: 10, marginBottom: 2,fontSize: 24,  textAlign: 'center', color: 'white'}}>Fencer</Text>

				// 	<View style={{marginLeft: 10}}>
				// 	<Icon name="menu" size={30} color="white" />
				// </View>	
		return (
		<View style={styles.container}>
			<View style={styles.fakeNavBar}>
				<Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
					<Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} />	
				</Image>
			</View>
			<View style={styles.titleContainer}>
            	<View style={{width: 30, marginLeft: 15}}>
              		<Icon name="home" size={30} color="#0c12ce"/>
            	</View>
            	<View style={styles.searchBox}>
              		<Text style={{textAlign: 'center',fontFamily: 'RobotoCondensed-Regular',fontWeight:'bold', fontSize: 24,color:'#0c12ce'}}>My Filters</Text>	
            	</View>
            	<View style={{width: 30, marginRight: 15}}>
              		<Icon name="info" size={30} color="#0c12ce"/>
            	</View>
          	</View>
          	  <View style={styles.eventListContainer}>
            	<ListView
              		dataSource={this.state.dataSource}
              		renderRow={(rowData) => {

              			console.log('-------------------------');
              			if(rowData.coordinates && rowData.title !== "dbdb") {

							const poly = rowData.coordinates.map((point)=>{
	              				return {
	              					lat: point.latitude,
	              					lng: point.longitude
	              				}
              				})

              				poly.push(poly[0]);


              			console.log('-------------------------');
						//console.log('rowData ', rowData.dates)	

						let _isActive = _checkDates(rowData.dates);							

						//  Do date/geo validation here?

              		// <SingleEvent { ...rowData } isActive={rowData.isActive} isInRange={rowData.isInRange}/>

	                	return (
	                		<View key={rowData.id} >									
	                  			<SingleEvent { ...rowData } isActive={ _isActive } polyCoordsForGeo={poly}/>
	                		</View>
	                	)
	                  
               		} else {
               			return null;
               		}
               	}
              		}/>
              </View>
        </View>
        )
    }
}

const _checkDates = (dates) => {
	const { endMinute, endHour, startMinute, startHour, endYear, endDay, endMonth, startYear, startDay, startMonth } = dates;
	console.log(endMinute, endHour, startMinute, startHour, endYear, endDay, endMonth, startYear, startDay, startMonth);
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();
	const currentDay = currentDate.getDate();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();

	if(currentYear < startYear || currentYear > endYear){
		console.log('bad year');
		return false;
	} else if (currentMonth < startMonth || currentMonth < endMonth){
		console.log('bad month');
		return false;
	} else if (currentDay < startDay || currentDay > endDay) {
		console.log('bad day');
		return false;
	} else if (currentHour < startHour || currentHour > endHour) {
		console.log('bad hour');
		return false;
	} /* else if (currentMinute < startMinute || currentMinute > endMinute) {
		console.log('bad minute');
		return false;						//  SKIPPING MINUTE CHECK FOR DEV PURPOSES
	} */ else {
		return true;
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
  },
  fakeNavBar:{
  	height: 50,
  	width: screenWidth,
  	backgroundColor: 'blue',
  	flexDirection: 'row',
  	justifyContent: 'flex-start',
  	alignItems: 'center',
  	elevation: 4
  },
  searchBox: {
    height: 45,
    width: screenWidth - 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => {
  return {
    currentPosition: state.filterReducer.currentPosition,
    myFilters: state.filterReducer.myFilters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMyFilters: () => {
    	filterActions.loadMyFilters(dispatch, {username: 'tom'});
    }
  }
}

const MyFilters = connect(mapStateToProps, mapDispatchToProps)(MyFiltersComponent);
export default MyFilters;
