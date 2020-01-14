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
import * as Permissions from 'expo-permissions';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons} from '@expo/vector-icons';

class BusinessLocation extends Component{
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            gender: '',
            region : {
                latitude : null,
                longitude : null,
                latitudeDelta:  0.045,
                longitudeDelta: 0.0045,
            },   
            address: null
        };
    }

    onGenderReceived = (gender) => {
        this.setState(prevState => ({
            gender: prevState.gender = gender
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
        getGender(this.onGenderReceived);
        this.getLocationAsync()
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
        const businessType= this.props.navigation.getParam('businessType');
        const selectedCategory= this.props.navigation.getParam('selectedCategory');
        const selectedCategoryColor= this.props.navigation.getParam('selectedCategoryColor');
       
        if(this.props.navigation.getParam('Uname') == undefined){
            Uname = null;
        }
        else{
            Uname = this.props.navigation.getParam('Uname');
        }

        if(this.props.navigation.getParam('sID') == undefined){
            sID = null;
        }
        else{
            sID = this.props.navigation.getParam('sID');
        }
        
        if(this.props.navigation.getParam('crn') == undefined){
            crn = null;
        }
        else{
            crn = this.props.navigation.getParam('crn');
        }
        
        const name = this.props.navigation.getParam('name');
        const ic = this.props.navigation.getParam('ic');
        const hp = this.props.navigation.getParam('hp');
        const serviceName = this.props.navigation.getParam('serviceName');
        const serviceDescrip = this.props.navigation.getParam('serviceDescrip');
        const wExp = this.props.navigation.getParam('wExp');
        const image1 = this.props.navigation.getParam('image1');
        const image2 = this.props.navigation.getParam('image2');
        const image3 = this.props.navigation.getParam('image3');
        const image4 = this.props.navigation.getParam('image4');
        const image5 = this.props.navigation.getParam('image5');

        firebase.firestore().collection('business').add({
            uid: firebase.auth().currentUser.uid,
            BusinessCategoryColor: selectedCategoryColor,
            businessType : businessType,
            businessCRN : crn,
            businessCategory : selectedCategory,
            businessStudentU : Uname,
            businessStudentMatric : sID,
            businessUserName : name,
            businessUserIC : ic,
            businessUserHP : hp,
            businessName : serviceName,
            businessGender: this.state.gender,
            businessDescription : serviceDescrip,
            businessWorkingExp : wExp,
            businessAddress : this.state.address,
            businessLocation : this.state.region,
            businessCreatedDate: new Date().getDate() + '/' + (new Date().getMonth()+1)+ '/' + new Date().getFullYear(),
            businessCreatedTime: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
            businessImage1 : image1,
            businessImage2 : image2,
            businessImage3 : image3,
            businessImage4 : image4,
            businessImage5 : image5,
        })
        .then(function(docID){
            firebase.firestore().collection('business').doc(docID.id).update({
                businessID : docID.id,
            })
        }).catch(function(error){
            console.error(error)
        })

        this.props.navigation.navigate({ 
            routeName: 'Business',
        }),
        Alert.alert('Business information stored.'
        + '\nBe patient for verification process.' 
        + 'Thank you!');

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
                        Alert.alert(
                            'Confirmation',
                            'Is business information correct?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {text: 'OK', onPress: () => this.onSubmit()},
                            ],
                            {cancelable: false},
                          );
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
    input : {
        flex : 7
    },
    locate : {
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

export default BusinessLocation;
