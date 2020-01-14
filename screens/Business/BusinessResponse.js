import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    RefreshControl,
    Alert,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
    Card, 
    CardItem,
    Body,
    Left,
    Thumbnail,
    Right
} from 'native-base';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

class BusinessResponse extends Component{
    constructor(props){
        super(props);
        this.state = {
            businessID: '',
            requestList: [],
            respondedList: [],
            requestStatus: '',
            refreshing: false,
            businessUserName: null,
            avatar: null
        }
    }

    getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted'){
            console.log('Permission to access location was denied');
        }
    }

    degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
      
    distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;
      
        var dLat = this.degreesToRadians(lat2-lat1);
        var dLon = this.degreesToRadians(lon2-lon1);
      
        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);
      
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var distance = earthRadiusKm * c;
        return distance.toFixed(1)
    }

    async getResponded(){
        const businessID = this.props.navigation.getParam('businessID');
        var snapshot0 = await firebase.firestore().collection('business').where('businessID', '==',businessID).get()
        snapshot0.forEach((doc) => {
            businessCategory = doc.data().businessCategory
        })

        var respondedList = [];
        var requestStatus = '';
        var lat1 = null;
        var long1 = null;

        var location = await Location.getCurrentPositionAsync({enableHighAccuracy : true }).then(location => {
            lat1 = location.coords.latitude;
            long1 = location.coords.longitude
        })

        var snapshot1 = await firebase.firestore().collection('request').where('requestCategory', '==', businessCategory)
        snapshot1.get().then((querySnapshot) => {
            querySnapshot.forEach(async doc => {
                var subsnapshot = await doc.ref.collection('serviceProvider')
                .where('requestStatus', '==', 'responded').where('businessID', '==', businessID)
                subsnapshot.get().then((querySubSnapshot) => {
                    querySubSnapshot.forEach(async(subdoc) => {
                        requestStatus = subdoc.data().requestStatus
                        if (requestStatus == 'responded'){
                            var snapshot = await firebase.firestore().collection('request')
                            .where('requestID', '==', subdoc.data().requestID).get()                  
                            snapshot.forEach((doc) => {
                                respondedList.push(doc.data())
                                firebase.firestore().collection('request').doc(doc.data().requestID)
                                .collection('serviceProvider').doc(businessID).get()
                                .then((docinfo) => {
                                    var distance = this.distanceInKmBetweenEarthCoordinates(
                                        lat1, 
                                        long1, 
                                        doc.data().requestLocation.latitude, 
                                        doc.data().requestLocation.longitude
                                    );

                                    let respondedList = [...this.state.respondedList];
                                    let index = respondedList.findIndex(list => list.requestID === docinfo.data().requestID);
                                    respondedList[index] = {
                                        ...respondedList[index],
                                        serviceStatus: docinfo.data().serviceStatus,
                                        chatID: docinfo.data().chatID,
                                        distance: distance
                                    }
                                    this.setState({respondedList : respondedList})
                                })
                            });  
                            this.setState({respondedList : respondedList})
                        }  
                        else null   
                    })
                })
            })
        })   
    }   

    async getRequest(){
        const businessID = this.props.navigation.getParam('businessID');
        var businessCategory = '';
        var snapshot0 = await firebase.firestore().collection('business').where('businessID', '==',businessID).get()
        snapshot0.forEach((doc) => {
            businessCategory = doc.data().businessCategory
        })

        var requestList = [];
        var requestStatus = '';
        var lat1 = null;
        var long1 = null;

        var location = await Location.getCurrentPositionAsync({enableHighAccuracy : true }).then(location => {
            lat1 = location.coords.latitude;
            long1 = location.coords.longitude
        })

        var snapshot1 = await firebase.firestore().collection('request').where('requestCategory', '==', businessCategory)
        snapshot1.get().then((querySnapshot) => {
            querySnapshot.forEach(async doc => {
                var subsnapshot = await doc.ref.collection('serviceProvider')
                .where('requestStatus', '==', 'requesting').where('businessID', '==', businessID)
                subsnapshot.get().then((querySubSnapshot) => {
                    querySubSnapshot.forEach(async(subdoc) => {
                        requestStatus = subdoc.data().requestStatus
                        if (requestStatus == 'requesting'){
                            var snapshot = await firebase.firestore().collection('request')
                            .where('requestID', '==', subdoc.data().requestID).get()                  
                            snapshot.forEach((doc) => {
                                requestList.push(doc.data())

                                firebase.firestore().collection('request')
                                .where('requestID', '==', subdoc.data().requestID).get()                  
                                .then((doc) => {
                                    doc.forEach(info => {
                                        var distance = this.distanceInKmBetweenEarthCoordinates(
                                            lat1, 
                                            long1, 
                                            info.data().requestLocation.latitude, 
                                            info.data().requestLocation.longitude
                                        );

                                        let requestList = [...this.state.requestList];
                                        let index = requestList.findIndex(list => list.requestID === info.data().requestID);
                                        requestList[index] = {
                                            ...requestList[index],
                                            distance : distance
                                        }
                                        this.setState({requestList : requestList}) 
                                    })
                                })
                            }); 
                            this.setState({requestList : requestList}) 
                        }
                        else null   
                    })
                })
            })
        })
    }     

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
    }

    
    _isMounted = false;

    componentDidMount(){
        this.getLocationAsync();
        this._isMounted = true;
        const businessID = this.props.navigation.getParam('businessID');
        firebase.firestore().collection('business').doc(businessID).get().then(doc => {
            this.setState({businessUserName : doc.data().businessUserName})
        })

        firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).get()
        .then(doc => {
            this.setState({avatar : doc.data().profile_picture})
        })
        this.getRequest();
        this.getResponded();  
        this.setState({refreshing: false})
    }
 
    componentWillUnmount(){
        this._isMounted = false;
    }

    render(){
        return (
            <View style = {styles.screen}>
            <ScrollView style = {styles.screen}
            refreshControl = {
                <RefreshControl               
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.refreshing}/>                
            }>
                <TouchableOpacity
                style = {styles.bar}
                onPress = {()=>{}}>
                <Image 
                style = {{height : 20 , width : 20, marginHorizontal: 10}}
                source = {require('../../assets/Responded.png')}/>
                <Text style = {{fontSize: 20, fontWeight : 'bold'}}>Responded</Text>
                </TouchableOpacity>

                <FlatList 
                data={this.state.respondedList} 
                keyExtractor={(item,index) => item.requestID} 
                renderItem={({ item }) => {
                    return (
                    <Card>
                    <TouchableOpacity 
                    style= {{
                        borderColor: item.requestCategoryColor,
                        borderWidth: 3,
                        borderBottomWidth:0,
                    }}
                    onPress = {() => {                
                        this.props.navigation.navigate({ 
                            routeName: 'RequestView',
                            params: {
                                requestID : item.requestID,
                                requestName: item.serviceType
                            }
                        })
                    }}>
                    <CardItem>
                        <Left><Text style = {{fontSize: 25, fontWeight: 'bold'}}>{item.requestUserName}</Text></Left>
                        <Right>
                            <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.distance} KM</Text>
                            <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.requestCreatedTime}</Text>
                            <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.requestCreatedDate}</Text>
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Image 
                            style = {{height : 20 , width : 20, marginRight : 10}}
                            source = {require('../../assets/RequestTitle.png')}/>
                            <Text style = {{fontSize: 20}}>{item.serviceType}</Text>
                        </Left>
                        <Right>
                            <Thumbnail large square
                            source={{uri: item.requestImage}} />
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Ionicons name ='md-clipboard' size = {20} style = {{marginRight : 10}}/>
                            <Text numberOfLines = {2} style = {{fontSize: 15, fontStyle: 'italic'}}>{item.requestDescription}</Text>
                        </Left>
                    </CardItem>
                    </TouchableOpacity>

                    <View
                        style= {{
                            borderColor: item.requestCategoryColor,
                            borderWidth: 3,
                            borderTopWidth: 0
                        }}
                    >
                    <CardItem>
                    <Left>
                        <TouchableOpacity
                        style = {styles.buttonPositive}
                        onPress = {() => {
                            this.props.navigation.navigate({ 
                                routeName: 'BusinessChat',
                                params: {
                                    serviceStatus : item.serviceStatus,
                                    chatID : item.chatID,
                                    requestID : item.requestID,
                                    businessID : this.props.navigation.getParam('businessID'),
                                    businessUserName : this.state.businessUserName,
                                    avatar: this.state.avatar
                                }
                            })
                        }}
                        >
                        <Text style = {{color : 'black', fontSize: 20}}>Chat</Text>
                        </TouchableOpacity>
                    </Left>

                    <Right>
                    <TouchableOpacity
                        disabled = {item.serviceStatus == 'Negotiation'? false : true}
                        style = {item.serviceStatus == 'Negotiation'? styles.buttonNegative : styles.buttonNegativeDisabled}
                        onPress = {() => {
                            Alert.alert(
                                'Confirmation',
                                'Reject this request?',
                                [
                                    {
                                        text: 'No',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes', 
                                        onPress: () => {                        
                                            const businessID = this.props.navigation.getParam('businessID');
                                            firebase.firestore().collection('request').doc(item.requestID)
                                            .collection('serviceProvider').doc(businessID).update({
                                                requestStatus : 'declined',
                                                serviceStatus : 'declined'
                                            }).then(e => {
                                                this.onRefresh()
                                            })
                                        }
                                    }
                                ],
                                {cancelable: false},
                            );
                        }}
                    >
                    <Text style = {{color : 'white', fontSize: 20}}>Decline</Text>
                    </TouchableOpacity>
                    </Right>
                    </CardItem>
                    </View>
                    </Card>
                )}
                }
                numColumns={1} 
                />
    
                <TouchableOpacity
                style = {styles.bar}
                onPress = {()=>{}}>
                <Image 
                style = {{height : 20 , width : 20, marginHorizontal: 10}}
                source = {require('../../assets/Requesting.png')}/>
                <Text style = {{fontSize: 20, fontWeight : 'bold'}}>Resquesting</Text>
                </TouchableOpacity>
                
                <FlatList 
                data={this.state.requestList} 
                keyExtractor={(item,index) => item.requestID} 
                renderItem={({ item }) => {
                    return (

                    <Card>
                    <TouchableOpacity 
                    style = {{
                        borderColor: item.requestCategoryColor,
                        borderWidth: 3,
                        borderBottomWidth: 0,
                    }}
                    onPress = {() => {                
                        this.props.navigation.navigate({ 
                            routeName: 'RequestView',
                            params: {
                                requestID : item.requestID,
                                requestName: item.serviceType
                            }
                        })
                    }}>
                    <CardItem>
                        <Left><Text style = {{fontSize: 25, fontWeight: 'bold'}}>{item.requestUserName}</Text></Left>
                        <Right>
                            <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.distance} KM</Text>
                            <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.requestCreatedTime}</Text>
                            <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.requestCreatedDate}</Text>
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Image 
                            style = {{height : 20 , width : 20, marginRight : 10}}
                            source = {require('../../assets/RequestTitle.png')}/>
                            <Text style = {{fontSize: 20}}>{item.serviceType}</Text>
                        </Left>
                        <Right>
                            <Thumbnail large square
                            source={{uri: item.requestImage}} />
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <Ionicons name ='md-clipboard' size = {20} style = {{marginRight : 10}}/>
                            <Text numberOfLines = {2} style = {{fontSize: 15, fontStyle: 'italic'}}>{item.requestDescription}</Text>
                        </Left>
                    </CardItem>
                    </TouchableOpacity>

                    <View
                        style = {{
                            borderColor: item.requestCategoryColor,
                            borderWidth: 3,
                            borderTopWidth: 0,
                        }}
                    >
                    <CardItem>
                    <Left>
                        <TouchableOpacity
                        style = {styles.buttonPositive}
                        onPress = {() => {
                            Alert.alert(
                                'Confirmation',
                                'Interested with this request?',
                                [
                                    {
                                        text: 'No',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Yes', 
                                        onPress: () => {                        
                                            const businessID = this.props.navigation.getParam('businessID')
                                            firebase.firestore().collection('chat').add({
                                                businessID : businessID,
                                                requestID : item.requestID,
                                            }).then(doc => {
                                                firebase.firestore().collection('chat').doc(doc.id).update({
                                                    chatID : doc.id
                                                })
                                                firebase.firestore().collection('request').doc(item.requestID)
                                                .collection('serviceProvider').doc(businessID).update({
                                                    serviceStatus : 'Negotiation',
                                                    requestStatus : 'responded',
                                                    responseDate : new Date().getDate() + '/' + (new Date().getMonth() +1)+ '/' + new Date().getFullYear(),
                                                    responseTime: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                                                    chatID : doc.id
                                                }).then(e => {
                                                    this.onRefresh()
                                                })
                                            })
                                        }
                                    }
                                ],
                                {cancelable: false},
                            );
                        }}
                        >
                        <Text style = {{color : 'black', fontSize: 20}}>Interested</Text>
                        </TouchableOpacity>
                    </Left> 
                    <Right>
                        <TouchableOpacity
                            style = {styles.buttonNegative}
                            onPress = {() => {
                                Alert.alert(
                                    'Confirmation',
                                    'Reject this request?',
                                    [
                                        {
                                            text: 'No',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Yes', 
                                            onPress: () => {                        
                                                const businessID = this.props.navigation.getParam('businessID');
                                                firebase.firestore().collection('request').doc(item.requestID)
                                                .collection('serviceProvider').doc(businessID).update({
                                                    requestStatus : 'declined'
                                                }).then(e => {
                                                    this.onRefresh()
                                                })
                                            }
                                        }
                                    ],
                                    {cancelable: false},
                                );
                            }}
                            >
                            <Text style = {{color : 'white', fontSize: 20}}>Decline</Text>
                        </TouchableOpacity>
                    </Right>
                    </CardItem>
                    </View>
                    </Card>
                )}
                }
                numColumns={1} 
                />
    
            </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    bar:{
        backgroundColor : Colors.primaryColor,
        flexDirection : 'row',
        height : 40,
        marginVertical: 10,
        alignItems : 'center'
    },
    buttonPositive:{
        backgroundColor : Colors.primaryColor,
        width : '80%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonNegative:{
        backgroundColor : 'black',
        width : '100%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonPositiveDisabled:{
        backgroundColor : Colors.primaryColor,
        opacity: 0.3,
        width : '80%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonNegativeDisabled:{
        backgroundColor : 'black',
        opacity: 0.3,
        width : '100%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    }

});

export default BusinessResponse;

