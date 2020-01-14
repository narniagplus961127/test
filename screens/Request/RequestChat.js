import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import { GiftedChat, Bubble, Day} from 'react-native-gifted-chat'

class RequestChat extends Component{
    constructor(props){
        super(props);
        this.state = {
            requestID: '',
            serviceStatus: '',
            servicePrice: '',
            businessList: [],
            refreshing: false,
            rating : null,
            message: [],
            MinPrice: '',
            MaxPrice: ''
        }
    }

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;

        this.getMessages(message =>
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message)
            }))
        );

        const businessID = this.props.navigation.getParam('businessID');
        const requestID = this.props.navigation.getParam('requestID');
        firebase.firestore().collection('request').doc(requestID)
        .collection('serviceProvider').onSnapshot(doc => {
            doc.docChanges().forEach(docinfo => {
                if (docinfo.doc.data().businessID == businessID){
                    this.setState({servicePrice : docinfo.doc.data().servicePrice})
                    this.setState({serviceStatus : docinfo.doc.data().serviceStatus})
                }
            })
        })

        firebase.firestore().collection('business').doc(businessID)
        .collection('customer').onSnapshot(doc => {
            doc.docChanges().forEach(docinfo => {
                if (docinfo.doc.data().requestID == requestID){
                    this.setState({rating : docinfo.doc.data().finalRating})
                }
            })
        })

        firebase.firestore().collection('business').doc(businessID).get().then(doc => {
            firebase.firestore().collection('category').where('categoryName', '==', doc.data().businessCategory).onSnapshot
            (catdoc => {
                catdoc.docChanges().forEach(catdocinfo => {
                    this.setState({ MinPrice : catdocinfo.doc.data().MinPrice})
                    this.setState({ MaxPrice : catdocinfo.doc.data().MaxPrice})
                })
            })
        })  
    }

 
    componentWillUnmount(){
        this._isMounted = false;
    }

    get user(){
        const requestID = this.props.navigation.getParam('requestID');
        const requestUserName = this.props.navigation.getParam('requestUserName');
        var avatar = this.props.navigation.getParam('avatar');
        if (avatar == null){
            avatar = '../../assets/profileicon.png';
        }
        return{
            _id: requestID,
            name: requestUserName,
            avatar: avatar
        }
    }

    parseMessage(snapshot) {
        const stampInSeconds = snapshot.doc.data().timestamp.seconds;
        const createdAt = new Date(stampInSeconds * 1000);
        const message = {
            _id: snapshot.doc.id,
            text: snapshot.doc.data().text,
            createdAt,
            user: {
                _id: snapshot.doc.data().user._id,
                name: snapshot.doc.data().user.name,
                avatar: snapshot.doc.data().user.avatar
            }
        };
        return message;
    };

    getMessages(callback){
        const chatID = this.props.navigation.getParam('chatID');
        firebase.firestore().collection('chat').doc(chatID).collection('message')
        .orderBy('timestamp').onSnapshot(snapshot => {
            const changes = snapshot.docChanges();
            changes.map(change => callback(this.parseMessage(change)));
        });
    };

    sendMessages(messages){
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {
            text,
            user,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date())
            };
            this.store(message);
        }
    };

    store(message){
        const chatID = this.props.navigation.getParam('chatID');
        firebase.firestore().collection('chat').doc(chatID).collection('message').add(message);
    };

    onAccept(){
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
                        const businessID = this.props.navigation.getParam('businessID'); 
                        var snapshot = await firebase.firestore().collection('request').doc(requestID)
                        .collection('serviceProvider').where('requestID', '==', requestID).get()
                        snapshot.forEach(doc => {
                            if(doc.data().businessID == businessID){
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
                    }
                }
            ],
            {cancelable: false},
        );
    }

    onDeclined(){
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
                        this.props.navigation.navigate({
                            routeName : 'Request'
                        })
                    }
                }
            ],
            {cancelable: false},
        );   
    }

    renderBubble(props){
        return (
            <Bubble
                {...props}
                textStyle = {{
                    left:{
                        color: 'black',
                    },
                    right: {
                        color: 'black',
                    },
                }}
                wrapperStyle = {{
                    left: {
                        backgroundColor: 'white',
                    },
                    right:{
                        backgroundColor: Colors.primaryColor,
                    }
                }}
            />
        );
    }

    renderDay(props) {
        return <Day {...props} textStyle={{color: 'black'}}/>
    }

    render(){
        return(
            <View  style = {styles.screen}>
                <View style = {styles.screen}>
                    <View style = {styles.chatbar}>
                        <Text style ={{fontSize: 20, color : 'white'}}>Chat</Text>
                    </View>

                    {Platform.OS === 'android' ? 
                    <KeyboardAvoidingView style = {{flex:1}} behavior = 'padding' keyboardVerticalOffset = {100}>
                        <GiftedChat                       
                            messages={this.state.messages}
                            onSend={messages => this.sendMessages(messages)}
                            user={this.user}
                            renderUsernameOnMessage = {true}
                            showAvatarForEveryMessage = {true}
                            renderBubble = {this.renderBubble}
                            renderDay = {this.renderDay}
                        />
                    </KeyboardAvoidingView>
                    :
                    <GiftedChat                       
                        messages={this.state.messages}
                        onSend={messages => this.sendMessages(messages)}
                        user={this.user}
                        renderUsernameOnMessage = {true}
                        showAvatarForEveryMessage = {true}
                        renderBubble = {this.renderBubble}
                        renderDay = {this.renderDay}
                    />
                    }
                </View>


            <View>
                {this.state.serviceStatus != 'Negotiation' ? 
                    this.state.serviceStatus == 'Hired' ? 
                    <View>
                        <View>
                            <TouchableOpacity
                                style = {styles.buttonDisable100}
                                disabled = {true}
                                onPress = {()=>{}}>
                                <Text style = {{fontSize: 20, color: 'white', fontStyle: 'italic'}}>
                                    Service - RM {this.state.servicePrice}
                                </Text>
                                <Text style = {{fontSize: 15, color: 'white'}}>
                                    Normal Price Range - RM {this.state.MinPrice} - {this.state.MaxPrice}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View>
                        <View>
                            {this.state.rating == null ?
                            <TouchableOpacity
                                style = {styles.buttonPositive100}
                                onPress = {()=>{
                                    this.props.navigation.navigate({ 
                                        routeName : 'Rate',
                                        params: {
                                            requestID : this.props.navigation.getParam('requestID'),
                                            businessID : this.props.navigation.getParam('businessID')
                                        }
                                    });

                                }}>
                                <Text style = {{fontSize: 25}}>
                                    Rate
                                </Text>
                            </TouchableOpacity> 
                            : 
                            <TouchableOpacity
                                style = {styles.buttonNegative100}
                                onPress = {()=>{}}
                                disabled = {true}>
                                <Text style = {{fontSize: 25, color: 'white', fontStyle: 'italic'}}>
                                    Thanks for your rating!
                                </Text>
                            </TouchableOpacity> 
                            }
                            
                            <TouchableOpacity
                                style = {styles.buttonDisable100}
                                disabled = {true}
                                onPress = {()=>{}}>
                                <Text style = {{fontSize: 20, color: 'white', fontStyle: 'italic'}}>
                                    Service - RM {this.state.servicePrice}
                                </Text>
                                <Text style = {{fontSize: 15, color: 'white'}}>
                                    Normal Price Range - RM {this.state.MinPrice} - {this.state.MaxPrice}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                :   
                    <View>
                        <View>
                            <TouchableOpacity
                                style = {styles.buttonDisable100}
                                disabled = {true}
                                onPress = {()=>{}}>
                                <Text style = {{fontSize: 20, color: 'white', fontStyle: 'italic'}}>
                                    Service - RM {this.state.servicePrice}
                                </Text>
                                <Text style = {{fontSize: 15, color: 'white'}}>
                                    Normal Price Range - RM {this.state.MinPrice} - {this.state.MaxPrice}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style = {{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style = {styles.buttonNegative50}
                                onPress = {()=>{
                                    this.onDeclined()
                                }}>
                                <Text style = {{fontSize: 25, color: 'white'}}>
                                    Decline
                                </Text>
                            </TouchableOpacity>
                                
                            <TouchableOpacity
                                style = {styles.buttonPositive50}
                                onPress = {()=>{
                                    this.onAccept()
                                }}>
                                <Text style = {{fontSize: 25}}>
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.backgroundColor,
        flex : 1
    },
    chatbar:{
        height : 40, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor : '#606060'
    },
    buttonNegative50:{
        height : 50,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent : 'center',
        width: '50%',
    },
    buttonPositive50:{
        height : 50,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent : 'center',
        width: '50%',
    },
    buttonDisable50:{
        height : 50,
        backgroundColor: '#606060',
        alignItems: 'center',
        justifyContent : 'center',
        width: '50%',
    },
    buttonNegative100:{
        height : 50,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent : 'center',
        width: '100%',
    },
    buttonPositive100:{
        height : 50,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent : 'center',
        width: '100%',
    },
    buttonDisable100:{
        height : 50,
        backgroundColor: '#606060',
        alignItems: 'center',
        justifyContent : 'center',
        width: '100%',
    }
})

export default RequestChat;