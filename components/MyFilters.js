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
    Modal,
    TextInput,
    Alert,
    BackAndroid
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

import Button from 'react-native-button';

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

    this.handleSearch = this.handleSearch.bind(this);
    this.reloadFilters = this.reloadFilters.bind(this);
    this.watchPosition = null;

		this.state = {
			//events: sampleEvents,
      // isLoadingFilter: false,
      currentPosition: this.props.currentPosition,
			dataSource: ds.cloneWithRows( [] ),
      searchPressed: false,
      searchError: false
		}
	}

  reloadFilters(filter) {
  //  console.log('reloadFilters called in MyFilters');
    let allFilters = this.props.myFilters.slice();

    if(filter){
      if(allFilters.indexOf(filter) === -1){
        console.log('new filter '+filter+' is not YET in this.props.myFilters ');
        allFilters.push(filter);
      }
    } 

    this.props.getMyFilters({username: this.props.username, filters: allFilters || [] });
  }

    handleSearch(){
      this.setState({ searchPressed:!this.state.searchPressed })
    }

	componentDidMount(){

   // console.log('MyFilters mounted.');

		this.props.getMyFilters({username: this.props.username, filters: this.props.myFilters || [] });

		if(this.props.allFilters.length){
      let arr = this.props.allFilters.filter((f) => {
        return _isActiveOrUpcoming(f.dates);          // we only show filters that are active or upcoming
      })

      let sortedFilters = arr.sort((f1,f2)=> {

        let startTime1 = new Date(f1.dates.startYear, f1.dates.startMonth, f1.dates.startDay, f1.dates.startHour, f1.dates.startMinute).getTime();
        let startTime2 = new Date(f2.dates.startYear, f2.dates.startMonth, f2.dates.startDay, f2.dates.startHour, f2.dates.startMinute).getTime();

        if(startTime1 === startTime2){
          let endTime1 = new Date(f1.dates.endYear, f1.dates.endMonth, f1.dates.endDay, f1.dates.endHour, f1.dates.endMinute).getTime();
          let endTime2 = new Date(f2.dates.endYear, f2.dates.endMonth, f2.dates.endDay, f2.dates.endHour, f2.dates.endMinute).getTime();

          return endTime1 - endTime2;
        } else {  
          return startTime1 - startTime2;
        }



      })
      // .sort((f1,f2)=>{

      //   let endTime1 = new Date(f1.dates.endYear, f1.dates.endMonth, f1.dates.endDay, f1.dates.endHour, f1.dates.endMinute).getTime();
      //   let endTime2 = new Date(f2.dates.endYear, f2.dates.endMonth, f2.dates.endDay, f2.dates.endHour, f2.dates.endMinute).getTime();


      //   return endTime1 - endTime2;
      // })

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows( sortedFilters )
      })
    }

    navigator.geolocation.getCurrentPosition((pos) => {
     // console.log('pos in navigator call: ', pos);

        var initialPosition =  { lat: pos.coords.latitude, lng: pos.coords.longitude };

        console.log('initialPosition in MyFilters: ', initialPosition);

        this.setState({currentPosition: initialPosition});

        this.props.updatePosition(initialPosition);
      },
      (error) => console.log("nav error in My Filters: ", JSON.stringify(error) ),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchPosition = navigator.geolocation.watchPosition((pos) => {
      var currentPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };

      console.log('position changed in MyFilters. new position: ', currentPosition);

      this.setState({currentPosition});
      this.props.updatePosition(currentPosition);
    });

	}

  componentWillUnmount(){
   // console.log('MyFilters un-mounting ... ');

    navigator.geolocation.clearWatch(this.watchPosition);
  }

	componentWillReceiveProps(newProps){
    //  console.log('newProps in MyFilters!!!');


      if(newProps.searchError){
        this.setState({searchError: true});
      }
      if(!newProps.searchError){
        this.setState({searchError: false});
      }
      console.log('-------------------------');

		if(newProps.allFilters.length !== this.props.allFilters.length){		// THIS COMPARISON PROBABLY DOESN'T WORK


			let arr = newProps.allFilters.filter((f) => {
				return _isActiveOrUpcoming(f.dates);					// we only show filters that are active or upcoming
			})

      let sortedFilters = arr.sort((f1,f2)=>{

        let startTime1 = new Date(f1.dates.startYear, f1.dates.startMonth, f1.dates.startDay, f1.dates.startHour, f1.dates.startMinute).getTime();
        let startTime2 = new Date(f2.dates.startYear, f2.dates.startMonth, f2.dates.startDay, f2.dates.startHour, f2.dates.startMinute).getTime();

        if(startTime1 === startTime2){
          let endTime1 = new Date(f1.dates.endYear, f1.dates.endMonth, f1.dates.endDay, f1.dates.endHour, f1.dates.endMinute).getTime();
          let endTime2 = new Date(f2.dates.endYear, f2.dates.endMonth, f2.dates.endDay, f2.dates.endHour, f2.dates.endMinute).getTime();

          return endTime1 - endTime2;
        } else {  
          return startTime1 - startTime2;
        }

      })
      // .sort((f1,f2)=>{

        // let endTime1 = new Date(f1.dates.endYear, f1.dates.endMonth, f1.dates.endDay, f1.dates.endHour, f1.dates.endMinute).getTime();
        // let endTime2 = new Date(f2.dates.endYear, f2.dates.endMonth, f2.dates.endDay, f2.dates.endHour, f2.dates.endMinute).getTime();


      //   return endTime1 - endTime2;
      // })

			const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({
				dataSource: ds.cloneWithRows( sortedFilters )
			})

		}
	}

	render(){

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

      return(
        <View style={styles.container}>
            {this.state.searchPressed
                  &&
                (<SearchModal 
                    modalVisible={true} 
                    toggleModal={() => { this.handleSearch() }} 
                    reloadFilters={this.reloadFilters}
                    {...this.props} />)
              }
      			<View style={styles.fakeNavBar}>
      				<Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
      					<Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} />	
      				</Image>
      			</View>
			      <View style={styles.titleContainer}>
                <TouchableOpacity onPress={()=>{Actions.loading({isStartup: false})}}>
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

                   //   console.log('rowData: ', rowData);
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


            </View>
              <View style={styles.addById}>
                <TouchableOpacity onPress={this.handleSearch}>
                  <Text style={{fontSize: 16,fontFamily: 'RobotoCondensed-Regular', textAlign: 'center'}} >Geofilter not showing up?</Text>
                  <Text style={{fontSize: 16,fontFamily: 'RobotoCondensed-Regular', textAlign: 'center', textDecorationLine: 'underline'}} >Tap here to add by ID</Text>
                </TouchableOpacity>
              </View>
        </View>)
     }
        
    }
}

//toggleLoading={ () => {this.setState({isLoadingFilter: !this.state.isLoadingFilter})} }

const _checkDates = (dates) => {
	//IS THERE A REASON WHY I DIDN'T JUST COMPARE DATE.NOW()???

	const { startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute } = dates;
	
//	console.log(startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute);

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
//	console.log(endYear, endMonth, endDay, endHour, endMinute);

	let endTime = new Date(endYear, endMonth, endDay, endHour, endMinute).getTime();
	let currentTime = Date.now();

  // let currentTime2 = new Date(currentTime);
  // console.log(currentTime2.toLocaleTimeString())
  // console.log(currentTime2.getFullYear(), currentTime2.getMonth(), currentTime2.getDate(), currentTime2.getHours(), currentTime2.getMinutes());
  // console.log('currentTime minus endTime: ', currentTime - endTime);

    if(currentTime > endTime){
   // 	console.log('_isActiveOrUpcoming: event has ended');
		  return false;
    } else {
    	return true;
    }
}


class SearchModal extends Component {
  constructor(props){
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    
    this.state = {
          modalVisible: this.props.modalVisible,
          filter: ''
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.searchError){

      let errorCode;

      if(nextProps.searchErrorCode === 'NOTFOUND') {
        errorCode = 'Geofilter Not Found';
      } else if(nextProps.searchErrorCode === 'ALREADYADDED'){
        errorCode = 'Geofilter Already Added';
      } else {
        errorCode = 'Geofilter Expired';
      }

      Alert.alert(errorCode, nextProps.searchErrorMessage, [{text: 'OK', onPress: () => {
            // clear prop

            this.props.clearSearchError();

            console.log('OK Pressed!');
          }
        }])

    } 

    if(nextProps.newFilterAdded && nextProps.newFilterAdded !== this.props.newFilterAdded){

      console.log('nextProps.newFilterAdded: ', nextProps.newFilterAdded);

      Alert.alert('Success!', "A new Geofilter has been added to My Filters.", [{text: 'OK', onPress: () => {
            // clear prop

            this.props.reloadFilters(nextProps.newFilterAdded);
            this.props.clearNewFilter();

            this.props.toggleModal();
            this.setState({modalVisible: !this.state.modalVisible});

            console.log('OK Pressed!');
          }
        }])

    } 
  }

  handleSearch(){
    if(this.state.filter.length !== 9){
      Alert.alert('Error', "Geofilter ID must be 9 characters.", [{text: 'OK', onPress: () => {
            // clear prop

            console.log('OK Pressed!');
          }
        }])

    } else {
      this.props.addFilter({filter: this.state.filter, isSearch: true});      
    }

  }

  componentDidMount(){
  //  console.log('this.props in filter search modal: ', this.props);
  }

  render(){
    return(
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { 
                        this.props.toggleModal();
            console.log("Modal has been closed.")}}>

            <View style={styles.modalContainer}>
              <View style={ styles.searchModal } >

                <View style={{position: 'absolute', top: 15, left: 10, right: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                  <Text style={{fontFamily: 'RobotoCondensed-Regular', fontSize: 20, margin: 5 }}>Enter Geofilter ID:</Text>
                </View>

                  <View style={styles.details}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <TextInput 
                          autoCorrect={false} 
                          style={styles.textInput} 
                          placeholderStyle={styles.placeholder}
                          onChangeText={(filter) => this.setState({filter})}
                          value={this.state.filter}/> 
                    </View>
                  </View>

                  <View style={styles.signinButtonContainer}>
                    <View style={this.state.filter.length === 9 ? styles.signinButtonBox : [styles.signinButtonBox, styles.buttonDisabled]}>
                      <Button
                        style={{fontSize: 18, color: 'black'}}
                        styleDisabled={{color: 'silver'}}
                        disabled={ this.state.filter.length !== 9 }
                        onPress={ this.handleSearch }>
                          Search
                      </Button> 
                    </View>
                  </View>

                  <View style={{position: 'absolute', bottom: 15, left: 10, right: 10, flexDirection: 'row', justifyContent: 'center'}}> 
                    <TouchableHighlight 
                        style={{height: 30, width: 55, backgroundColor: 'blue', borderColor: 'black', borderWidth: 1, borderRadius: 5, paddingTop:3, alignItems: 'center'}}
                        onPress={() => {
                          this.props.toggleModal();
                          this.setState({modalVisible: !this.state.modalVisible})
                        }
                      }>
                          <Text style={{fontFamily: 'RobotoCondensed-Regular', color: 'white'}}>Close</Text>
                    </TouchableHighlight>
                  </View>

              </View>
          </View>
      </Modal>
    )
  }
}



const styles = StyleSheet.create({
  placeholder: {
    fontFamily: 'RobotoCondensed-Regular',
    fontSize: 18
  },
  textInput: {
    fontFamily: 'RobotoCondensed-Regular',
    backgroundColor: 'white', 
    margin: 5, 
    padding: 5,
    width: 200,
    fontSize: 18,
    textAlign: 'center',
  },
  signinButtonContainer: {
    position: 'absolute',
    top: 160,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signinButtonBox: {
    elevation:3,
    padding:10, 
  //  margin: 5,
    height:45, 
    width: 200*.7, 
    overflow:'hidden', 
    borderRadius:4, 
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 1
  },
  buttonDisabled: {
    backgroundColor: 'white',
    borderColor: 'silver',
  },
  textActive: {
    fontSize: 20, 
    color: 'black', 
    textAlign: 'center', 
    fontWeight:'bold',
    fontFamily: 'RobotoCondensed-Regular'
  },
  details: {
    position: 'absolute',
    top: 75,
    left: 10, 
    right: 10,
  },
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
  searchModal: {
    position: 'absolute', 
    top: 60, 
    left:35, 
    right: 35, 
    bottom: 60, 
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    // backgroundColor:'white',
    backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
    padding: 10
  },
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
    left: 0,
    right: 0,
    bottom: 50,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f2',
    borderBottomColor: 'white',
    borderBottomWidth: 2
  },
  addById: {
    position: 'absolute',
    bottom: 0,
    left: 60,
    right: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f2',
    // borderWidth: 1,
    // borderColor: 'black'
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
    isLoadingAllFilters: state.filterReducer.isLoadingAllFilters,
    searchError: state.filterReducer.searchError,
    newFilterAdded: state.filterReducer.newFilterAdded,
    searchErrorCode: state.filterReducer.searchErrorCode,
    searchErrorMessage: state.filterReducer.searchErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMyFilters: (data) => {
    //	console.log('data in MyFilters dispatch: ', data);
    	filterActions.loadAllFilters(dispatch, {username: data.username, filters: data.filters});
    },
    addFilter: (data) => {
      filterActions.addFilterByID(dispatch, data)
    },
    clearSearchError: () => {
      filterActions.clearSearchError(dispatch)
    },
    clearNewFilter: () => {
      filterActions.clearNewFilter(dispatch)
    },
    updatePosition: (data) => {
      filterActions.updatePosition(dispatch, data);
    }
  }
}

const MyFilters = connect(mapStateToProps, mapDispatchToProps)(MyFiltersComponent);
export default MyFilters;
