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
import Textarea from 'react-native-textarea';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import uuid from "uuid";

class EditBusiness extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            gender: '',
            mobile: '',
            businessDescription: '',
            businessWExp: '',
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            image5: null
        }
    } 

    componentDidMount(){
        this.getPermissionAsync();
        const businessID = this.props.navigation.getParam('businessID'); 
        firebase.firestore().collection('business').doc(businessID).get()
        .then(getInfo => {
            this.setState({name: getInfo.data().businessUserName})
            this.setState({gender: getInfo.data().businessGender})
            this.setState({mobile: getInfo.data().businessUserHP})
            this.setState({businessDescription: getInfo.data().businessDescription})
            this.setState({businessWExp: getInfo.data().businessWorkingExp})
            this.setState({image1 : getInfo.data().businessImage1})
            this.setState({image2 : getInfo.data().businessImage2})
            this.setState({image3 : getInfo.data().businessImage3})
            this.setState({image4 : getInfo.data().businessImage4})
            this.setState({image5 : getInfo.data().businessImage5})
        })
    }

    onUpdate(){
        const businessID = this.props.navigation.getParam('businessID');
        firebase.firestore().collection('business').doc(businessID).update({
            businessUserName : this.state.name,
            businessGender : this.state.gender,
            businessUserHp : this.state.mobile,
            businessDescription : this.state.businessDescription,
            businessWorkingExp: this.state.businessWExp,
            businessImage1 : this.state.image1,
            businessImage2 : this.state.image2,
            businessImage3 : this.state.image3,
            businessImage4 : this.state.image4,
            businessImage5 : this.state.image5,
        })
        this.props.navigation.navigate({routeName : 'BusinessProfile'})
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

    //1st upload
    _pickImage1 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image1: result.uri });
                return this.uriToBlob(this.state.image1)
            }
        }).then((blob) => {
            return this.uploadToFirebase1(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    }

    _cameraImage1 = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image1: result.uri });
                return this.uriToBlob(this.state.image1)
            }
        }).then((blob) => {
            return this.uploadToFirebase1(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    };

    uploadToFirebase1 = (blob) => {  
        var UUID = uuid.v4()
        return new Promise(() =>{    
            firebase.storage().ref().child('business/' + UUID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        image1 : data
                    })
                })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    //2nd upload
    _pickImage2 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image2: result.uri });
                return this.uriToBlob(this.state.image2)
            }
        }).then((blob) => {
            return this.uploadToFirebase2(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    }

    _cameraImage2 = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image2: result.uri });
                return this.uriToBlob(this.state.image2)
            }
        }).then((blob) => {
            return this.uploadToFirebase2(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    };

    uploadToFirebase2 = (blob) => {  
        var UUID = uuid.v4()
        return new Promise(() =>{    
            firebase.storage().ref().child('business/' + UUID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        image2 : data
                    })
                })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    //3rd upload
    _pickImage3 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image3: result.uri });
                return this.uriToBlob(this.state.image3)
            }
        }).then((blob) => {
            return this.uploadToFirebase3(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    }
    
    _cameraImage3 = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image3: result.uri });
                return this.uriToBlob(this.state.image3)
            }
        }).then((blob) => {
            return this.uploadToFirebase3(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    };

    uploadToFirebase3 = (blob) => {  
        var UUID = uuid.v4()
        return new Promise(() =>{    
            firebase.storage().ref().child('business/' + UUID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        image3 : data
                    })
                })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    //4th upload
    _pickImage4 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image4: result.uri });
                return this.uriToBlob(this.state.image4)
            }
        }).then((blob) => {
            return this.uploadToFirebase4(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    }

    _cameraImage4 = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image4: result.uri });
                return this.uriToBlob(this.state.image4)
            }
        }).then((blob) => {
            return this.uploadToFirebase4(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    };

    uploadToFirebase4 = (blob) => {  
        var UUID = uuid.v4()
        return new Promise(() =>{    
            firebase.storage().ref().child('business/' + UUID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        image4 : data
                    })
                })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    //5th upload
    _pickImage5 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image5: result.uri });
                return this.uriToBlob(this.state.image5)
            }
        }).then((blob) => {
            return this.uploadToFirebase5(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    }

    _cameraImage5 = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image5: result.uri });
                return this.uriToBlob(this.state.image5)
            }
        }).then((blob) => {
            return this.uploadToFirebase5(blob)
        }).then((snapshot) => {
            console.log('File uploaded');
        }).catch((error) => {
            throw error;
        })
    };

    uploadToFirebase5 = (blob) => {  
        var UUID = uuid.v4()
        return new Promise(() =>{    
            firebase.storage().ref().child('business/' + UUID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        image5 : data
                    })
                })
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    render(){
        return (
            <View style = {styles.screen}>
            <ScrollView style = {styles.screen}>   
                <KeyboardAvoidingView behavior = 'padding'>    
                <Text style = {styles.textLabel}>Fullname</Text>
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

                <Text style = {styles.textLabel}>Business Description</Text>
                <Textarea
                    style = {styles.styleArea}
                    multiline={true}
                    maxLength={1000}
                    value= {this.state.businessDescription}
                    onChangeText={(text) => this.setState({businessDescription: text})}
                />          

                <Text style = {styles.textLabel}>Business Working Experience</Text>
                <Textarea
                    style = {styles.styleArea}
                    multiline={true}
                    maxLength={1000}
                    value= {this.state.businessWExp}
                    onChangeText={(text) => this.setState({businessWExp: text})}
                />  
                </KeyboardAvoidingView>
                
                <Text style = {styles.textLabel}>Photo</Text>
                <View style = {{marginVertical : '15%'}}></View>
                <View style = {{marginTop: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {{marginHorizontal: '5%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{borderWidth: 1}}>
                            <Image source={{ uri: this.state.image1 }} style={{ width: 150, height: 150 }}/>
                        </View>

                        <View style ={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._pickImage1()
                                }}>
                                <Ionicons name= 'ios-image' size = {40}/> 
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._cameraImage1()
                                }}>
                                <Ionicons name= 'ios-camera' size = {40}/> 
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {{marginHorizontal: '5%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{borderWidth: 1}}>
                            <Image source={{ uri: this.state.image2 }} style={{ width: 150, height: 150 }}/>
                        </View>

                        <View style ={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._pickImage2()
                                }}>
                                <Ionicons name= 'ios-image' size = {40}/> 
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._cameraImage2()
                                }}>
                                <Ionicons name= 'ios-camera' size = {40}/> 
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style = {{marginTop: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {{marginHorizontal: '5%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{borderWidth: 1}}>
                            <Image source={{ uri: this.state.image3 }} style={{ width: 150, height: 150 }}/>
                        </View>

                        <View style ={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._pickImage3()
                                }}>
                                <Ionicons name= 'ios-image' size = {40}/> 
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._cameraImage3()
                                }}>
                                <Ionicons name= 'ios-camera' size = {40}/> 
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {{marginHorizontal: '5%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{borderWidth: 1}}>
                            <Image source={{ uri: this.state.image4 }} style={{ width: 150, height: 150 }}/>
                        </View>

                        <View style ={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._pickImage4()
                                }}>
                                <Ionicons name= 'ios-image' size = {40}/> 
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._cameraImage4()
                                }}>
                                <Ionicons name= 'ios-camera' size = {40}/> 
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style = {{marginTop: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {{marginHorizontal: '5%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style = {{borderWidth: 1}}>
                            <Image source={{ uri: this.state.image5 }} style={{ width: 150, height: 150 }}/>
                        </View>

                        <View style ={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._pickImage5()
                                }}>
                                <Ionicons name= 'ios-image' size = {40}/> 
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5}}
                                onPress={() =>  {
                                    this._cameraImage5()
                                }}>
                                <Ionicons name= 'ios-camera' size = {40}/> 
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> 
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
    styleArea: {
        margin: '5%',
        height: 150,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        padding: 2.5,
        textAlignVertical: 'top'
    }
});

export default EditBusiness;
