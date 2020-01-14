import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    Alert,
    Platform,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import * as firebase from 'firebase';
import Colors from '../../constants/Colors';

import * as Permissions from 'expo-permissions';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons} from '@expo/vector-icons';

class BusinessMap extends Component{
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
    }

    componentDidMount() {
        const location = this.props.navigation.getParam('location');
        this.setState({ region : location });
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
                            draggable = {false}
                            coordinate = {this.state.region}
                        >
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

export default BusinessMap;