import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import uuid from "uuid";


class RequestUploadPhoto extends Component {
    constructor(props){
        super (props);
        this.state = {
            image: null
        }
    }

    componentDidMount(){
        this.getPermissionAsync();
    }


    onNext(){
        const selectedCategory= this.props.navigation.getParam('selectedCategory');
        const serviceType = this.props.navigation.getParam('serviceType');
        const selectedCategoryColor= this.props.navigation.getParam('categoryColor');
        const requestDescrip = this.props.navigation.getParam('requestDescrip');
        const requestContact = this.props.navigation.getParam('requestContact');
        const date = this.props.navigation.getParam('date');
        const time = this.props.navigation.getParam('time');

        this.props.navigation.navigate({ 
            routeName: 'RequestLocation',
            params:{
                selectedCategory : selectedCategory,
                selectedCategoryColor : selectedCategoryColor,
                serviceType : serviceType,
                requestDescrip : requestDescrip,
                requestContact : requestContact,
                date : date,
                time : time,
                requestImage : this.state.image
            }
        })
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

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1,1],
        }).then((result) => {
            if (!result.cancelled) {
                this.setState({ image: result.uri });
                return this.uriToBlob(this.state.image)
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
                this.setState({ image: result.uri });
                return this.uriToBlob(this.state.image)
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
        var UUID = uuid.v4()
        return new Promise(() =>{    
            firebase.storage().ref().child('request/' + UUID ).put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(data => {
                    this.setState({
                        image : data
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
            <View>
                <Image 
                    style = {styles.image}
                    source={require('../../assets/breadcrumb/3.png')} />
            </View>

            <View style = {{marginTop: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <View style = {{marginHorizontal: '5%', alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {{borderWidth: 1}}>
                        <Image source={{ uri: this.state.image }} style={{ width: 250, height: 250 }}/>
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
                </View>
            </View>

            </ScrollView>
            
            <View>
                <TouchableOpacity
                style={styles.buttonSubmit}
                onPress={() =>  {
                    this.onNext()
                }}>
                <Text style={styles.submitText}>Next</Text>
                </TouchableOpacity>
            </View>
            
        </View>
        );
    }
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    image: {
        width: '100%',
        height: 50,
        marginTop: 20
    },
    buttonSubmit: {
        marginTop: 10,
        height: 60,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'black',
        padding: 5
    },
    submitText:{
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
    }
});

export default RequestUploadPhoto;
