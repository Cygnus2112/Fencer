import React, { Component } from 'react';
import { 
  Modal, 
  Text, 
  TouchableHighlight, 
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';

import Button from 'react-native-button';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../actions/authActions';

const _validateEmail = (email) => {
  let regExString = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExString.test(email);
}

class LoginModal extends Component {
  constructor(props){
    super(props);

    this.toggleSignup = this.toggleSignup.bind(this);

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);

    this.state = {
      modalVisible: this.props.modalVisible,
      showSignup: false,
      username: "",
      password: "",
      errorMsg: "",
      signupEmail: "",
      signupUsername: "",
      signupPassword: ""
    }
  }

  componentDidMount(){
   // console.log('this.props in LoginModal componentDidMount: ', this.props);
  }

  componentWillReceiveProps(newProps){
    if(newProps.username !== this.props.username){
      this.setState({
        modalVisible: !this.state.modalVisible
      })
      this.props.toggleModal();
    }
    if(newProps.authErrorMsg.length){
      // this.setState({
      //   errorMsg: newProps.authErrorMsg
      // })
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
      signupPassword: ""
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
        password: this.state.password
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
        email: this.state.signupEmail
      })
    }
  }


  render() {
    return (
      
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
            >
            {!this.state.showSignup
                ?
              (<View style={styles.modalContainer}>
                  <View style={styles.modalInterior}>

                    <View style={styles.username}>
                      <TextInput placeholder="Username" style={styles.textInput} 
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username} />
                    </View>

                    <View style={styles.password}>
                      <TextInput placeholder="Password" 
                        style={styles.textInput} 
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password} />
                    </View>

                  <View style={styles.signinButtonContainer}>
                    <View style={styles.signinButtonBox}>
                      <Button
                        style={{fontSize: 18, color: 'black'}}
                        styleDisabled={{color: 'red'}}
                        onPress={ this.handleSignIn }>
                          Sign In
                      </Button> 
                    </View>
                  </View>

          {/*          <View style={ styles.error } >  
                        <Text style={ styles.errorMsg }>
                          {this.state.errorMsg}
                        </Text>
                    </View>     */}

                  <View style={ styles.signupContainer }> 
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

                    <View style={styles.dismiss}>                  
                      <TouchableHighlight 
                        style={styles.dismissButton}

                        onPress={() => {
                          this.setState({
                            modalVisible: !this.state.modalVisible
                          })
                          this.props.toggleModal();
                      }}>
                        <Text style={{color: 'white'}}>Close</Text>
                        
                      </TouchableHighlight>
                    </View>

                </View>
              </View>)

                  :
              (<View style={styles.modalContainer}>
                <View style={styles.modalInterior}>
                  <View style={ styles.username }>
                    <TextInput placeholder="Email" style={styles.input} 
                      autoCorrect={false}
                      onChangeText={(signupEmail) => this.setState({signupEmail})}
                      value={this.state.signupEmail} />
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

           {/*          <View style={ styles.error } >  
                      <Text style={ styles.signupErrorMsg }>
                        {this.state.signupErrorMsg}
                      </Text>
                  </View>   */}

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

                  <View style={styles.dismiss}>                  
                    <TouchableHighlight 

                      style={styles.dismissButton}
                      onPress={() => {
                        
                        this.setState({
                          modalVisible: !this.state.modalVisible
                        })
                        this.props.toggleModal();
                    }}>
                      <Text style={{color: 'white'}}>Close</Text>
                      
                    </TouchableHighlight>
                  </View>
                </View>
              </View>)
            }
          </Modal>
      
    );
  }
}

const styles = StyleSheet.create({
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
   // margin: 5, 
   // marginTop:50, 
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
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalInterior: {
    position: 'absolute', 
    top: 60, 
    left:40, 
    right: 40, 
    bottom: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    borderWidth:1, 
    borderColor:'black', 
    borderRadius:10,
   // padding: 10
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
    alignItems: 'center',
    // borderColor: 'black',
    // borderWidth: 1
  },
  signup: {
  //  height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    // borderColor: 'black',
    // borderWidth: 1
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 16,
    marginBottom: 5
  },
  iambold: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  input: {
   //  backgroundColor: 'white', 
   //  margin: 3, 
   //  // padding: 10,
   //  padding: 5,
   // // height: 45, 
   //  width: 200*.7,
   //  fontSize: 18,
   //  textAlign: 'center'
    backgroundColor: 'white', 
    margin: 5, 
    padding: 5,
    width: 200,
    fontSize: 18,
    textAlign: 'center',
  },

})

const mapStateToProps = (state) => {

  return {
    currentView: state.uploadReducer.currentView,
   // selectDatesComplete: state.uploadReducer.selectDatesComplete,
    username: state.authReducer.username,
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);






