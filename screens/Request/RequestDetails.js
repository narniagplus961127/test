import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Button,
    SafeAreaView,
    Alert,
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
    Right,
    Fab,
    Thumbnail
} from 'native-base';
import ImageView from 'react-native-image-view';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';

class RequestDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            uid: '',
            profile_pic: null,
            createDate: '',
            createTime: '',
            requestUserName: '',
            serviceType: '',
            category: '',
            description:'',
            contact: '',
            categoryColor: '',
            gender: '',
            serviceDate: '',
            serviceTime: '',
            image: null,
            active: false,
            refreshing: false,
            images: [],
            viewPhoto: false,
            region : {
                latitude : null,
                longitude : null,
                latitudeDelta:  0.045,
                longitudeDelta: 0.0045,
            },   
            address: null
        }
    } 

    getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted'){
            console.log('Permission to access location was denied');
        }
    }

    displayDetails(){
        const requestID = this.props.navigation.getParam('requestID');    
        firebase.firestore().collection('request').doc(requestID)
        .get().then((getInfo) => {
            this.setState({uid : getInfo.data().uid})
            this.setState({createDate: getInfo.data().requestCreatedDate})
            this.setState({createTime: getInfo.data().requestCreatedTime})
            this.setState({requestUserName: getInfo.data().requestUserName})
            this.setState({serviceType: getInfo.data().serviceType})
            this.setState({category: getInfo.data().requestCategory})
            this.setState({description: getInfo.data().requestDescription})
            this.setState({contact: getInfo.data().requestContact})
            this.setState({categoryColor: getInfo.data().requestCategoryColor})
            this.setState({gender: getInfo.data().requestGender})
            this.setState({serviceDate: getInfo.data().serviceDate})
            this.setState({serviceTime: getInfo.data().serviceTime})
            this.setState({image: getInfo.data().requestImage})
            this.setState({region: getInfo.data().requestLocation})
            this.setState({address: getInfo.data().requestAddress})
        }).then(() => {
            firebase.firestore().collection('user').doc(this.state.uid)
            .get().then((getProfilePic) => {
                this.setState({profile_pic : getProfilePic.data().profile_picture})
            })
        }).catch(error => {})
    }

    onViewPhoto(){
        const requestID = this.props.navigation.getParam('requestID');   
        firebase.firestore().collection('request').doc(requestID)
        .get().then((getPhoto) => {
            this.state.images.push({
                source: {
                    uri: getPhoto.data().requestImage
                },
                width: 800,
                height: 800,
            })
        }).catch(error => {})
    }

    ViewPhoto(){
        return(
            <ImageView
                images={this.state.images}
                isVisible={this.state.isImageViewVisible}
                onClose = {()=>{
                    this.setState({
                        viewPhoto: false
                    })
                }}
            />
        )
    }


    componentDidMount(){
        this.getLocationAsync()
        this.displayDetails();
        this.onViewPhoto();
        this.setState({refreshing: false})            
    }

    componentWillUnmount(){

    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
    }

    onDeleteBusiness(){
        const requestID = this.props.navigation.getParam('requestID');    
        firebase.firestore().collection('request').doc(requestID).collection('serviceProvider').doc().delete();
        firebase.firestore().collection('request').doc(requestID).delete();
        this.props.navigation.navigate({ routeName: 'Request'});
    }

    onAlertDelete(){
        Alert.alert(
            'Delete Confirmation',
            'Are you sure to delete?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                 },
                 {
                    text: 'Yes', 
                    onPress: () => this.onDeleteBusiness()
                },
            ],  
            {cancelable: false},
          );
          this.onRefresh()
    }

    render(){
        return (
            <View style = {styles.screen}>
            <ScrollView 
            style = {styles.screen}
            refreshControl = {
                <RefreshControl               
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.refreshing}/>                
            }
            >
                <View style = {{backgroundColor : 'white'}}>
                <View style = {{alignItems : 'center',margin : 10}}>
                    <Text>
                        <Text style = {styles.contentText2}>Made on</Text>
                        <Text style = {styles.contentText2}>{' '}</Text>
                        <Text style = {styles.contentText2}>{this.state.createTime}</Text>
                        <Text style = {styles.contentText2}>{' in '}</Text>
                        <Text style = {styles.contentText2}>{this.state.createDate}</Text>
                    </Text>
                </View>
    
                <View style = {{margin : 10}}>
                    <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                        {this.state.profile_pic != null? 
                        <Image
                            style = {{height: 80, width : 80}}
                            source = {{uri: this.state.profile_pic}}
                        />
                        : <Ionicons name= 'md-contact' size = {80}/> }
                        <View style= {{justifyContent: 'center'}}>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style = {{                                        
                                    fontSize : 20,
                                    fontWeight : 'bold',
                                    marginHorizontal : 10,
                                }}>{this.state.requestUserName}</Text>
                                {this.state.gender != ''? 
                                    (this.state.gender.toLowerCase() == 'male'? 
                                        <Ionicons name= 'md-male' size = {20} style = {{color : 'blue'}}/> 
                                        :<Ionicons name= 'md-female' size = {20} style = {{color : 'red'}}/> )
                                : null }
                            </View>
                            <Text style = {styles.contentText2}>{this.state.contact}</Text>
                        </View>
                    </View>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'md-bookmark' size = {30}/> 
                    <Text style = {styles.contentText}>Category</Text>
                </View>
                <View style = {{marginHorizontal: 10, width: 150, height: 40, backgroundColor: this.state.categoryColor, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style = {{fontSize: 15, margin: 10, fontWeight:'bold', fontStyle: 'italic'}}>{this.state.category}</Text>
                </View>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'ios-brush' size = {30}/> 
                    <Text style = {styles.contentText}>Description</Text>
                </View>
                <Text style = {styles.contentText2}>{this.state.description}</Text>
                </View>
    
                <View style = {{margin : 10}}>
                    <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                        <Ionicons name= 'md-calendar' size = {30}/>     
                        <Text style = {styles.contentText}>Service Date</Text>
                    </View>
                    <Text style = {styles.contentText2}>{this.state.serviceDate}</Text>
                </View>

                <View style = {{margin : 10}}>
                    <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                        <Ionicons name= 'md-time' size = {30}/>     
                        <Text style = {styles.contentText}>Service Time</Text>
                    </View>
                    <Text style = {styles.contentText2}>
                        <Text style = {styles.contentText2}>{this.state.serviceTime}</Text>
                        <Text style = {styles.contentText2}>{' '}</Text>
                        <Text style = {styles.contentText2}>hours</Text>
                    </Text>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'md-images' size = {30}/>   
                    <Text style = {styles.contentText}>Photos</Text>
                </View>
                <TouchableOpacity
                    style = {{margin : 10}}
                    onPress = {() => {
                        this.setState({
                            viewPhoto: true
                        })
                    }}>
                    <View style = {{flexDirection: 'row'}}>
                        <Image style = {styles.image} source = {{uri: this.state.image}}/>  
                    </View> 
                </TouchableOpacity>
                </View>
                            
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'ios-home' size = {30}/>   
                    <Text style = {styles.contentText}>Address</Text>
                </View>
                <Text style = {styles.contentText2}>{this.state.address}</Text>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'ios-compass' size = {30}/>   
                    <Text style = {styles.contentText}>Location</Text>
                </View>
                    <TouchableOpacity
                        style = {{
                            flex:1,
                            flexDirection: 'row', 
                            alignItems : 'center', 
                            justifyContent : 'center', 
                            backgroundColor: 'white',
                            borderBottomWidth : 3,
                            borderRightWidth : 3,
                            borderColor : Colors.primaryColor,
                            elevation: 7,
                            shadowRadius: 5,
                            shadowOpacity: 1.0,
                            width: '100%',
                            height: '20%'
                        }}
                        onPress = {() => {
                            this.props.navigation.navigate({ 
                                routeName : 'RequestMap',
                                params : {
                                    location : this.state.region,
                                    requestName : this.props.navigation.getParam('requestName')
                                }
                            })
                        }}
                    >
                        <Ionicons name= 'md-map' size ={40} style ={{margin: 10}}/>
                        <Text>
                            <Text style = {{fontSize: 30, color: 'blue'}}>G</Text>
                            <Text style = {{fontSize: 30, color: 'red'}}>o</Text>
                            <Text style = {{fontSize: 30, color: 'yellow'}}>o</Text>
                            <Text style = {{fontSize: 30, color: 'blue'}}>g</Text>
                            <Text style = {{fontSize: 30, color: 'green'}}>l</Text>
                            <Text style = {{fontSize: 30, color: 'red'}}>e</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>

                {this.state.viewPhoto? this.ViewPhoto() : null}
            </ScrollView>
                
                <Fab
                    active={this.state.active}
                    direction='up'
                    style={{ backgroundColor: 'black', position: 'absolute', bottom: 5, right: 5}}
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Ionicons name= 'ios-settings' size = {30} />
                        <Button 
                            style={{ backgroundColor: 'red' }}
                            onPress = {() => this.onAlertDelete()}>
                        <Ionicons name= 'ios-trash' size = {30}/>
                        </Button>
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
    contentText: {
        fontSize : 20,
        fontWeight : 'bold',
        margin : 10
    },
    contentText2: {
        fontSize : 15,
        margin : 10,
        color : 'grey'
    },
    image: {
        height: 200,
        width: 200
    },
});

export default RequestDetails;
