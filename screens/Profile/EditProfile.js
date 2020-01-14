import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Button,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import uuid from "uuid";

class EditProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            gender: '',
            mobile: '',
            profilePic: null
        }
    } 

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
    }

    _isMounted = false;

    componentDidMount(){
        _isMounted = true;
        this.getPermissionAsync();
        const currentUID = firebase.auth().currentUser.uid
        firebase.firestore().collection('user').doc(currentUID).get()
        .then(getInfo => {
            this.setState({name: getInfo.data().username})
            this.setState({gender: getInfo.data().gender})
            this.setState({mobile: getInfo.data().mobile_number})
            this.setState({profilePic: getInfo.data().profile_picture})
        })
    }

    componentWillUnmount(){
        _isMounted = false;
    }

    onUpdate(){
        const currentUID = firebase.auth().currentUser.uid
        firebase.firestore().collection('user').doc(currentUID).update({
            username : this.state.name,
            gender : this.state.gender,
            mobile_number : this.state.mobile,
            profile_picture : this.state.profilePic
        })
        this.props.navigation.navigate({routeName : 'MyProfile'})
    }

    uriToBlob = (uri) => {  
        return new Promise((resolve, reject) => 
        {    
            const xhr = new XMLHttpRequest(); 
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new Error('uriToBlob failed'));
            };   
            xhr.responseType = 'blob';    
            xhr.open('GET', uri, true);
            xhr.send(null);  
        });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ profilePic: result.uri });
                return this.uriToBlob(this.state.profilePic)
            }
        }).then((blob) => {
            return this.uploadToFirebase(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            console.log(error);
        })
    }

    _cameraImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ profilePic: result.uri });
                return this.uriToBlob(this.state.profilePic)
            }
        }).then((blob) => {
            return this.uploadToFirebase(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            console.log(error);
        })
    };

    uploadToFirebase = (blob) => {  
        var UID = firebase.auth().currentUser.uid
        return new Promise(() =>{    
            firebase.storage().ref().child('user/' + UID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        profilePic : data
                    })
                })
            }).catch((error) => {
                console.log(error);
            })
        })
    }

    render(){
        return (
            <View style = {styles.screen}>
            <ScrollView style = {styles.screen}>   
                <KeyboardAvoidingView behavior = 'padding'>    
                <View style = {{alignItems: 'center', justifyContent: 'center', marginTop: '10%'}}>
                    {this.state.profilePic != null?
                    <Image
                    style = {{height: 150, width : 150}}
                    source = {{uri: this.state.profilePic}}
                    />
                    :                 
                    <Image
                    style = {{height: 150, width : 150}}
                    source = {require ('../../assets/profileicon.png')}
                    />}          
                </View>
                <View style ={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}>
                    <TouchableOpacity
                        style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                        onPress={() =>  {
                            this._pickImage()
                        }}>
                        <Ionicons name= 'ios-image' size = {40}/> 
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                        onPress={() =>  {
                            this._cameraImage()
                        }}>
                        <Ionicons name= 'ios-camera' size = {40}/> 
                    </TouchableOpacity>
                </View>

                <Text style = {styles.textLabel}>Name</Text>
                <TextInput
                    style={styles.textInput}
                    value= {this.state.name}
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({name: text})}
                />

                <Text style = {styles.textLabel}>Gender</Text>
                <TextInput
                    style={styles.textInput}
                    value= {this.state.gender}
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({gender: text})}
                />

                <Text style = {styles.textLabel}>Mobile Number</Text>
                <TextInput
                    style={styles.textInput}
                    value= {this.state.mobile}
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({mobile: text})}
                />
                </KeyboardAvoidingView>
            </ScrollView>    

                <TouchableOpacity
                    style={styles.buttonUpdate}
                    onPress={() =>  {
                        Alert.alert(
                            'Confirmation',
                            'Is profile information correct?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {text: 'OK', onPress: () => this.onUpdate()},
                            ],
                            {cancelable: false},
                          );
                    }}>
                    <Text style={{fontSize: 30, color: 'white'}}>Update</Text>
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    textLabel:{
        marginHorizontal: '5%',
        marginTop: '10%',
        fontSize: 15,
        fontWeight: 'bold'
    },
    textInput:{
        margin: '5%',
        fontSize: 20,
        color: 'black',
        borderBottomWidth : 1,
        borderBottomColor : 'black'
    },
    buttonUpdate: {
        marginTop: 10,
        height: 60,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default EditProfile;
