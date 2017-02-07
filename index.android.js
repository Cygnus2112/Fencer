import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';

import App from './App'

import createStore from './createStore'

const store = createStore();

const Fencer = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

AppRegistry.registerComponent('Fencer', () => Fencer);

