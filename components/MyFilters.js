import React, { Component } from 'react';

import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ListView,
    TouchableHighlight,
} from 'react-native';

import SingleEvent from './SingleEvent'

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

export default class MyFilters extends Component {
	constructor(props){
		super(props);

		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.state = {
			dataSource: ds.cloneWithRows([])
		}
	}

	componentDidMount(){
		console.log('this.props.events in componentDidMount: ', this.props.events);
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

		this.setState({
			dataSource: ds.cloneWithRows( this.props.events )
		})
	}

	componentWillReceiveProps(newProps, oldProps){
		console.log('newProps.events in componentWillReceiveProps: ', newProps.events)

		if(newProps.events !== oldProps.events){

			const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

			console.log(' newProps ... ')
			this.setState({
				dataSource: ds.cloneWithRows( newProps.events )
			})
		}
	}

	render(){

		//style={{height: 25, borderBottomWidth: 1, borderColor: 'black'

		return (

	    <View style={{position: 'absolute', top: 30, left: 10, right: 10, bottom:50, paddingLeft:10, paddingRight:10,borderWidth: 1, borderRadius: 3, borderColor:'black'}}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) => {
                return (
                	<View key={rowData.id} >
                  		<SingleEvent eventTitle={rowData.eventTitle} dates={rowData.dates} coords={rowData.coords} id={rowData.id} />
                	</View>
                )
               }
              }/>
        </View>
        )
    }


}