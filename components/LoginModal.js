import React, { Component } from 'react';
import { 
  Modal, 
  Text, 
  TouchableHighlight, 
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet 
} from 'react-native';

import Button from 'react-native-button';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../actions/authActions';

class LoginModal extends Component {
  constructor(props){
    super(props);

    this.toggleSignup = this.toggleSignup.bind(this);

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
    if(newProps.authErrorMsg !== this.props.authErrorMsg){
      this.setState({
        errorMsg: newProps.authErrorMsg
      })
    }
  }

  toggleSignup(){
    this.setState({
      showSignup: !this.state.showSignup
    })
  }
// <View style={{position: 'absolute', top: 30, left: 30, right: 30, bottom: 30}}>



  render() {
    return (
      
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
            {!this.state.showSignup
                ?
              (<View style={styles.container}>
                  <View style={{elevation:3,height: 50,flexDirection: 'row',justifyContent: 'center', backgroundColor:'white', margin:5, marginTop:50, borderRadius: 4}}>
                    <TextInput placeholder="Username" style={styles.textInput} 
                      onChangeText={(username) => this.setState({username})}
                      value={this.state.username} />
                  </View>
                  <View style={{elevation:3,height: 50, flexDirection: 'row',justifyContent: 'center',backgroundColor:'white', margin:5, borderRadius: 4}}>
                    <TextInput placeholder="Password" 
                      style={styles.textInput} 
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({password})}
                      value={this.state.password} />
                  </View>
                  <View style={styles.buttonBox}>
                    <Button
                      style={{fontSize: 18, color: 'white'}}
                      styleDisabled={{color: 'red'}}
                      onPress={ ()=> {this.props.submitLogin({
                        username: this.state.username,
                        password: this.state.password
                      })}}>
                        Sign In
                    </Button> 
                  </View>
                  <View style={ styles.error } >  
                      <Text style={ styles.errorMsg }>
                        {this.state.errorMsg}
                      </Text>
                  </View>
                  <View style={ styles.signup }> 
                    <TouchableHighlight onPress={ () => { this.toggleSignup() } } style={styles.button} >
                        <View style={ styles.header }>
                          <Text style={styles.instructions} >
                            { "Don't" } have an account?
                          </Text>
                          <Text style={styles.iambold} >
                            Sign up!
                          </Text>
                        </View>
                    </TouchableHighlight>
                  </View>
                <View>                  
                  <TouchableHighlight onPress={() => {
                    this.setState({
                      modalVisible: !this.state.modalVisible
                    })
                    this.props.toggleModal();
                  }}>
                    <Text>Hide Modal</Text>
                    
                  </TouchableHighlight>
                </View>
              </View>)

                  :
              (<View style={styles.container}>
                  <View style={{elevation:3, height: 45, flexDirection: 'row',justifyContent: 'center',backgroundColor:'white',borderRadius: 4, margin:2, marginTop: 30}}>
                    <TextInput placeholder="Email" style={styles.input} 
                      autoCorrect={false}
                      onChangeText={(signupEmail) => this.setState({signupEmail})}
                      value={this.state.signupEmail} />
                  </View>
                  <View style={{elevation:3,height: 50,flexDirection: 'row',justifyContent: 'center', backgroundColor:'white', margin:5, marginTop:50, borderRadius: 4}}>
                    <TextInput placeholder="Username" style={styles.textInput} 
                      onChangeText={(signupUsername) => this.setState({signupUsername})}
                      value={this.state.signupUsername} />
                  </View>
                  <View style={{elevation:3,height: 50, flexDirection: 'row',justifyContent: 'center',backgroundColor:'white', margin:5, borderRadius: 4}}>
                    <TextInput placeholder="Password" 
                      style={styles.textInput} 
                      secureTextEntry={true}
                      onChangeText={(signupPassword) => this.setState({signupPassword})}
                      value={this.state.signupPassword} />
                  </View>
                  <View style={styles.buttonBox}>
                    <Button
                      style={{fontSize: 18, color: 'white'}}
                      styleDisabled={{color: 'red'}}
                      onPress={ ()=> {this.props.submitSignup(
                      { 
                        username: this.state.signupUsername,
                        password: this.state.signupPassword,
                        email: this.state.signupEmail
                      }
                      )}}>
                        Sign Up
                    </Button> 
                  </View>
                  <View style={ styles.error } >  
                      <Text style={ styles.signupErrorMsg }>
                        {this.state.signupErrorMsg}
                      </Text>
                  </View>
                  <View style={ styles.signup }> 
                    <TouchableHighlight onPress={ ()=>{ this.toggleSignup() } } style={styles.button} >
                        <View style={ styles.header }>
                          <Text style={styles.instructions} >
                            Already have an account?
                          </Text>
                          <Text style={styles.iambold} >
                            Login
                          </Text>
                        </View>
                    </TouchableHighlight>
                  </View>
                <View>                  
                  <TouchableHighlight onPress={() => {
                    this.setState({
                      modalVisible: !this.state.modalVisible
                    })
                    this.props.toggleModal();
                  }}>
                    <Text>Hide Modal</Text>
                    
                  </TouchableHighlight>
                </View>
              </View>)
            }
          </Modal>
      
    );
  }
}

const styles = StyleSheet.create({
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
  buttonBox: {
    elevation:3,
    padding:10, 
    margin: 5,
    height:45, 
    width: 200*.7, 
    overflow:'hidden', 
    borderRadius:4, 
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
  signup: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'center',
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
    backgroundColor: 'white', 
    margin: 3, 
    // padding: 10,
    padding: 5,
   // height: 45, 
    width: 200*.7,
    fontSize: 18,
    textAlign: 'center'
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);






