import React, {Component} from 'react';
import {
    View, 
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
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
import StarRating from 'react-native-star-rating';

class BusinessHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            requestList: [],
            refreshing: false,
            avatar: null
        }
    }

    getHistory(){
        var requestList =[];

        var snapshot = firebase.firestore().collection('business').where('uid', '==', firebase.auth().currentUser.uid)
        snapshot.get().then(query=> {
            query.docChanges().forEach(doc => {
                firebase.firestore().collection('request').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(subdoc => {
                        subdoc.doc.ref.collection('serviceProvider').where('serviceStatus', '==', 'Completed')
                        .where('businessID', '==', doc.doc.id).get()
                        .then(subquery => {
                            subquery.docChanges().forEach(subinfo => {
                                if (doc.doc.data().businessID == subinfo.doc.data().businessID){
                                    var finalRating = null;
                                    //push request list
                                    requestList.push(subdoc.doc.data())
                                    //push business list
                                    firebase.firestore().collection('business').doc(subinfo.doc.data().businessID)
                                    .get().then(businessInfo => {
                                        let requestList = [...this.state.requestList];
                                        let index = requestList.findIndex(list => list.requestID === subinfo.doc.data().requestID);
                                        requestList[index] = {
                                            ...requestList[index],
                                            businessUserName : businessInfo.data().businessUserName,
                                            businessCategory : businessInfo.data().businessCategory,
                                            businessCategoryColor : businessInfo.data().BusinessCategoryColor,
                                            businessName: businessInfo.data().businessName}
                                            this.setState({requestList : requestList})
                                    })
                                    //push serviceProvider list
                                    firebase.firestore().collection('request').doc(subinfo.doc.data().requestID)
                                    .collection('serviceProvider').doc(subinfo.doc.data().businessID).get()
                                    .then(serviceinfo => {
                                        let requestList = [...this.state.requestList];
                                        let index = requestList.findIndex(list => list.requestID === serviceinfo.data().requestID);
                                        requestList[index] = {
                                            ...requestList[index],
                                            servicePrice: serviceinfo.data().servicePrice,
                                            serviceStatus: serviceinfo.data().serviceStatus,
                                            completeDate : serviceinfo.data().completeDate,
                                            completeTime : serviceinfo.data().completeTime,
                                            businessID : serviceinfo.data().businessID,
                                            chatID: serviceinfo.data().chatID}
                                            this.setState({requestList : requestList})
                                    })
                                    //push rating
                                    firebase.firestore().collection('business').doc(subinfo.doc.data().businessID)
                                    .collection('customer').doc(subinfo.doc.data().requestID).get()
                                    .then(customerinfo => {
                                        finalRating = customerinfo.data().finalRating
                                        let requestList = [...this.state.requestList];
                                        let index = requestList.findIndex(list => list.requestID === customerinfo.data().requestID);
                                        requestList[index] = {
                                            ...requestList[index],
                                            finalRating: finalRating
                                        }
                                        this.setState({requestList})
                                    }).catch(error => {

                                    })
                                    this.setState({requestList : requestList})
                                }
                            })
                        })
                    })
                })
            })
        })
    }

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
        firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).get().then(doc => {
            this.setState({ avatar : doc.data().profile_picture})
        })
        this.getHistory();
        this.setState({refreshing: false}); 
    }

    componentWillUnmount(){
        _isMounted = false;
    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
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
                                backgroundColor : item.businessCategoryColor,
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
                            <StarRating
                                disabled={true}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                maxStars={5}
                                rating={item.finalRating}
                                fullStarColor={Colors.primaryColor}
                                starSize = {30}
                            />
                            <Text>
                                <Text style = {styles.cardcontenttext}>Completed on</Text>
                                <Text style = {styles.cardcontenttext}>{' '}</Text>
                                <Text style = {styles.cardcontenttext}>{item.completeTime}</Text>
                                <Text style = {styles.cardcontenttext}>{' in '}</Text>
                                <Text style = {styles.cardcontenttext}>{item.completeDate}</Text>
                            </Text>
                        </Body>
                        </Left>
        
                        <Right>
                            <TouchableOpacity 
                                style ={{
                                    backgroundColor : item.businessCategoryColor,
                                    alignItems : 'center',
                                    justifyContent : 'center',
                                    width : '90%',
                                    elevation: 7,
                                    shadowRadius: 5,
                                    shadowOpacity: 1.0,
                                    borderBottomWidth : 3,
                                    borderRightWidth : 3,
                                    borderColor : 'grey',
                                }}
                                onPress = {() => {
                                    this.props.navigation.navigate({
                                        routeName: 'RequestView',
                                        params: {
                                            requestID : item.requestID,
                                            requestName: item.serviceType
                                        }
                                    });
                                }}
                            >
                                <View style = {{flexDirection : 'row', justifyContent: 'center', alignItems : "center"}}>
                                    <Thumbnail small square source={{uri: item.requestImage}} style = {{margin : 5}}/>
                                    <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'black'}}>{item.serviceType}</Text>
                                </View>
                                <Text style = {{fontSize : 30, fontWeight: 'bold'}}>RM {item.servicePrice}</Text>
                            </TouchableOpacity>
                        </Right>
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
                        style = {styles.btnChat}
                        onPress = {() => {
                            this.props.navigation.navigate({
                                routeName: 'BusinessChat',
                                params:{
                                    requestID : item.requestID,
                                    chatID : item.chatID,
                                    businessID : item.businessID,
                                    serviceStatus : item.serviceStatus,
                                    businessUserName: item.businessUserName,
                                    avatar: this.state.avatar
                                }
                            });
                        }}
                        >
                        <Text style = {{color : 'black', fontSize: 20}}>Chat</Text>
                        </TouchableOpacity>
                        </Left>
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
    btnChat: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: '100%'
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
    }
});

export default BusinessHistory;

