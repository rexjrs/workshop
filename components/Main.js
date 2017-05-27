import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import RenderIf from './RenderIf';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            error: false
        };
    }

    submitName(){
        if(this.state.name){
            dismissKeyboard();
            AsyncStorage.setItem("name",this.state.name);
            this.props.navigator.push({
                id: 'timeline'
            })
        }else{
            this.setState({
                error: true
            })
        }
    }

  render() {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter your name"
                placeholderTextColor="white"
                underlineColorAndroid="white"
                onChangeText={(name) => this.setState({name})}
                onSubmitEditing={this.submitName.bind(this)}
                value={this.state.name}
                style={styles.nameInput}
            />
            {RenderIf(this.state.error)(
            <Text style={{color: "red"}}>Please enter a name</Text>
            )}
            <TouchableOpacity onPress={this.submitName.bind(this)} style={styles.nameBtn}>
                <Text style={{color: "white"}}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1abc9c"
    },
    nameInput:{
        width: 200,
        textAlign: "center",
        color: "white"
    },
    nameBtn:{
        width: 200,
        height: 40,
        backgroundColor: "#16a085",
        justifyContent: "center",
        alignItems: "center",
    }
});