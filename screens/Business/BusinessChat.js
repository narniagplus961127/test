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

class BusinessChat extends Component {
    constructor(props){
        super(props);
        this.state = {
            refreshing: false,
            serviceStatus: '',
            servicePrice: null,
            message: [],
            MinPrice: '',
            MaxPrice: ''
        }
    }

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
        const businessID = this.props.navigation.getParam('businessID');
        const requestID = this.props.navigation.getParam('requestID');

        this.getMessages(message =>
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message)
            }))
        );
        firebase.firestore().collection('request').doc(requestID)
        .collection('serviceProvider').onSnapshot(doc => {
            doc.docChanges().forEach(docinfo => {
                if (docinfo.doc.data().businessID == businessID){
                    this.setState({servicePrice : docinfo.doc.data().servicePrice})
                    this.setState({serviceStatus : docinfo.doc.data().serviceStatus})
                    this.rejected()
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

    rejected(){
        if (this.state.serviceStatus == 'declined'){
            Alert.alert(
                'Service Reject',
                'You are rejected by the customer',
                [
                    {
                        text: 'OK', 
                        onPress: () => {}
                    }
                ],
                {cancelable: false},
            );   
            this.props.navigation.navigate({
                routeName : 'Business'
            })
        }
    }

    get user(){
        const businessID = this.props.navigation.getParam('businessID');
        const businessUserName = this.props.navigation.getParam('businessUserName');
        const avatar = this.props.navigation.getParam('avatar');
        return{
            _id: businessID,
            name: businessUserName,
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

    onDecline(){
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
                        const requestID = this.props.navigation.getParam('requestID');
                        firebase.firestore().collection('request').doc(requestID)
                        .collection('serviceProvider').doc(businessID).update({
                            requestStatus : 'declined',
                            serviceStatus : 'declined'
                        })
                        this.props.navigation.navigate({
                            routeName : 'Business'
                        })
                    }
                }
            ],
            {cancelable: false},
        );
    }

    onQuote(){
        this.props.navigation.navigate({ 
            routeName : 'BusinessQuote',
            params: {
                businessID : this.props.navigation.getParam('businessID'),
                requestID : this.props.navigation.getParam('requestID')
            }
        })
    }

    onMarkComplete(){
        Alert.alert(
            'Confirmation',
            'Mark this service complete?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes', 
                    onPress: () => {                        
                        const businessID = this.props.navigation.getParam('businessID');
                        const requestID = this.props.navigation.getParam('requestID');
                        firebase.firestore().collection('request').doc(requestID).update({
                            serviceStatus : 'Completed'
                        })
                        firebase.firestore().collection('request').doc(requestID)
                        .collection('serviceProvider').doc(businessID).update({
                            serviceStatus : 'Completed',
                            requestStatus : 'Completed',
                            completeDate : new Date().getDate() + '/' + (new Date().getMonth() +1)+ '/' + new Date().getFullYear(),
                            completeTime : new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                        })

                        if(this.state.servicePrice < this.state.MinPrice){
                            console.log(this.state.servicePrice)
                            firebase.firestore().collection('business').doc(businessID).get().then(doc => {
                                firebase.firestore().collection('category').doc(doc.data().businessCategory).update({
                                    MinPrice : this.state.servicePrice
                                })
                            }) 
                        }
                        if(this.state.servicePrice > this.state.MaxPrice){
                            console.log(this.state.servicePrice)
                            firebase.firestore().collection('business').doc(businessID).get().then(doc => {
                                firebase.firestore().collection('category').doc(doc.data().businessCategory).update({
                                    MaxPrice : this.state.servicePrice
                                })
                            }) 
                        }
                    }
                }
            ],
            {cancelable: false},
        );
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
                {this.state.serviceStatus != 'Negotiation'? 
                <View>
                    {this.state.serviceStatus == 'Hired'?                             
                        <TouchableOpacity
                            style = {styles.buttonPositive100}
                            onPress = {()=>{
                                this.onMarkComplete()
                            }}>
                            <Text style = {{fontSize: 25}}>
                                Mark Complete
                            </Text>
                        </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style = {styles.buttonNegative100}
                        disabled = {true}
                        onPress = {()=>{}}>
                        <Text style = {{fontSize: 25, color: 'white',fontStyle: 'italic'}}>
                            Service is completed
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
                    
                    <View  style = {{flexDirection: 'row'}}>
                        <TouchableOpacity
                            style = {styles.buttonNegative50}
                            onPress = {()=>{
                                this.onDecline()
                            }}>
                            <Text style = {{fontSize: 25, color: 'white'}}>
                                Decline
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style = {styles.buttonPositive50}
                            onPress = {()=>{
                                this.onQuote()
                            }}>
                            {this.state.servicePrice == null ?
                                <Text style = {{fontSize: 25}}>
                                    Quote
                                </Text> 
                                : 
                                <Text style = {{fontSize: 25}}>
                                    Edit Quote
                                </Text>
                            }
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

export default BusinessChat;