import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Navigation from 'react-native-deprecated-custom-components';

import Main from './components/Main';
import TimeLine from './components/TimeLine';

export default class workshop extends Component {
  renderScene(route, navigator){
    switch(route.id){
      case 'main':
        return (<Main navigator={navigator} route={route} title="Main Page"/>)
      case 'timeline':
        return (<TimeLine navigator={navigator} route={route} title="Main Page"/>)
    }
  }

  render() {
    return (
        <Navigation.Navigator
          initialRoute={{id: 'main'}}
          renderScene={this.renderScene}
        />
    );
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('workshop', () => workshop);
