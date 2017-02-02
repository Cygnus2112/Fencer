import React, { Component } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    Alert,
    TextInput
} from 'react-native';

import Button from 'react-native-button';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
const { width, height } = Dimensions.get('window');
const screenWidth = width;

import * as authActions from '../actions/authActions';

const _validateEmail = (email) => {
  let regExString = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExString.test(email);
}

class ReferralSignup extends Component {
    constructor(props){
        super(props);

        this.toggleSignup = this.toggleSignup.bind(this);

        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);

        this.state = {
          showSignup: false,
          username: "",
          password: "",
          errorMsg: "",
          signupEmail: "Email",
          signupUsername: "",
          signupPassword: "",
          changeTextColorBecauseStupidBug: false
        }

    }

    componentWillReceiveProps(newProps){
        if(newProps.authErrorMsg.length){

            Alert.alert('Oops!', newProps.authErrorMsg, [{text: 'OK', onPress: () => {
                // clear prop
                this.props.clearError();

                console.log('OK Pressed!');
              }
            }])
        }
    }

    toggleSignup(){
        this.setState({
          showSignup: !this.state.showSignup,
          username: "",
          password: "",
          errorMsg: "",
          signupEmail: "",
          signupUsername: "",
          signupPassword: "",
          changeTextColorBecauseStupidBug: false
        })
    }
// <View style={{position: 'absolute', top: 30, left: 30, right: 30, bottom: 30}}>
  
  handleSignIn(){
    if(!this.state.username.length || !this.state.password.length){                
      Alert.alert('Oops!','Please fill out all fields.', [{text: 'OK', onPress: () => {
            console.log('OK Pressed!');
          }
        }])
    } else {
      this.props.submitLogin({
        username: this.state.username,
        password: this.state.password,
        filterID: this.props.filterID
      })
    }
  }

  handleSignUp(){
    if(!this.state.signupUsername.length || !this.state.signupPassword.length || !this.state.signupEmail.length){
      Alert.alert('Oops!','Please fill out all fields.', [{text: 'OK', onPress: () => {
            console.log('OK Pressed!');
          }
        }])
    } else if(this.state.signupUsername.length < 3){
      Alert.alert('Oops!','Username length must be at least three characters.', [{text: 'OK', onPress: () => {
            console.log('OK Pressed!');
          }
        }])
    } else if(this.state.signupPassword.length < 6){
      Alert.alert('Oops!','Password length must be at least six characters.', [{text: 'OK', onPress: () => {
            console.log('OK Pressed!');
          }
        }])
    } else if( !_validateEmail(this.state.signupEmail) ){
      Alert.alert('Oops!','Please enter a properly formatted email address.', [{text: 'OK', onPress: () => {
            console.log('OK Pressed!');
          }
        }])
    } else {
      this.props.submitSignup({ 
        username: this.state.signupUsername,
        password: this.state.signupPassword,
        email: this.state.signupEmail,
        filterID: this.props.filterID
      })
    }
  }

    render(){
        return(<View style={styles.modalContainer}>

                    <View style={styles.fakeNavBar}>
                        <Image source={require('../assets/map2.png')} style={{marginLeft: (screenWidth/2)-20,height: 40, width: 40, paddingLeft:5, paddingTop:5}} >
                            <Image source={require('../assets/camera2.png')} style={{height: 30, width: 30}} /> 
                        </Image>
                    </View>


                    <View style={styles.welcome}>
                        <Text style={styles.welcomeText}>
                            Welcome!
                        </Text>
                        <Text style={styles.instructions}>
                            Please sign in to activate your new geofilter.
                        </Text>

                    </View>

            {!this.state.showSignup
                ?
              (<View style={styles.modalInterior}>

                    <View style={!this.props.alert ? styles.username : [styles.username,{top: 70}]}>
                      <TextInput placeholder="Username" style={styles.textInput} 
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username} />
                    </View>

                    <View style={!this.props.alert ? styles.password : [styles.password,{top: 130}]}>
                      <TextInput placeholder="Password" 
                        style={styles.textInput} 
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password} />
                    </View>

                  <View style={!this.props.alert ? styles.signinButtonContainer : [styles.signinButtonContainer,{top: 200}]}>
                    <View style={styles.signinButtonBox}>
                      <Button
                        style={{fontSize: 18, color: 'black'}}
                        styleDisabled={{color: 'red'}}
                        onPress={ this.handleSignIn }>
                          Sign In
                      </Button> 
                    </View>
                  </View>

                  <View style={!this.props.alert ? styles.signupContainer : [styles.signupContainer, {top: 270}]}> 
                    <View style={ styles.signup }> 
                      <TouchableOpacity onPress={ () => { this.toggleSignup() } } style={styles.button} >
                          <View style={ styles.header }>
                            <Text style={styles.instructions} >
                              { "Don't" } have an account?
                            </Text>
                            <Text style={styles.iambold} >
                              Sign up!
                            </Text>
                          </View>
                      </TouchableOpacity >
                    </View>
                  </View>

                </View>)

                  :
              (<View style={styles.modalInterior}>
                  <View style={ styles.username }>
                  {this.state.changeTextColorBecauseStupidBug
                    ?
                    (<TextInput placeholder="Email" style={styles.textInput} 
                      autoCorrect={false}
                      onChangeText={(signupEmail) => this.setState({signupEmail})}
                      value={this.state.signupEmail} />)
                    :
                    (<TextInput placeholder="Email" style={[styles.textInput,{color: 'silver'}]} 
                      onFocus={() => {
                        this.setState({
                            signupEmail: '',
                            changeTextColorBecauseStupidBug: true
                        })
                      }}
                      autoCorrect={false}
                      onChangeText={(signupEmail) => { 
                        if(!this.state.changeTextColorBecauseStupidBug){
                            this.setState({
                              changeTextColorBecauseStupidBug: true                              
                            })

                        }
                        this.setState({signupEmail});  
                      }}
                      value={this.state.signupEmail} />)
                  }

                  </View>

                  <View style={ styles.password }>
                    <TextInput placeholder="Username" style={styles.textInput} 
                      onChangeText={(signupUsername) => this.setState({signupUsername})}
                      value={this.state.signupUsername} />
                  </View>
                  <View style={ styles.signupPassword }>
                    <TextInput placeholder="Password" 
                      style={styles.textInput} 
                      secureTextEntry={true}
                      onChangeText={(signupPassword) => this.setState({signupPassword})}
                      value={this.state.signupPassword} />
                  </View>
                <View style={[styles.signinButtonContainer, {top: 210}]} >
                  <View style={styles.buttonBox}>
                    <Button
                      style={{fontSize: 18, color: 'black'}}
                      styleDisabled={{color: 'red'}}
                      onPress={ this.handleSignUp }>
                        Sign Up
                    </Button> 
                  </View>
                </View>

                <View style={ [styles.signupContainer, {top: 290}] }> 
                  <View style={ styles.signup }> 
                    <TouchableOpacity onPress={ ()=>{ this.toggleSignup() } } style={styles.button} >
                        <View style={ styles.header }>
                          <Text style={styles.instructions} >
                            Already have an account?
                          </Text>
                          <Text style={styles.iambold} >
                            Sign in
                          </Text>
                        </View>
                    </TouchableOpacity >
                  </View>
                </View>


                </View>)

            }
            </View>)

    }
}

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    top: 5,
    left: 30,
    right: 30,
    elevation:3,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center' 
  },
  username: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    elevation:3,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center', 
    backgroundColor:'white', 
    borderRadius: 4
  },
  password: {
    position: 'absolute',
    top: 90,
    left: 30,
    right: 30,
    elevation:3,
    height: 50, 
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor:'white', 
    borderRadius: 4
  },
  signupPassword: {
    position: 'absolute',
    top: 150,
    left: 30,
    right: 30,
    elevation:3,
    height: 50, 
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor:'white', 
    borderRadius: 4
  },
  dismissButton: {
    height: 30, 
    width: 55, 
    backgroundColor: 'blue', 
    borderColor: 'black', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingTop:3, 
    alignItems: 'center'
  },
  dismiss: {
    position: 'absolute', 
    bottom: 15, 
    left: 10, 
    right: 10, 
    flexDirection: 'row', 
    justifyContent: 'center'
  },
  modalContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'white'
  },
  modalInterior: {
    position: 'absolute', 
    top: 170, 
    left:40, 
    right: 40, 
    bottom: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    // borderWidth:1, 
    // borderColor:'black', 
    borderRadius:10
  },
  welcome: {
    position: 'absolute', 
    top: 60, 
    left:40, 
    right: 40, 
    height: 100,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    // borderWidth:1, 
    // borderColor:'black', 
    borderRadius:10
  },
  container:{
    position: 'absolute', 
    top: 50, 
    left:50, 
    right: 50, 
    bottom: 50,
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    backgroundColor: 'white', 
    margin: 5, 
    padding: 5,
    width: 200,
    fontSize: 18,
    textAlign: 'center',
    color: 'blue'
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
    height:45, 
    width: 200*.7, 
    overflow:'hidden', 
    borderRadius:4, 
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 1
  },
  buttonBox: {
    elevation:3,
    padding:10, 
    margin: 5,
    height:45, 
    width: 200*.7, 
    overflow:'hidden', 
    borderRadius:4, 
    backgroundColor: 'silver',
    borderColor: 'black',
    borderWidth: 1
  },
  error: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  errorMsg: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 5
  },
  signupContainer: {
    position: 'absolute',
    top: 230,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signup: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontFamily: 'RobotoCondensed-Regular',
    textAlign: 'center',
    color: '#333333',
    fontSize: 16,
    marginBottom: 5
  },
  welcomeText: { 
    fontFamily: 'RobotoCondensed-Regular',
    textAlign: 'center',
    color: '#333333',
    fontSize: 24,
    marginBottom: 10,
  },
  iambold: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  fakeNavBar:{
    height: 50,
    width: screenWidth,
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 4
  }
})
 
const mapStateToProps = (state) => {
  return {
    authErrorMsg: state.authReducer.authErrorMsg
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitSignup: (info) => {
            authActions.signup(dispatch, info);
        },
        submitLogin: (info) => {
            authActions.login(dispatch, info);
        },
        clearError: () => {
            authActions.clearError(dispatch);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralSignup);
