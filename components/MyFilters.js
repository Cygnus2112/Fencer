import React, { Component } from 'react';

const queryString = require('query-string');

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TouchableHighlight,
    Linking,
    Modal
} from 'react-native';

import Spinner from './Spinner';

import { Actions } from 'react-native-router-flux';

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
      // isLoadingFilter: false,
			dataSource: ds.cloneWithRows( [] )
		}
	}

	componentDidMount(){
		//console.log('this.props in MyFilters: ', this.props);

		this.props.getMyFilters({username: this.props.username, filters: this.props.myFilters || [] });

		if(this.props.allFilters.length){
      let arr = this.props.allFilters.filter((f) => {
        return _isActiveOrUpcoming(f.dates);          // we only show filters that are active or upcoming
      })

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

    componentWillUnmount(){
      console.log('MyFilters un-mounting ... ');
    }

	componentWillReceiveProps(newProps){
  //  console.log('newProps.allFilters: ', newProps.allFilters);
  //  console.log('newProps.filtersCreated: ', newProps.filtersCreated);
  //  console.log('newProps.myFilters: ', newProps.myFilters);
      console.log('-------------------------');


	//	console.log('newProps.myFilters in componentWillReceiveProps: ', newProps.myFilters)
		if(newProps.allFilters.length !== this.props.allFilters.length){		// THIS COMPARISON PROBABLY DOESN'T WORK
			// console.log('=====================================')
			
			//console.log('is Array newProps.myFilters: ', Array.isArray(newProps.allFilters) );

		//	let arr = newProps.allFilters;

			let arr = newProps.allFilters.filter((f) => {
				return _isActiveOrUpcoming(f.dates);					// we only show filters that are active or upcoming
			})

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
  //  return(
      // <View style={styles.container}>
      //   <View style={styles.fakeNavBar}>
      //     <Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
      //       <Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} /> 
      //     </Image>
      //     {this.props.isLoadingAllFilters
      //       ?
      //       (<View style={styles.eventListContainerContainer}><Spinner /></View>)
      //       :
      //       (<View style={styles.eventListContainerContainer}>
      //         <View style={styles.titleContainer}>
      //           <TouchableOpacity onPress={()=>{Actions.loading()}}>
      //             <View style={{width: 30, marginLeft: 15}}>
      //                 <Icon name="home" size={30} color="#0c12ce"/>
      //             </View>
      //           </TouchableOpacity>
      //           <View style={styles.searchBox}>
      //               <Text style={{textAlign: 'center',fontFamily: 'RobotoCondensed-Regular',fontWeight:'bold', fontSize: 24,color:'#0c12ce'}}>My Filters</Text> 
      //           </View>
      //           <View style={{width: 30, marginRight: 15}}>
      //               <Icon name="info" size={30} color="#0c12ce"/>
      //           </View>
      //       </View>
      //         <View style={styles.eventListContainer}>
      //             <ListView
      //                 dataSource={this.state.dataSource}
      //                 renderRow={(rowData) => {
      //                   console.log('-------------------------');
      //                   if(rowData.coordinates) {
      //                     const poly = rowData.coordinates.map((point)=>{
      //                       return {
      //                         lat: point.latitude,
      //                         lng: point.longitude
      //                       }
      //                     })

      //                     poly.push(poly[0]);
      //                   console.log('-------------------------');

      //                   let _isActive = _checkDates(rowData.dates);             

      //                   return (
      //                     <View key={rowData.id} >                  
      //                         <SingleEvent { ...rowData } isActive={ _isActive } polyCoordsForGeo={poly}/>
      //                     </View>
      //                   )
                        
      //                 } else {
      //                   return null;
      //                 }
      //               }
      //                 }/>
      //         </View>
      //         </View>)
      //     }
      //   </View>
      // </View>
      // )

        if(this.props.isLoadingAllFilters){
		      return (
            <View style={styles.container}>
              <View style={styles.fakeNavBar}>
                <Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
                  <Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} /> 
                </Image>
              </View>
              <Spinner />
            </View>)
        } else if(this.state.isLoadingFilter){
          return (
            <View style={styles.container}>
              <Text>Loading da filter...</Text>
            </View>
            )

        } else {

      return(<View style={styles.container}>
			<View style={styles.fakeNavBar}>
				<Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
					<Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} />	
				</Image>
			</View>
			<View style={styles.titleContainer}>
            <TouchableOpacity onPress={()=>{Actions.loading()}}>
            	<View style={{width: 30, marginLeft: 15}}>
              		<Icon name="home" size={30} color="#0c12ce"/>
            	</View>
            </TouchableOpacity>
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

                      console.log('rowData: ', rowData);
                			console.log('-------------------------');

                			if(rowData.coordinates) {

  							        const poly = rowData.coordinates.map((point)=>{
  	              				return {
  	              					lat: point.latitude,
  	              					lng: point.longitude
  	              				}
                				})

                				poly.push(poly[0]);

                			  console.log('-------------------------');

  						          let _isActive = _checkDates(rowData.dates);	

                        let userCreated = false;

                        if(this.props.filtersCreated.indexOf(rowData.filterID) >= 0 ){
                          userCreated = true;
                        }						

    	                	return (
    	                		<View key={rowData.id} >									
    	                  			<SingleEvent { ...rowData } 
                                isActive={ _isActive } 
                                polyCoordsForGeo={ poly }
                                userCreated={userCreated} />
    	                		</View>
    	                	)
  	                  
                 		} else {
                 			return null;
                 		}
                 	}
              }/>
              <View style={styles.addById}>
                <Text style={{fontSize: 14,fontFamily: 'RobotoCondensed-Regular'}} >Geofilter not showing up?</Text>
                <Text style={{fontSize: 14,fontFamily: 'RobotoCondensed-Regular'}} >Tap here to add by ID</Text>
              </View>
            </View>
        </View>)
     }
        
    }
}

//toggleLoading={ () => {this.setState({isLoadingFilter: !this.state.isLoadingFilter})} }

const _checkDates = (dates) => {
	//IS THERE A REASON WHY I DIDN'T JUST COMPARE DATE.NOW()???

	const { startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute } = dates;
	
	console.log(startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute);

	let startTime = new Date(startYear, startMonth, startDay, startHour, startMinute).getTime();
	let endTime = new Date(endYear, endMonth, endDay, endHour, endMinute).getTime();
	let currentTime = Date.now();


	if(currentTime < startTime || currentTime > endTime){
		return false;
	} else {
		return true;
	}

}

const _isActiveOrUpcoming = (dates) => {
	const { startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute } = dates;
	//console.log("event dates: ");
	//console.log(startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute);

	let endTime = new Date(endYear, endMonth, endDay, endHour, endMinute).getTime();
	let currentTime = Date.now();

    if(currentTime > endTime){
    	console.log('_isActiveOrUpcoming: event has ended');
		return false;
    } else {
    	return true;
    }
}

// class SearchModal extends Component {
//   constructor(props){
//     super(props);
    
//     this.state = {
//           modalVisible: this.props.modalVisible
//       }
//   }

//   componentDidMount(){
//     console.log('this.props in search modal: ', this.props);
//   }

//   render(){
//     return(
//         <Modal
//           animationType={"none"}
//           transparent={true}
//           visible={this.state.modalVisible}
//           onRequestClose={() => { 
//                         this.props.toggleModal();
//             console.log("Modal has been closed.")}}>

//             <View style={styles.modalContainer}>
//                 <View style={this.props.message.length ? styles.infoModal : [styles.infoModal, {top: 120, bottom: 120}]}  >

//                   <View style={{position: 'absolute', top: 15, left: 10, right: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
//             <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 20, margin: 5 }}>Geofilter Details:</Text>
//                 </View>

//                   <View style={styles.details}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                     <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>Title:</Text>
//                     <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5, fontWeight: 'bold' }}>{this.props.title}</Text>
//                   </View>
//                   {!this.props.isActive &&
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                     <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>Starts:</Text> 
//                     <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>{_formatDate(this.props.dates.startMonth,this.props.dates.startDay,this.props.dates.startYear)} at {_formatTime(this.props.dates.startHour, this.props.dates.startMinute)}</Text>
//               </View>
//             }    
//             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>       
//               <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>Ends:</Text> 
//               <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 18, margin: 5 }}>{_formatDate(this.props.dates.endMonth,this.props.dates.endDay,this.props.dates.endYear)} at {_formatTime(this.props.dates.endHour, this.props.dates.endMinute)}</Text>
//             </View>

//                   </View>

//                   <View style={{position: 'absolute', bottom: 15, left: 10, right: 10, flexDirection: 'row', justifyContent: 'center'}}> 
//                     <TouchableHighlight 
//                         style={{height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
//                         onPress={() => {
//                           this.props.toggleModal();
//                           this.setState({modalVisible: !this.state.modalVisible})
//                         }
//                       }>
//                           <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
//                     </TouchableHighlight>
//                   </View>

//               </View>
//           </View>
//       </Modal>
//     )
//   }
// }



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
    bottom: 0,
    paddingTop: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f2',
    borderWidth: 1,
    borderColor: 'black'
  },
  addById: {
    position: 'absolute',
    bottom: 0,
    left: 60,
    right: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f2',
    borderWidth: 1,
    borderColor: 'black'
  },
  eventListContainerContainer: {
    height: screenHeight - 50,
    width: screenWidth
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
    allFilters: state.filterReducer.allFilters,
    myFilters: state.authReducer.myFilters,
    filtersCreated: state.authReducer.filtersCreated,
    username: state.authReducer.username,
    isLoadingAllFilters: state.filterReducer.isLoadingAllFilters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMyFilters: (data) => {
    //	console.log('data in MyFilters dispatch: ', data);
    	filterActions.loadAllFilters(dispatch, {username: data.username, filters: data.filters});
    }
  }
}

const MyFilters = connect(mapStateToProps, mapDispatchToProps)(MyFiltersComponent);
export default MyFilters;
