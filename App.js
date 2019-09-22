import React, { Component } from 'react';
import HomeRoute from './routes/HomeRoute';

import { NativeModules } from 'react-native';
import FileManager from './utilities/FileManager';

/*
let data = NativeModules.FileManager.fetchWeeker("Batch II", 67);
if(!data) {
  FileManager.write();
} else {
  console.log(data);
}
*/

export default class App extends Component{
  render(){
    return <HomeRoute />;
  }
}
