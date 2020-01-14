import React, {Component}from 'react';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
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
    Fab,
    Right
} from 'native-base';
import * as firebase from 'firebase';
import StarRating from 'react-native-star-rating';

class BusinessScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            refresh: 1,
            businessList : [],
            refreshing: false,
            active: false,
            averageRating: 0,
            noRating: 0,
        }
    }

    interval = 0;

    getBusiness(){
        var CurrentUID = firebase.auth().currentUser.uid
        var businessList = [];
        firebase.firestore().collection('business').where('uid', '==',CurrentUID) 
        .orderBy('businessCreatedDate').onSnapshot(docs => {
            docs.docChanges().forEach(doc => {
                if(doc.doc.data().businessID === undefined){
                    this.onRefresh()
                }
                else{
                    if(doc.type === 'added'){
                        var averageRating = null;
                        var noCustomer = 1;
                        businessList.push(doc.doc.data())
                        this.setState({businessList : businessList}) 

                        firebase.firestore().collection('business').doc(doc.doc.data().businessID)
                        .collection('customer').get()
                        .then(subdoc => {
                            subdoc.forEach(info => {
                                averageRating = (averageRating + info.data().finalRating) / noCustomer; 
                                noCustomer++;
                            })
                            let businessList = [...this.state.businessList];
                            let index = businessList.findIndex(list => list.businessID === doc.doc.data().businessID);
                            businessList[index] = {
                                ...businessList[index],
                                averageRating: averageRating
                            }
                            this.setState({businessList})
                        }).catch(error => {})
                    }
                    else if(doc.type === 'modified'){
                        var averageRating = null;
                        var noCustomer = 1;
                        let businessList = [...this.state.businessList];
                        let index = businessList.findIndex(list => list.businessID === doc.doc.data().businessID);
                        businessList[index] = doc.doc.data();
                        this.setState({businessList : businessList}) 

                        firebase.firestore().collection('business').doc(doc.doc.data().businessID)
                        .collection('customer').get()
                        .then(subdoc => {
                            subdoc.forEach(info => {
                                averageRating = (averageRating + info.data().finalRating) / noCustomer; 
                                noCustomer++;
                            })
                            let businessList = [...this.state.businessList];
                            let index = businessList.findIndex(list => list.businessID === doc.doc.data().businessID);
                            businessList[index] = {
                                ...businessList[index],
                                averageRating: averageRating
                            }
                            this.setState({businessList})
                        }).catch(error => {})
                    }
                    else if(doc.type === 'removed'){
                        let index = businessList.findIndex(list => list.businessID === doc.doc.data().businessID);
                        businessList.splice(index,1)
                        this.setState({businessList : businessList})
                    }
                }
            });
        })
    }     

    _isMounted = false;

    componentDidMount(){
        _isMounted = true;
        this.getBusiness();
        this.setState({refreshing: false})
    }

    componentWillUnmount(){
        _isMounted = false;
        clearInterval(this.interval)
    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
    }

    render(){
        return(
        <View style = {styles.screen}>
            <View>
                <Text style = {styles.text}>M Credit : </Text>
            </View>

            <View style = {styles.buttonposition}>
                <TouchableOpacity
                style={styles.button}
                onPress={() => {

                }}
                >
                <Text style={styles.buttonText}>Purchase Credits</Text>
                </TouchableOpacity>
            </View>

            <View style = {styles.businessposition}>
                <TouchableOpacity
                style={styles.businessbar}>
                <Ionicons name= 'ios-briefcase' size = {30} color='black'/>
                <Text style={styles.businessText}>Business</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList 
                data={this.state.businessList} 
                keyExtractor={(item,index) => item.businessID} 
                renderItem={({ item }) => {
                    return (
                    <View>
                    <TouchableOpacity
                        style = {{
                            borderRadius: 10,
                            borderColor: item.BusinessCategoryColor,
                            borderWidth: 2
                        }}
                        onPress={() => {
                            this.props.navigation.navigate({
                                routeName: 'BusinessProfile',
                                params:{
                                    businessID : item.businessID,
                                    businessName : item.businessName
                                }
                            });
                        }}
                        >
                    <Card>
                    <CardItem style = {styles.carditem}>
                        <Left>
                        <Body>
                          <Text numberOfLines = {1} style = {styles.cardtitle}>{item.businessName}</Text>
                        </Body>
                        </Left>
                        <Right>
                            <TouchableOpacity
                            style = {{
                                backgroundColor : item.BusinessCategoryColor,
                                width : 100,
                                height : 20,
                                alignItems : 'center',
                                justifyContent: 'center'
                            }}>
                            <Text style = {{fontWeight: 'bold', fontStyle: 'italic'}}>{item.businessCategory}</Text>
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
        
                    <CardItem style = {styles.cardcontent1}>
                        <Text>
                            <Text style = {{fontStyle: 'italic', color: 'grey'}}>Joined since</Text>
                            <Text style = {{fontStyle: 'italic', color: 'grey'}}>{' '}</Text>
                            <Text style = {{fontStyle: 'italic', color: 'grey'}}>{item.businessCreatedDate}</Text>
                        </Text>
                    </CardItem>

                    <CardItem style = {styles.cardcontentstar}>
                        <Left>
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
                        </Left>
                        <Right>
                        <Thumbnail large square
                            source={{uri: item.businessImage1}} />
                        </Right>
                    </CardItem>

                    <CardItem footer style = {styles.cardcontent2}>
                        <Text numberOfLines = {2} style = {styles.cardcontenttext}>{item.businessDescription}</Text>
                    </CardItem>
                    </Card>
                    </TouchableOpacity> 
                    </View>
                )
            }}
            numColumns={1} 
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            />    

            <Fab
                style={{ backgroundColor: 'black', position: 'absolute', bottom: 5, right: 5}}
                position= 'bottomRight'
                onPress={() => {
                    this.props.navigation.navigate({
                        routeName : 'BusinessCategory'
                    })
                }}>
                <Ionicons name= 'md-add' size = {100} />
            </Fab>
            </View>
    )}
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    text:{
        margin: '5%',
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    button:{
        backgroundColor: 'black',
        height : 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    buttonposition:{
        marginLeft: '5%',
        marginRight: '5%'
    },
    businessposition:{
        marginTop: '10%',
        backgroundColor: Colors.primaryColor,
        
    },
    businessbar:{
        marginHorizontal: '5%',
        flexDirection: 'row',
        height: 50,
        alignItems : 'center'
    },
    businessText:{
        color: 'black',
        fontSize: 20,
        marginLeft: 15,
        fontWeight: 'bold'
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
    cardcontent1:{
        height: 40,
        backgroundColor: 'white',
        paddingHorizontal: '5%'
    },
    cardcontentstar:{
        height: 40,
        backgroundColor: 'white',
        paddingHorizontal: '5%'
    },
    cardcontent2:{
        height: 60,
        backgroundColor: 'white',
        paddingHorizontal: '5%'
    },
    cardcontenttext:{
        fontSize: 15,
        color: 'black'
    },
    addbusinessText:{
        color: 'black',
        fontSize: 15,
        marginLeft: 10
    },
});

export default BusinessScreen;

