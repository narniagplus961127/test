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

class RequestScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            requestList : [],
            refreshing: false,
            active: false,
            autoUpdate: 0,
        }
    }

    interval = 0;

    getRequest(){
        var requestList = [];
        var CurrentUID = firebase.auth().currentUser.uid
        // firebase.firestore().collection('request').where('uid', '==',CurrentUID).where('serviceStatus', '==', '') 
        // .orderBy('requestCreatedDate').get().then(doc => {
        //     doc.forEach(docinfo => {
        //         requestList.push(docinfo.data())
        //     })
        //     this.setState({requestList : requestList})
        // }).catch(error => {})

        firebase.firestore().collection('request').where('uid', '==',CurrentUID).where('serviceStatus', '==', '') 
        .orderBy('requestCreatedDate').onSnapshot(doc => {
            doc.docChanges().forEach(docinfo => {
                if(docinfo.doc.data().requestID === undefined){
                    this.onRefresh()
                }
                else{
                    if (docinfo.type === 'added'){
                        requestList.push(docinfo.doc.data())
                        this.setState({requestList : requestList})
                    }
                    else if (docinfo.type === 'modified'){
                        let requestList = [...this.state.requestList];
                        let index = requestList.findIndex(list => list.requestID === docinfo.doc.data().requestID);
                        requestList[index] = docinfo.doc.data();
                        this.setState({requestList : requestList})
                    }
                    else if (docinfo.type === 'removed'){
                        let index = requestList.findIndex(list => list.requestID === docinfo.doc.data().requestID);
                        requestList.splice(index,1)
                        this.setState({requestList : requestList})
                    }
                }
            })
        })
    }     

    _isMounted = false;

    componentDidMount(){
        _isMounted = true;
        this.getRequest();
        this.setState({refreshing: false});
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
            <FlatList 
                data={this.state.requestList} 
                keyExtractor={(item,index) => item.requestID} 
                renderItem={({ item }) => { 
                    return (
                    <View>
                    <TouchableOpacity
                        style = {{
                            borderRadius: 10,
                            borderColor: item.requestCategoryColor,
                            borderWidth: 2
                        }}
                        onPress={() => {
                            this.props.navigation.navigate({
                                routeName: 'RequestProfile',
                                params:{
                                    requestID : item.requestID,
                                    requestName : item.serviceType
                                }
                            });
                        }}
                        >
                    <Card>
                    <CardItem style = {styles.carditem}>
                        <Left>
                        <Body>
                          <Text numberOfLines = {1} style = {styles.cardtitle}>{item.serviceType}</Text>
                        </Body>
                        </Left>
                        <Right>
                            <TouchableOpacity
                            style = {{
                                backgroundColor : item.requestCategoryColor,
                                width : 100,
                                height : 20,
                                alignItems : 'center',
                                justifyContent: 'center'
                            }}>
                            <Text style = {{fontWeight: 'bold', fontStyle: 'italic'}}>{item.requestCategory}</Text>
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
        
                    <CardItem style = {styles.cardcontent1}>
                        <Left>
                            <Left>
                                <Thumbnail large square
                                source={{uri: item.requestImage}} />
                            </Left>
                            <Left>
                                <Text>
                                    <Text style = {{fontStyle: 'italic', color: 'grey'}}>Made on</Text>
                                    <Text style = {{fontStyle: 'italic', color: 'grey'}}>{' '}</Text>
                                    <Text style = {{fontStyle: 'italic', color: 'grey'}}>{item.requestCreatedTime}</Text>
                                    <Text style = {{fontStyle: 'italic', color: 'grey'}}>{' in '}</Text>
                                    <Text style = {{fontStyle: 'italic', color: 'grey'}}>{item.requestCreatedDate}</Text>
                                </Text>
                            </Left>
                        </Left>
                        <Right>
                            <Text numberOfLines = {2} style = {styles.cardcontenttext}>{item.requestDescription}</Text>
                        </Right>
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
                        routeName : 'RequestCategory'
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
        backgroundColor: 'white',
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

export default RequestScreen;

