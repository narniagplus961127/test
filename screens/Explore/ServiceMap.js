import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    Alert,
    Platform,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import * as firebase from 'firebase';
import Colors from '../../constants/Colors';
import StarRating from 'react-native-star-rating';

import * as Permissions from 'expo-permissions';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons} from '@expo/vector-icons';
import { Thumbnail } from 'native-base';

class ServiceMap extends Component{
    constructor(props){
        super(props);
        this.state = {
            region : {
              latitude : null,
              longitude : null,
              latitudeDelta:  0.045,
              longitudeDelta: 0.0045,
            },      
            serviceList : [],
            businessID: null,
        }
    }
  
    getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted'){
            console.log('Permission to access location was denied');
        }
    }

    async getService(){
        await Location.getCurrentPositionAsync({enableHighAccuracy : true }).then(location => {
            let region = {
                latitude : location.coords.latitude,
                longitude : location.coords.longitude,
                latitudeDelta:  0.045,
                longitudeDelta: 0.0045
            }
            this.setState({region : region})
        })

        var serviceList = [];
        firebase.firestore().collection('business').get().then(doc => {
            doc.forEach(docinfo => {
                var averageRating = null;
                var noCustomer = 1;
                let service = {
                    coordinate:{
                        latitude : docinfo.data().businessLocation.latitude,
                        longitude : docinfo.data().businessLocation.longitude,
                    },
                    title: docinfo.data().businessName,
                    key: docinfo.data().businessID,
                    businessID : docinfo.data().businessID,
                    businessName: docinfo.data().businessName,
                    businessCategoryColor: docinfo.data().BusinessCategoryColor,
                    businessImage1 : docinfo.data().businessImage1,
                    businessCategory : docinfo.data().businessCategory,
                    businessUserName : docinfo.data().businessUserName
                }
                serviceList.push(service)

                firebase.firestore().collection('business').doc(docinfo.data().businessID)
                .collection('customer').get()
                .then(subdoc => {
                    subdoc.forEach(info => {
                        averageRating = (averageRating + info.data().finalRating) / noCustomer; 
                        noCustomer++;
                    })
                    let serviceList = [...this.state.serviceList];
                    let index = serviceList.findIndex(list => list.businessID === docinfo.data().businessID);
                    serviceList[index] = {
                        ...serviceList[index],
                        averageRating: averageRating,
                    }
                    this.setState({serviceList: serviceList})
                })
            this.setState({serviceList: serviceList})
        })
    })
    }

    componentDidMount() {
        this.getLocationAsync();
        this.getService()
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

    centerServiceMap(getLatitude,getLongitude){
        const {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        } = {
            latitude: getLatitude,
            longitude: getLongitude,
            latitudeDelta:  0.045,
            longitudeDelta: 0.0045
          }
  
        this.map.animateToRegion({
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        })
    }

    scrollToIndex = (index) => {
        this.flatListRef.scrollToIndex({animated: true, index: index});
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
                    zoomEnabled = {true}
                    style = {{flex : 1}}
                    ref = {(map) => {this.map = map}}>
                    {this.state.serviceList.map((marker,index) => (
                        <Marker
                            coordinate={marker.coordinate}
                            key = {marker.key}
                            ref = {(markermap) => {this.markermap = markermap}}
                            onPress = {() => {
                                this.scrollToIndex(index)
                            }}
                        >
                            <View
                                style = {{
                                    backgroundColor: 'white',
                                    width: 80,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    borderColor: marker.businessCategoryColor,
                                    borderWidth: 1
                                }}
                            >
                                <Text style = {{fontSize:12}}>{marker.title}</Text>
                            </View>
                            <View
                                style = {{
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Ionicons name='ios-pin' size={40} 
                                    style={{color: marker.businessCategoryColor}}
                                />
                            </View>
                        </Marker>
                    ))}
                </MapView>
                }

                <FlatList
                    style = {styles.service}
                    ref={(ref) => { this.flatListRef = ref; }}
                    scrollEventThrottle = {1}
                    pagingEnabled={true}
                    scrollEnabled = {true}
                    horizontal = {true}
                    snapToAlignment = 'center'
                    showsHorizontalScrollIndicator = {false}
                    keyExtractor = {(item,index) => item.businessID} 
                    data = {this.state.serviceList}
                    renderItem = {({ item,index }) => {
                        return(
                            <TouchableOpacity
                                style = {{
                                    backgroundColor: 'white',
                                    marginHorizontal: 24,
                                    width : width - (24*2),
                                    height : height* 0.15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    borderRadius: 10,
                                    borderColor: item.businessCategoryColor,
                                    borderWidth: 2
                                }}
                                onPress={() => {
                                    this.props.navigation.navigate({
                                        routeName: 'MapDetails',
                                        params: {
                                            businessID : item.businessID,
                                            businessName: item.businessName
                                        }
                                    })
                                    this.setState({businessID: item.businessID})
                                }}
                            >   
                                <View style={{marginHorizontal: '5%'}}>
                                    <Thumbnail large square
                                    source={{uri: item.businessImage1}} />
                                </View>
                                <View 
                                style = {{
                                    width: '30%',
                                    height: '80%',
                                    justifyContent: 'center'
                                }}>
                                    <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{item.businessName}</Text>
                                    <StarRating
                                        disabled={true}
                                        emptyStar={'ios-star-outline'}
                                        fullStar={'ios-star'}
                                        halfStar={'ios-star-half'}
                                        iconSet={'Ionicons'}
                                        maxStars={5}
                                        rating={item.averageRating}
                                        fullStarColor={Colors.primaryColor}
                                        starSize = {20}
                                    />
                                    <Text style = {{fontSize: 12, fontWeight: 'bold'}}>by {item.businessUserName}</Text>
                                </View>
                                <View style={{marginHorizontal: '5%', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{width: '100%', height: 30, backgroundColor: item.businessCategoryColor,justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style = {{fontSize: 10, fontWeight: 'bold', fontStyle: 'italic',justifyContent: 'center'}}>
                                            {item.businessCategory}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style = {{alignItems: 'flex-end', justifyContent: 'flex-end', width:50}}
                                        onPress = {() => {
                                            this.centerServiceMap(item.coordinate.latitude, item.coordinate.longitude)
                                        }}
                                    >   
                                        <Ionicons name= 'ios-navigate' size={40}/>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
}

const {height, width} = Dimensions.get('screen')

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  locate:{
    zIndex: 9,
    position: 'absolute',
    bottom: '25%',
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
  },
  service:{
    flex: 1,
    position: 'absolute',
    right : 0,
    left: 0,
    bottom: '5%',

  }
});

export default ServiceMap;