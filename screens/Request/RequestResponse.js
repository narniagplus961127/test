import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    Image,
    Alert,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
    FlatList,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import {
    Card, 
    CardItem,
    Body,
    Left,
    Thumbnail,
    Right
} from 'native-base';
import * as firebase from 'firebase';
import StarRating from 'react-native-star-rating';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

class RequestResponse extends Component {
    constructor(props){
        super(props);
        this.state = {
            requestID: '',
            price: '',
            businessList: [],
            refreshing: false,
            requestUserName: null,
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

    async getBusiness(){
        const requestID = this.props.navigation.getParam('requestID');  
        this.setState({ requestID : requestID });
        var businessList = [];
        var lat1 = null;
        var long1 = null;

        var location = await Location.getCurrentPositionAsync({enableHighAccuracy : true }).then(location => {
            lat1 = location.coords.latitude;
            long1 = location.coords.longitude
        })

        var snapshot =  await firebase.firestore().collection('request').doc(requestID)
        .collection('serviceProvider').where('requestStatus', '==', 'responded')
        snapshot.get().then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                var businessSnapShot = await firebase.firestore().collection('business')
                .where('businessID', '==', doc.data().businessID).get()
                businessSnapShot.forEach((Bdoc) => {
                    var averageRating = null;
                    var noCustomer = 1;
                    //push business list
                    businessList.push(Bdoc.data())
                    //push service provider info
                    // .doc(Bdoc.data().businessID).get()
                    firebase.firestore().collection('request').doc(requestID)
                    .collection('serviceProvider').where('businessID', '==', Bdoc.data().businessID)
                    .onSnapshot(doc => {
                        doc.docChanges().forEach(docinfo => {
                            var distance = this.distanceInKmBetweenEarthCoordinates(
                                lat1, 
                                long1, 
                                Bdoc.data().businessLocation.latitude, 
                                Bdoc.data().businessLocation.longitude
                            );

                            let businessList = [...this.state.businessList];
                            let index = businessList.findIndex(list => list.businessID === docinfo.doc.data().businessID);
                            businessList[index] = {
                                ...businessList[index],
                                serviceStatus: docinfo.doc.data().serviceStatus,
                                servicePrice: docinfo.doc.data().servicePrice,
                                responseDate : docinfo.doc.data().responseDate,
                                responseTime : docinfo.doc.data().responseTime,
                                chatID : docinfo.doc.data().chatID,
                                distance : distance
                            }
                            this.setState({businessList : businessList})
                        })
                    })
                    //push rating
                    firebase.firestore().collection('business').doc(doc.data().businessID)
                    .collection('customer').get()
                    .then(subdoc => {
                        subdoc.forEach(info => {
                            averageRating = (averageRating + info.data().finalRating) / noCustomer; 
                            noCustomer++;
                        })
                        let businessList = [...this.state.businessList];
                        let index = businessList.findIndex(list => list.businessID === doc.data().businessID);
                        businessList[index] = {
                            ...businessList[index],
                            averageRating: averageRating
                        }
                        this.setState({businessList : businessList})
                    })
                    this.setState({businessList : businessList})
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
        const requestID = this.props.navigation.getParam('requestID');  
        firebase.firestore().collection('request').doc(requestID).get().then(doc => {
            this.setState({requestUserName : doc.data().requestUserName})
        })

        firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).get()
        .then(doc => {
            this.setState({avatar : doc.data().profile_picture})
        })
        this.getBusiness(this.onBusinessReceived);   
        this.setState({refreshing: false})
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    render(){
        return (
            <View style = {styles.screen}>
                <ScrollView style = {{marginTop: 10}}
                refreshControl = {
                    <RefreshControl               
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.refreshing}/>                
                }>

                <FlatList
                data = {this.state.businessList}
                keyExtractor={(item,index) => item.businessID}
                renderItem={({item}) => {
                    return (
                        <Card>
                        <TouchableOpacity
                            style = {{
                                borderColor: item.BusinessCategoryColor,
                                borderWidth: 3,
                                borderBottomWidth: 0,
                            }}
                            onPress={() => {
                                this.props.navigation.navigate({
                                    routeName: 'BusinessView',
                                    params: {
                                        businessID : item.businessID,
                                        businessName: item.businessName
                                    }
                                });
                            }}
                            >
                        <CardItem style = {styles.carditem}>
                            <Left>
                            <Body>
                                <Text style = {styles.cardtitle}>{item.businessName}</Text>
                            </Body>
                            </Left>
                            <Right>
                                <TouchableOpacity
                                style = {{
                                    backgroundColor : item.BusinessCategoryColor,
                                    width : 100,
                                    height : 20,
                                    marginVertical : '5%',
                                    alignItems : 'center'
                                }}>
                                <Text style = {{fontWeight:'bold', fontStyle: 'italic'}}>{item.businessCategory}</Text>
                                </TouchableOpacity>
                            </Right>
                        </CardItem>
            
                        <CardItem style = {styles.cardcontent}>
                            <Left>
                            <Body>
                                <Thumbnail large square
                                source={{uri: item.businessImage1}} />
                                <StarRating
                                    disabled={true}
                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    maxStars={5}
                                    rating={item.averageRating}
                                    fullStarColor={Colors.primaryColor}
                                    starSize = {30}
                                />
                                <Text numberOfLines = {2} style = {styles.cardcontenttext}>{item.businessDescription}</Text>
                            </Body>
                            </Left>
            
                            <Right>
                                <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.distance} KM</Text>
                                <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.responseTime}</Text>
                                <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'grey'}}>{item.responseDate}</Text>
                                <Text style = {{fontSize : 30, fontWeight: 'bold'}}>RM {item.servicePrice}</Text>
                            </Right>
                        </CardItem>
                        </TouchableOpacity>
                        
                        <View
                            style = {{
                                borderColor: item.BusinessCategoryColor,
                                borderWidth: 3,
                                borderTopWidth: 0,
                            }}
                        >
                        <CardItem>
                            <Left>
                            <TouchableOpacity
                            disabled = {item.serviceStatus == 'Negotiation'? false : true}
                            style = {item.serviceStatus == 'Negotiation'? styles.buttonPositive : styles.buttonPositiveDisabled}
                            onPress = {() => {
                                Alert.alert(
                                    'Confirmation',
                                    'Accept this service provider?',
                                    [
                                        {
                                            text: 'No',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Yes', 
                                            onPress: async() => {                        
                                                const requestID = this.props.navigation.getParam('requestID'); 
                                                var snapshot = await firebase.firestore().collection('request').doc(requestID)
                                                .collection('serviceProvider').where('requestID', '==', requestID).get()
                                                snapshot.forEach(doc => {
                                                    if(doc.data().businessID == item.businessID){
                                                        firebase.firestore().collection('request').doc(requestID)
                                                        .collection('serviceProvider').doc(doc.data().businessID).update({
                                                            serviceStatus: 'Hired'
                                                        })
                                                    }
                                                    else{
                                                        firebase.firestore().collection('request').doc(requestID)
                                                        .collection('serviceProvider').doc(doc.data().businessID).update({
                                                            requestStatus : 'declined',
                                                            serviceStatus : 'declined'
                                                        })
                                                    }
                                                })
                                                this.onRefresh()  
                                            }
                                        }
                                    ],
                                    {cancelable: false},
                                );
                                
                            }}
                            >
                            <Text style = {{color : 'black', fontSize: 20}}>Deal</Text>
                            </TouchableOpacity>
                            </Left>

                            <Body>
                            <TouchableOpacity
                            style = {styles.buttonChat}
                            onPress = {() => {
                                this.props.navigation.navigate({
                                    routeName: 'RequestChat',
                                    params:{
                                        requestID : this.props.navigation.getParam('requestID'),
                                        chatID : item.chatID,
                                        businessID : item.businessID,
                                        serviceStatus : item.serviceStatus,
                                        requestUserName: this.state.requestUserName,
                                        avatar: this.state.avatar
                                    }
                                });
                            }}
                            >
                            <Text style = {{color : 'white', fontSize: 20}}>Chat</Text>
                            </TouchableOpacity>
                            </Body>

                            <Right>
                            <TouchableOpacity
                                disabled = {item.serviceStatus == 'Negotiation'? false : true}
                                style = {item.serviceStatus == 'Negotiation'? styles.buttonNegative : styles.buttonNegativeDisabled}
                                onPress = {() => {
                                    Alert.alert(
                                        'Confirmation',
                                        'Reject this service provider?',
                                        [
                                            {
                                                text: 'No',
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Yes', 
                                                onPress: () => {                        
                                                    const requestID = this.props.navigation.getParam('requestID');
                                                    firebase.firestore().collection('request').doc(requestID)
                                                    .collection('serviceProvider').doc(item.businessID).update({
                                                        requestStatus : 'declined',
                                                        serviceStatus : 'declined'
                                                    })
                                                    this.onRefresh()  
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
                    )
                }}
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
    carditem: {
        backgroundColor: 'black',
        alignItems: 'center',
        height: 40
    },
    cardtitle:{
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    cardcontent:{
        backgroundColor: 'white',
        padding: '5%'
    },
    cardcontenttext:{
        fontSize: 15,
        color: 'black'
    },
    buttonPositive:{
        backgroundColor : Colors.primaryColor,
        width : '100%',
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
    buttonChat:{
        backgroundColor : 'grey',
        width : '100%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonPositiveDisabled:{
        opacity: 0.3,
        backgroundColor : Colors.primaryColor,
        width : '100%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonNegativeDisabled:{
        opacity: 0.3,
        backgroundColor : 'black',
        width : '100%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center'
    }
});

export default RequestResponse;

