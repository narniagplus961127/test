import React, {Component} from 'react';
import {
    View, 
    TextInput,
    Text,
    Button,
    Alert,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet
} from 'react-native';
import * as firebase from 'firebase';
import Colors from '../../constants/Colors';

import * as Permissions from 'expo-permissions';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons} from '@expo/vector-icons';

export default class test extends Component{
    constructor(props){
        super(props);
        this.state = {
            region : {
              latitude : null,
              longitude : null,
              latitudeDelta:  0.045,
              longitudeDelta: 0.0045,
            },      
            address : null
        }
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
            this.setState({address : e.name + ',' + e.street + ',' + e.postalCode + ' ' 
            + e.city + ',' + e.region
            })
        })
      })

  }

    componentDidMount() {
        this.getLocationAsync()
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
      
    render() {
        return (
            <View style = {styles.screen}>
                <View
                    style = {styles.searchbar}>
                    
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
              
                    <View style = {styles.input}>
                        <TextInput 
                            style = {{marginHorizontal: '10%', color: 'grey', fontSize: 20, alignItems : 'center'}}
                            value = {this.state.address}
                            autoCapitalize = 'none'
                            autoCorrect = {false}
                            onChangeText = {(text) => this.setState({address : text})}
                        />
                    </View>
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
                          let address = await Location.reverseGeocodeAsync( {longitude: e.nativeEvent.coordinate.longitude, latitude: e.nativeEvent.coordinate.latitude})
                          this.setState({region : region})
                          address.map(e => {
                            this.setState({address : e.name + ',' + e.street + ',' + e.postalCode + ' ' 
                            + e.city + ',' + e.region
                            })
                          })
                        }}>

                      </Marker>
                </MapView>
                }



            </View>
        )
    }
}

const styles = StyleSheet.create({
  screen: {
      flex: 1,
      backgroundColor: Colors.backgroundColor
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
    bottom: '10%',
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