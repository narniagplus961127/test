import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList,
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

class RequestHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            businessList: [],
            refreshing: false,
            avatar: null
        }
    }

    getHistory(){
        var businessList =[];
        //check requestID is owned by current user
        var snapshot = firebase.firestore().collection('request').where('uid', '==', firebase.auth().currentUser.uid)
        snapshot.get().then(query => {
            query.forEach(doc => {
                doc.ref.collection('serviceProvider').where('serviceStatus', '==', 'Completed')
                .orderBy('completeDate', 'asc').orderBy('completeTime','asc').where('requestID', '==', doc.id)
                .get().then(subquery =>{
                    subquery.forEach(subinfo => {
                        var finalRating = null;
                        //push service provider info
                        businessList.push(subinfo.data())
                        //push requestInfo
                        firebase.firestore().collection('request').doc(subinfo.data().requestID)
                        .get().then(requestInfo => {
                            let businessList = [...this.state.businessList];
                            let index = businessList.findIndex(list => list.requestID === subinfo.data().requestID);
                            businessList[index] = {
                                ...businessList[index],
                                serviceType : requestInfo.data().serviceType}
                                this.setState({businessList : businessList})
                        })
                        //push business info
                        firebase.firestore().collection('business').doc(subinfo.data().businessID)
                        .get().then(businessInfo => {
                            let businessList = [...this.state.businessList];
                            let index = businessList.findIndex(list => list.requestID === subinfo.data().requestID);
                            businessList[index] = {
                                ...businessList[index],
                                businessName : businessInfo.data().businessName,
                                requestUserName : doc.data().requestUserName,
                                businessCategory : businessInfo.data().businessCategory,
                                businessCategoryColor : businessInfo.data().BusinessCategoryColor,
                                businessDescription : businessInfo.data().businessDescription,
                                businessImage1 : businessInfo.data().businessImage1
                            }
                                this.setState({businessList : businessList})
                        })
                        //push rating info
                        firebase.firestore().collection('business').doc(subinfo.data().businessID)
                        .collection('customer').doc(subinfo.data().requestID).get()
                        .then(customerinfo => {
                            finalRating = customerinfo.data().finalRating
                            let businessList = [...this.state.businessList];
                            let index = businessList.findIndex(list => list.requestID === subinfo.data().requestID);
                            businessList[index] = {
                                ...businessList[index],
                                finalRating: finalRating
                            }
                            this.setState({businessList})
                        }).catch(error => {

                        })
                        this.setState({businessList : businessList})
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
        this.setState({refreshing: false})
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
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
                keyExtractor={(item,index) => item.requestID}
                renderItem={({item}) => {
                    return (
                        <Card>
                        <TouchableOpacity
                            style = {{
                                borderColor: item.businessCategoryColor,
                                borderWidth: 3,
                                borderBottomWidth: 0,
                            }}
                            onPress={() => {
                                this.props.navigation.navigate({
                                    routeName: 'RequestView',
                                    params: {
                                        requestID : item.requestID,
                                        requestName: item.serviceType
                                    }
                                });
                            }}
                            >
                        <CardItem style = {styles.carditem}>
                            <Left>
                            <Body>
                                <Text style = {styles.cardtitle}>{item.serviceType}</Text>
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
                                            routeName: 'BusinessView',
                                            params: {
                                                businessID : item.businessID,
                                                businessName: item.businessName
                                            }
                                        });
                                    }}
                                >
                                <View style = {{flexDirection : 'row', justifyContent: 'center', alignItems : "center"}}>
                                    <Thumbnail small square source={{uri: item.businessImage1}} style = {{margin : 5}}/>
                                    <Text style = {{fontSize: 15, fontStyle: 'italic', color: 'black'}}>{item.businessName}</Text>
                                </View>
                                    <Text style = {{fontSize : 30, fontWeight: 'bold'}}>RM {item.servicePrice}</Text>
                                </TouchableOpacity>
                            </Right>
                        </CardItem>
                        </TouchableOpacity>
                        
                        <View
                            style = {{
                                borderColor: item.businessCategoryColor,
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
                                    routeName: 'RequestChat',
                                    params:{
                                        requestID : item.requestID,
                                        chatID : item.chatID,
                                        businessID : item.businessID,
                                        serviceStatus : item.serviceStatus,
                                        requestUserName: item.requestUserName,
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
    btnChat:{
        backgroundColor : Colors.primaryColor,
        width : '100%',
        height: 40,
        alignItems: 'center',
        justifyContent : 'center',
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

export default RequestHistory;

