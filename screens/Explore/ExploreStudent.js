import React, {Component} from 'react';
import {
    View, 
    Image,
    TouchableOpacity,
    ScrollView,
    Text,
    Button,
    SafeAreaView,
    RefreshControl,
    FlatList,
    StyleSheet
} from 'react-native';
import {
    Card, 
    CardItem,
    Body,
    Left,
    Thumbnail,
    Right,
    Fab
} from 'native-base';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import StarRating from 'react-native-star-rating';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

class ExploreStudent extends Component {
    constructor(props){
        super(props);
        this.state = {
            businessList : [],
            refreshing: false,
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

    _isMounted = false;

    async getBusiness(businessReceived){
        var businessList = [];
        var lat1 = null;
        var long1 = null;
        
        var location = await Location.getCurrentPositionAsync({enableHighAccuracy : true }).then(location => {
            lat1 = location.coords.latitude;
            long1 = location.coords.longitude
        })

        var snapshot = await firebase.firestore().collection('business').where('businessType', '==','student') 
        .orderBy('businessName').get()
    
        snapshot.forEach((doc) => {
            var averageRating = null;
            var noCustomer = 1;
            businessList.push(doc.data())

            firebase.firestore().collection('business').doc(doc.data().businessID)
            .collection('customer').get()
            .then(subdoc => {
                subdoc.forEach(info => {
                    averageRating = (averageRating + info.data().finalRating) / noCustomer; 
                    noCustomer++;
                })
                var distance = this.distanceInKmBetweenEarthCoordinates(
                    lat1, 
                    long1, 
                    doc.data().businessLocation.latitude, 
                    doc.data().businessLocation.longitude
                );
                let businessList = [...this.state.businessList];
                let index = businessList.findIndex(list => list.businessID === doc.data().businessID);
                businessList[index] = {
                    ...businessList[index],
                    averageRating: averageRating,
                    distance : distance
                }
                this.setState({businessList})
            })
        });
    
        businessReceived(businessList);  
    }     

    onBusinessReceived = (businessList) => {
        this.setState(prevState => ({
            businessList: prevState.businessList = businessList,
        }))
    }
  
    componentDidMount(){
        this.getLocationAsync();
        this._isMounted = true;
        this.getBusiness(this.onBusinessReceived);
        this.setState({refreshing: false})
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
    }

    onSortName(){
        this.state.businessList.sort(function(a,b){
            return (a.businessName.toLowerCase().localeCompare(b.businessName.toLowerCase()));
        })
        this.setState({businessList : this.state.businessList})
    }

    onSortDistance(){
        this.state.businessList.sort(function(a,b){
            return (a.distance - b.distance);
        })
        this.setState({businessList : this.state.businessList})
    }

    render(){
        return (
            <View style = {styles.screen}>
                <View style = {{
                    backgroundColor : Colors.primaryColor,
                    height : 50,
                    alignItems : 'center',
                    justifyContent : 'center',
                    marginVertical: 15,
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity
                        style = {{
                            marginHorizontal: 10,
                            width: '40%',
                            height: 30,
                            backgroundColor: 'black',
                            shadowOpacity: 1,
                            shadowRadius: 5,
                            elevation: 7,
                            alignItems : 'center',
                            justifyContent : 'center',
                        }}
                        onPress = {() => {
                            this.onSortName()
                        }}
                    >
                        <Text style = {{color: 'white', fontSize: 15}}>By Name</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style = {{
                            marginHorizontal: 10,
                            width: '40%',
                            height: 30,
                            backgroundColor: 'black',
                            shadowOpacity: 1,
                            shadowRadius: 5,
                            elevation: 7,
                            alignItems : 'center',
                            justifyContent : 'center',
                        }}
                        onPress = {() => {
                            this.onSortDistance()
                        }}
                    >
                        <Text style = {{color: 'white', fontSize: 15}}>By Distance</Text>
                    </TouchableOpacity>
                </View>

                <FlatList 
                style = {styles.screen}
                data={this.state.businessList} 
                keyExtractor={(item,index) => item.businessID} 
                renderItem={({ item }) => {
                    return (
                        <Card>
                            <TouchableOpacity
                                style = {{                             
                                    borderRadius: 10,
                                    borderColor: item.BusinessCategoryColor,
                                    borderWidth: 2
                                }}
                                onPress = {() => {
                                    this.props.navigation.navigate({
                                        routeName: 'BusinessView',
                                        params : {
                                            businessID : item.businessID,
                                            businessName: item.businessName
                                        }
                                        
                                    });
                                }}>
                                <CardItem>
                                <Left>
                                    <Thumbnail large square
                                    source={{uri: item.businessImage1}} />
                                <Body>
                                    <Text style = {{fontSize: 18, fontWeight : 'bold'}}>{item.businessName}</Text>
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
                                    <Text>{item.businessUserName}</Text>
                                </Body>

                                <Right>
                                    <Text>{item.distance} KM</Text>
                                    <TouchableOpacity
                                    style = {{
                                        backgroundColor : item.BusinessCategoryColor,
                                        width : 80,
                                        height : 30,
                                        marginVertical : '5%',
                                        alignItems : 'center',
                                        justifyContent: 'center'
                                    }}>
                                    <Text style = {{fontSize : 12, fontStyle: 'italic', fontWeight:'bold'}}>{item.businessCategory}</Text>
                                    </TouchableOpacity>
                                </Right>
                                </Left>
                                </CardItem>
                            </TouchableOpacity>
                        </Card>
                    );
                }} 
                numColumns={1} 
                ListEmptyComponent = {
                    <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                        <Text>Loading ... </Text>
                    </View>
                }
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.refreshing}
                />  

                <Fab
                    style={{ backgroundColor: 'black', position: 'absolute', bottom: 5, right: 5}}
                    onPress={() => {
                        this.props.navigation.navigate({
                            routeName: 'ServiceMap'
                        })
                    }}>
                        <Ionicons name='md-map' size={30}/>
                </Fab>
            </View>
        );
        
        }
    }   


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    filterImage : {
        height : 100,
        width : 100,
        margin: 20,
    }
});

export default ExploreStudent;

