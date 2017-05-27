import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Dimensions,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import RenderIf from './RenderIf';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2,sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
var data = [];
export default class TimeLine extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            loading: true,
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            refreshing: false
        };
    }

    componentWillMount(){
        AsyncStorage.getItem("name").then((value)=>{
            this.setState({
                name: value
            })
        })
        this.setState({
            dataSource: ds.cloneWithRows(data)
        })
        this.getTimeFeed();
    }

    getTimeFeed(){
        fetch(`http://grubapis.grubmet.com/getworkshop`, {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json;charset=utf-8"
            }
        })
        .then((response) => {
            let responseJson = JSON.parse(response._bodyInit);
            this.setState({
                dataSource: ds.cloneWithRows(responseJson.response),
                loading: false,
                refreshing: false
            })
        })
    }

    openCamera(){
        ImagePicker.openCamera({
            includeBase64: true,
            compressImageMaxHeight: 2000,
            compressImageMaxWidth: 1000
        }).then(image => {
            this.setState({
                loading: true
            })
            var today = new Date();
            params = {
                image: image.data,
                name: this.state.name
            }
            fetch(`http://grubapis.grubmet.com/workshop`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    "Content-Type" : "application/json;charset=utf-8"
                }
            })
            .then((response) => {
                this.getTimeFeed();
            })
        });
    }

    openGallery(){
        ImagePicker.openPicker({
            includeBase64: true,
            compressImageMaxHeight: 2000,
            compressImageMaxWidth: 1000
        }).then(image => {
            this.setState({
                loading: true
            })
            var today = new Date();
            params = {
                image: image.data,
                name: this.state.name
            }
            fetch(`http://grubapis.grubmet.com/workshop`, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    "Content-Type" : "application/json;charset=utf-8"
                }
            })
            .then((response) => {
                this.getTimeFeed();
            })
        });
    }
    
    _renderRowStatus(data){
        return(
            <View style={styles.card}>
                <Text style={{margin: 15, marginLeft: 20}}>{data.name}</Text>
                <View style={styles.imageContainer}>
                    <Image style={styles.rowImage} source={{uri: "http://grubapis.grubmet.com/images/"+data.image}} />
                </View>
                <Text style={{marginLeft: 20, marginTop: 10}}>{moment(data.created_at).format('MMMM Do YYYY, h:mm:ss a')}</Text>
            </View>
        )
    }
    _renderFooter(){
        return(
            <View style={{marginBottom: 20}}></View>
        )
    }
    _renderHeader(){
        return(
            <View style={{marginTop: 20}}></View>
        )
    }
    _onRefresh(){
        this.setState({refreshing: true});
        this.getTimeFeed();
    }

  render() {
    return (
        <View style={styles.container}>
            <View elevation={4} style={styles.header}>
                <View style={styles.headerButtonContainer}>
                    <TouchableOpacity onPress={this.openCamera.bind(this)} style={styles.imageButton}>
                        <Text style={styles.imageButtonText}>Open Camera</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerButtonContainer}>
                    <TouchableOpacity onPress={this.openGallery.bind(this)} style={styles.imageButton}>
                        <Text style={styles.imageButtonText}>Open Gallery</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {RenderIf(this.state.loading)(
            <ActivityIndicator
                color="red"
                size="large"
                style={styles.loading}
            />
            )}

            <ListView 
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                    />
                }
                style={styles.scrollArea}
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={this._renderRowStatus.bind(this)}
                renderHeader={this._renderHeader.bind(this)}
                renderFooter={this._renderFooter.bind(this)}
            />

        </View>
    );
  }
}

var window = Dimensions.get('window'); 

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F2F2F2"
    },
    loading: {
        marginTop: 20,
        backgroundColor: "#F2F2F2"
    },
    header:{
        width: window.width,
        height: 70,
        backgroundColor: "#1abc9c",
        flexDirection: "row",
    },
    headerButtonContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center"
    },
    imageButton:{
        backgroundColor: "#16a085",
        padding: 10
    },
    imageButtonText:{
        color: "white"
    },
    scrollArea:{
        paddingTop: 30,
        width: window.width,
        backgroundColor: "#F2F2F2",
    },
    card:{
        backgroundColor: "white",
        marginBottom: 20,
        height: 220
    },
    rowImage:{
        width: window.width*0.9,
        height: 130
    },
    imageContainer:{
        alignItems: "center"
    }
});