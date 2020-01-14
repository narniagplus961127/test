import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import {Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import uuid from "uuid";

class BusinessUploadPhoto extends Component {
    constructor(props){
        super(props);
        this.state = {
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            image5: null
        };
    }

    onNext(){
        const businessType= this.props.navigation.getParam('businessType');
        const selectedCategory= this.props.navigation.getParam('selectedCategory');
        const selectedCategoryColor= this.props.navigation.getParam('selectedCategoryColor');
        const Uname = this.props.navigation.getParam('Uname');
        const sID = this.props.navigation.getParam('sID');
        const crn = this.props.navigation.getParam('crn');
        const name = this.props.navigation.getParam('name');
        const ic = this.props.navigation.getParam('ic');
        const hp = this.props.navigation.getParam('hp');
        const serviceName = this.props.navigation.getParam('serviceName');
        const serviceDescrip = this.props.navigation.getParam('serviceDescrip');
        const wExp = this.props.navigation.getParam('wExp');

        this.props.navigation.navigate({ 
            routeName: 'BusinessLocation',
            params:{
                businessType : businessType,
                selectedCategory : selectedCategory,
                selectedCategoryColor: selectedCategoryColor,
                Uname: Uname,
                sID: sID,
                crn: crn,
                name: name,
                ic: ic,
                hp: hp,
                serviceName: serviceName,
                serviceDescrip: serviceDescrip,
                wExp: wExp,
                image1: this.state.image1,
                image2: this.state.image2,
                image3: this.state.image3,
                image4: this.state.image4,
                image5: this.state.image5
            }
        })
    }

    componentDidMount(){
        this.getPermissionAsync();
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
            console.log(error);
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
                console.log(error);
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
            console.log(error);
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
            console.log(error);
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
                console.log(error);
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
            console.log(error);
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
            console.log(error);
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
                console.log(error);
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
            console.log(error);
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
            console.log(error);
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

export default BusinessUploadPhoto;
