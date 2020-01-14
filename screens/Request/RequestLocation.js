import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
    ScrollView,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';

import {getGender} from '../../data/getGenderData';
import {getName} from '../../data/getuserNameData';

import * as Permissions from 'expo-permissions';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons} from '@expo/vector-icons';

class RequestLocation extends Component{
    constructor(props){
        super(props);
        this.state = {
            gender: '',
            name: '',
            region : {
                latitude : null,
                longitude : null,
                latitudeDelta:  0.045,
                longitudeDelta: 0.0045,
            },   
            address: null
        }
    }

    onGenderReceived = (gender) => {
        this.setState(prevState => ({
            gender: prevState.gender = gender,
        }))
    }

    onNameReceived = (name) => {
        this.setState(prevState => ({
            name: prevState.name = name,
        }))
    }

    getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted'){
            console.log('Permission to access location was denied');
        }
        await Location.getCurrentPositionAsync({enableHighAccuracy : true })
        .then(async(location) => {
            let region = {
                latitude : location.coords.latitude,
                longitude : location.coords.longitude,
                latitudeDelta:  0.045,
                longitudeDelta: 0.0045
            }
            this.setState({region : region})

            let address = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude})
            address.map(e => {
                this.setState({address : e.name + ',' + e.street + ',' + e.postalCode + ' ' + e.city + ',' + e.region})
            })
        })
    }

    componentDidMount(){
        getGender(this.onGenderReceived)
        getName(this.onNameReceived);
        this.getLocationAsync();
    }

    componentWillUnmount(){
        
    }

    centerMap(){
        const {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        } = this.state.region
  
        this.map.animateToRegion({
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        })
    }

    onSubmit(){
        const selectedCategory= this.props.navigation.getParam('selectedCategory');
        const serviceType = this.props.navigation.getParam('serviceType');
        const selectedCategoryColor= this.props.navigation.getParam('selectedCategoryColor');
        const requestDescrip = this.props.navigation.getParam('requestDescrip');
        const requestContact = this.props.navigation.getParam('requestContact');
        const date = this.props.navigation.getParam('date');
        const time = this.props.navigation.getParam('time');
        const image = this.props.navigation.getParam('requestImage');

        firebase.firestore().collection('request').add({
            uid: firebase.auth().currentUser.uid,
            requestUserName: this.state.name,
            requestGender: this.state.gender,
            requestCategory : selectedCategory,
            requestCategoryColor: selectedCategoryColor,
            requestImage: image,
            serviceType : serviceType,
            requestDescription : requestDescrip,
            requestContact : requestContact,
            requestAddress : this.state.address,
            requestLocation : this.state.region,
            serviceDate : date,
            serviceTime : time,
            serviceStatus: '',
            requestCreatedDate: new Date().getDate() + '/' + (new Date().getMonth() +1)+ '/' + new Date().getFullYear(),
            requestCreatedTime: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
        })
        .then(async function(docID){
            firebase.firestore().collection('request').doc(docID.id).update({
                requestID : docID.id
            });
            var subsnapshot = await firebase.firestore().collection('business')
            .where('businessCategory','==', selectedCategory).get()
            subsnapshot.forEach(subdoc => {
                firebase.firestore().collection('request').doc(docID.id)
                .collection('serviceProvider').doc(subdoc.data().businessID).set({
                    businessID : subdoc.data().businessID,
                    requestID : docID.id,
                    requestStatus : 'requesting',
                    servicePrice : null,
                    serviceStatus : null,
                })
            })
        }).catch(function(error){
            console.error(error)
        })

        this.props.navigation.navigate({ routeName: 'Request'}),
        Alert.alert('Request made.'
        + '\nBe patient for matching process.' 
        + 'Thank you!')
    }

    render(){
        return (
            <View style = {styles.screen}>
                <View style = {styles.searchbar}>
                    <View style = {styles.input}>
                        <TextInput 
                            style = {{marginHorizontal: '10%', color: 'grey', fontSize: 15, alignItems : 'center'}}
                            multiline = {true}
                            value = {this.state.address}
                            autoCapitalize = 'none'
                            autoCorrect = {false}
                            onChangeText = {(text) => this.setState({address : text})}
                        />
                    </View>

                    <TouchableOpacity 
                        style ={styles.icon}
                        onPress = {async() => {
                            await Location.geocodeAsync(this.state.address).then(location => {
                                location.map(info => {
                                    let region = {
                                        latitude : info.latitude,
                                        longitude : info.longitude,
                                        latitudeDelta : 0.045,
                                        longitudeDelta : 0.0045
                                    }
                                    this.setState({region : region})
                                })
                            })
                    }}>
                        <Ionicons name = "ios-search" size = {30} style ={{color : 'grey'}}/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style = {styles.locate}
                    onPress = {() =>{this.centerMap()}}>
                    <Ionicons name = "md-locate" size= {30} style = {{color : 'black'}}/>  
                </TouchableOpacity>

                {this.state.region.latitude !== null && 
                <MapView
                    provider = {PROVIDER_GOOGLE}
                    initialRegion = {this.state.region}
                    showsUserLocation = {true}
                    showsCompass = {true}
                    rotateEnabled = {false}
                    style = {{flex : 1}}
                    ref = {(map) => {this.map = map}}>
                        <Marker
                            draggable = {true}
                            coordinate = {this.state.region}
                            title = {'You are here'}
                            onDragEnd = {async(e) => {
                                let region = {
                                    latitude : e.nativeEvent.coordinate.latitude,
                                    longitude : e.nativeEvent.coordinate.longitude,
                                    latitudeDelta:  0.045,
                                    longitudeDelta: 0.0045
                                }
                                this.setState({region : region})

                                let address = await Location.reverseGeocodeAsync({
                                    longitude: e.nativeEvent.coordinate.longitude, 
                                    latitude: e.nativeEvent.coordinate.latitude
                                })
                                address.map(e => {
                                    this.setState({address : e.name + ',' + e.street + ',' + 
                                    e.postalCode + ' ' + e.city + ',' + e.region
                                    })
                                })
                        }}/>
                </MapView>
                }

                <View>
                    <TouchableOpacity
                        style={styles.buttonSubmit}
                        onPress={() =>  {
                            this.onSubmit()
                        }}>
                        <Text style={styles.submitText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    buttonSubmit: {
        height: 60,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'black',
        padding: 5
    },
    submitText:{
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
    },
    searchbar: {
        zIndex: 9,
        position: 'absolute',
        flexDirection: 'row',
        top: '10%',
        left: '10%',
        alignItems: 'center',
        height: '10%',
        width: '80%',
        borderRadius: 2,
        backgroundColor: 'white',
        elevation: 7,
        shadowRadius: 5,
        shadowOpacity: 1.0 
      },
      icon : {
        flex: 1,
        marginHorizontal: '5%'
      },
      input: {
        flex : 7
      },
      locate:{
        zIndex: 9,
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent : 'space-around',
        borderRadius: 50,
        backgroundColor: 'white',
        elevation: 7,
        shadowRadius: 5,
        shadowOpacity: 1.0 
      }
});

export default RequestLocation;
