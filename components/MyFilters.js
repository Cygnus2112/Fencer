import React, { Component } from 'react';

const queryString = require('query-string');
let utils = require('../utils');
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TouchableHighlight,
    Modal,
    TextInput,
    Alert,
    ScrollView,
    AsyncStorage,
    ToastAndroid,
    AppState
} from 'react-native';

import Spinner from './Spinner';

import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import * as filterActions from '../actions/filterActions';
import * as authActions from '../actions/authActions';

import SingleEvent from './SingleEvent';
import InfoModal from './MyFiltersInfoModal';

const { width, height } = Dimensions.get('window');
let screenWidth = width;
let screenHeight= height;

import Icon from 'react-native-vector-icons/Entypo';

import Button from 'react-native-button';

class MyFiltersComponent extends Component {
	constructor(props){
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.handleSearch = this.handleSearch.bind(this);
    this.reloadFilters = this.reloadFilters.bind(this);
    this.checkIfDeleted = this.checkIfDeleted.bind(this);
    this.refreshLocation = this.refreshLocation.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);

    this.checkInterval = null;

		this.state = {
      currentPosition: this.props.currentPosition,
			dataSource: ds.cloneWithRows( [] ),
      searchPressed: false,
      searchError: false,
      infoPressed: false,
      //currentAppState: AppState.currentState
		}
	}

  _handleAppStateChange(currentAppState) {
    if(currentAppState === 'active'){
      this.props.watchPosition();
    } else {
      this.props.clearWatch();
    }
  }

  checkIfDeleted(filterID){
      AsyncStorage.getItem("fencer-token").then((value) => {
        if(value){
          AsyncStorage.getItem("fencer-username").then((username) => {
            let token = value;

            return fetch(utils.checkIfDeletedURL +"?username="+username+"&filterid="+filterID, {    
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
              }
            })
            .then(response => {
              return response.json();
            })
            .then(response => {
              if(response['result'] === 'false'){
                this.reloadFilters(filterID, true);
              };       
            })
            .catch(err => {
              console.log('Error in checkIfDeleted:', err);
            });
          }).done();
        } else {
          console.log('token not found');
        }
      }).done();

  }

  reloadFilters(filter, remove) {
    let allFilters = this.props.myFilters.slice();

    if(filter){
      if(remove){
        if(allFilters.indexOf(filter) !== -1){
          let idx = allFilters.indexOf(filter);
          let newArr = allFilters.slice(0, idx).concat(allFilters.slice(idx + 1));
          allFilters = newArr;
        }
      } else if(allFilters.indexOf(filter) === -1){
        allFilters.push(filter);
      }
    } 
    this.props.getMyFilters({username: this.props.username, filters: allFilters || [] });
  }

  handleSearch(){
      this.setState({ searchPressed:!this.state.searchPressed })
  }

  refreshLocation(toast){
    navigator.geolocation.getCurrentPosition((pos) => {
        if(toast){
          ToastAndroid.showWithGravity('Refreshing geolocation ...', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        var initialPosition =  { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.setState({currentPosition: initialPosition});
        this.props.updatePosition(initialPosition);
    },
    (error) => {
        setTimeout(() => {
          Alert.alert('Unable to Determine Location', "Location services must be enabled on your device for Fencer's geofencing features to work. Please ensure that you have a working internet connection and that location services are enabled, then tap the compass icon to refresh.", [{text: 'OK', onPress: () => {
             // console.log('OK Pressed!');
          }}])
        },200);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 0}
    );
  }

	componentDidMount(){
    this.refreshLocation();
    this.props.watchPosition();

    AppState.addEventListener('change', this._handleAppStateChange);

    this.checkInterval = setInterval(()=>{
        let arr = this.props.allFilters.filter((f) => {
          if(f.startUTC){
            return _isActiveOrUpcoming(f.startUTC, f.endUTC);          // we only show filters that are active or upcoming
          }
        })
        arr.forEach((filter) => {
          this.checkIfDeleted(filter.filterID)
        })
    },120000);

		this.props.getMyFilters({username: this.props.username, filters: this.props.myFilters || [] });

		if(this.props.allFilters.length){
      let arr = this.props.allFilters.filter((f) => {
        if(f.startUTC){
          return _isActiveOrUpcoming(f.startUTC, f.endUTC);  // we only show filters that are active or upcoming
        }        
      })

      let sortedFilters = arr.sort((f1,f2)=> {
        let startTime1 = f1.startUTC;
        let startTime2 = f2.startUTC;

        if(startTime1 === startTime2){

          let endTime1 = f1.endUTC;
          let endTime2 = f2.endUTC;

          return endTime1 - endTime2;
        } else {  
          return startTime1 - startTime2;
        }

      })

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows( sortedFilters )
      })
    }
	}

  componentWillUnmount(){
    this.props.clearTimer();
    this.props.clearWatch();
    clearInterval(this.checkInterval);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

	componentWillReceiveProps(newProps){
    if(newProps.searchError){
        this.setState({searchError: true});
    }
    if(!newProps.searchError){
        this.setState({searchError: false});
    }

		if(newProps.allFilters.length !== this.props.allFilters.length){	
			let arr = newProps.allFilters.filter((f) => {
        if(f.startUTC){
          return _isActiveOrUpcoming(f.startUTC, f.endUTC);         // we only show filters that are active or upcoming  
        }
			})

      let sortedFilters = arr.sort((f1,f2)=>{
        let startTime1 = f1.startUTC;
        let startTime2 = f2.startUTC;

        if(startTime1 === startTime2){
          let endTime1 = f1.endUTC;
          let endTime2 = f2.endUTC;

          return endTime1 - endTime2;
        } else {  
          return startTime1 - startTime2;
        }

      })

			const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			this.setState({
				dataSource: ds.cloneWithRows( sortedFilters )
			})
		}
	}

	render(){
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
                  <TouchableOpacity onPress={()=>{ Actions.loading( {isStartup: false} ) }}>
                  	<View style={{width: 30, marginLeft: 15}}>
                    		<Icon name="home" size={30} color="#0c12ce"/>
                  	</View>
                  </TouchableOpacity>
                	<View style={styles.searchBox}>
                  		<Text style={{textAlign: 'center',fontFamily: 'RobotoCondensed-Regular',fontWeight:'bold', fontSize: 24,color:'#0c12ce'}}>My Geofilters</Text>	
                	</View>
                	<View style={{width: 30, marginRight: 15}}>
                    <TouchableOpacity onPress={() => {this.setState({infoPressed: true})}} >
                  		<Icon name="info" size={30} color="#0c12ce"/>
                	 </TouchableOpacity>
                  </View>
            	</View>
          	  <View style={styles.eventListContainer}>
                {this.props.isLoadingAllFilters
                  ?
                  (<Spinner /> )
                  :
                  (<ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => {
                   //   console.log('-------------------------');

                      if(rowData.coordinates && rowData.startUTC) {
                        const poly = rowData.coordinates.map((point)=>{
                          return {
                            lat: point.latitude,
                            lng: point.longitude
                          }
                        })

                        poly.push(poly[0]);

                        let _isActive = _checkDates(rowData.startUTC, rowData.endUTC);  

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
                }/>)
                }
              </View>

                <View style={styles.refreshGeo}>
                  <TouchableOpacity 
                    onPress={()=>{ this.refreshLocation(true); }
                  }>      
                    <Icon name="compass" size={30} color="#0c12ce"/>       
                  </TouchableOpacity>
                </View>
              <View style={styles.addById}>
                <TouchableOpacity onPress={this.handleSearch}>
                  <Text style={{fontSize: 16,fontFamily: 'RobotoCondensed-Regular', textAlign: 'center'}} >Geofilter not showing up?</Text>
                  <Text style={{fontSize: 16,fontFamily: 'RobotoCondensed-Regular', textAlign: 'center', textDecorationLine: 'underline'}} >Tap here to add by ID</Text>
                </TouchableOpacity>
              </View>
      {this.state.infoPressed
        ?
      (<InfoModal modalVisible={true} toggleModal={() => { this.setState({ infoPressed: false}) }} />)
        :
      (null)
      }    
        </View>)
     }   
}
const _checkDates = (startTime, endTime) => {
	let currentTime = Date.now();
	if(currentTime < startTime || currentTime > endTime){
		return false;
	} else {
		return true;
	}
}

const _isActiveOrUpcoming = (startTime, endTime) => {
	let currentTime = Date.now();
    if(currentTime > endTime){
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
          modalVisible: props.modalVisible,
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
        this.props.clearSearchError();
      }}])
    } 

    if(nextProps.newFilterAdded && nextProps.newFilterAdded !== this.props.newFilterAdded){
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
        console.log('OK Pressed!');
      }}])
    } else {
      this.props.addFilter({filter: this.state.filter, isSearch: true});      
    }
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


class LoadingModal extends Component {
  constructor(props){
    super(props);
    
    this.state = {
          modalVisible: props.modalVisible
      }
  }

  render(){
    return(
        <Modal
          animationType={"none"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { 
          }}>
            <View collapsable={false} style={styles.modalContainer}>
                <ActivityIndicator style={{alignItems: 'center',justifyContent: 'center',padding: 8}} size={75} color="white" />
          </View>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
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
  },
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
  refreshGeo:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f2',
    paddingLeft: 15,
    // borderWidth: 1,
    // borderColor: 'black'
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
    newFilterAdded: state.filterReducer.newFilterAdded,
    searchError: state.filterReducer.searchError,
    searchErrorCode: state.filterReducer.searchErrorCode,
    searchErrorMessage: state.filterReducer.searchErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMyFilters: (data) => {
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
    },
    clearTimer: () => {
      authActions.clearTimer(dispatch);
    },
    watchPosition: () => {
      filterActions.watchPosition(dispatch);
    },
    clearWatch: () => {
      filterActions.clearWatch(dispatch);
    }
  }
}

const MyFilters = connect(mapStateToProps, mapDispatchToProps)(MyFiltersComponent);
export default MyFilters;
