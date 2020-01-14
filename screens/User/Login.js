import React, { Component } from 'react';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    StyleSheet
} from 'react-native';
import { Item, Input, Label } from 'native-base';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import firestore from 'firebase/firestore';



class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '', emailValid: false, emailError: null, emailDisabled: true,
            password: '', passwordValid: false, passwordError: null, passwordDisabled: true,
            disabled: true,

        };
    }

    async loginWithFacebook() {
        const {type, token} = await Facebook.logInWithReadPermissionsAsync(
            '1373494622806110', {permissions: ['public_profile']})

        if(type == 'success'){
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            
            firebase.auth().signInWithCredential(credential).catch((error) => {
                console.log(error)
            })

        }
        else{
            console.log(error)
        }
    }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {

              return true;
            }
          }
        }
        return false;
      }

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);

        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();

          if (!this.isUserEqual(googleUser, firebaseUser)) {

            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            );

            firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result){
                console.log('user is signed in');
                if(result.additionalUserInfo.isNewUser){
                    firebase
                    .firestore()
                    .collection('user')
                    .doc(result.user.uid)
                    .set({
                        uid: result.user.uid,
                        email: result.user.email,
                        mobile_number: result.user.phoneNumber,
                        username: result.user.displayName,
                        gender: result.additionalUserInfo.profile.gender,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        createdDate_at: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear(),
                        createdTime_at: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                    })
                    .then(function(snapshot){

                    })
                }else{
                    firebase
                    .firestore().collection('user').doc(
                        result.user.uid
                    ).update({
                        last_logged_in_Date: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear(),
                        last_logged_in_Time: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                    })
                }                
            })
            .catch(function(error) {
                console.log(error.message);
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this)
        );
      }

    signInWithGoogleAsync = async() => {
        try {
          const result = await Google.logInAsync({
            behaviour: 'web',
            androidClientId: '488159684515-ag0s5vad1pa96rvodgkj8vsru4cogitg.apps.googleusercontent.com',
            iosClientId: '488159684515-d4duu50iu4opopumlcu74cjgknnrdokq.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        });
      
          if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }

    onLoginPress () {
        if((this.state.emailValid && this.state.passwordValid) == true){
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then( () => {
                this.props.navigation.navigate({ routeName: 'Service'})
            }, (error) => {
                Alert.alert(error.message),
                this.setState({emailValid: false}),
                this.setState({emailError: null}),

                this.setState({passwordValid: false}),
                this.setState({passwordError: null})

                this.setState({emailDisabled: true}),
                this.setState({passwordDisabled: true}),
                this.setState({disabled: true})
            });
        }
    }

    validateForm(){
        if((this.state.emailDisabled && this.state.passwordDisabled) == false){
            this.setState({disabled: false})
        }
        else{
            this.setState({disabled: true})
        }
    }

    validateEmail(){
        if (this.state.email != ''){
            this.setState({emailValid: true})
            this.setState({emailError: null})
            this.setState({emailDisabled: false})
        }
        else {
            this.setState({emailValid: false})
            this.setState({emailError: 'This field is required.'})
            this.setState({emailDisabled: true})
        }
    }

    validatePassword(){
        if (this.state.password != ''){
            this.setState({passwordValid: true})
            this.setState({passwordError: null})
            this.setState({passwordDisabled: false})
        }
        else {
            this.setState({passwordValid: false})
            this.setState({passwordError: 'This field is required.'})
            this.setState({passwordDisabled: true})
        }
    }
    
    render(){
        const isEmailCorrect = this.state.emailValid;
        const isPasswordCorrect = this.state.passwordValid;
        const isDisabled = this.state.disabled;

        return (
        <ScrollView style = {styles.screen}>

            <View style = {{
                margin: 10,
                alignItems : 'center'
            }}>
                <Text style = {styles.text}>Welcome</Text>
            </View>

            <View style = {{
                alignItems : 'center'
            }}>
                <Image 
                    style = {styles.logo}
                    source={require('../../assets/moumantai.png')} />
            </View>

            <View style = {{alignItems : 'center'}}>
                <Text style = {styles.logoText}>MouManTai</Text>
            </View>

            <View>
            <View style = {{alignItems : 'center', justifyContent: 'center'}}>
                <TextInput
                    style={isEmailCorrect? styles.textinput : styles.error}
                    keyboardType = 'email-address'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    placeholder='Email address'
                    placeholderTextColor='white'
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                    onEndEditing={()=>{
                        this.validateEmail(), 
                        this.validateForm()
                    }}
                    
                />
            </View>
            <Text style = {{color: 'red', marginHorizontal: '10%'}}>{this.state.emailError}</Text>
            </View>

            <View>
            <View style = {{alignItems : 'center', justifyContent: 'center'}}>
                <TextInput
                    style={isPasswordCorrect? styles.textinput : styles.error}
                    secureTextEntry
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    placeholder='Password'
                    placeholderTextColor='white'
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    onEndEditing={()=>{
                        this.validatePassword(),
                        this.validateForm()
                    }}
                />
            </View>
            <Text style = {{color: 'red', marginHorizontal: '10%'}}>{this.state.passwordError}</Text>
            </View>

            <View style = {{alignItems : 'center'}}>
                <TouchableOpacity
                    style = {isDisabled? styles.submitDisabled : styles.submit}
                    disabled = {isDisabled}
                    onPress={() =>  {
                        this.onLoginPress();
                    }}
                >
                <Text style = {{fontSize: 20, fontWeight : 'bold'}}>
                    Sign In
                </Text>
                </TouchableOpacity>
            </View>

            <View style = {{alignItems: 'center', margin : 10}}>
                <TouchableOpacity
                onPress={() => { 
                    this.props.navigation.navigate({ routeName: 'ForgotPassword'})
                }}>
                <Text style = {{
                    textDecorationLine: 'underline',
                    color: 'white'
                }}>
                    Forgot Password?
                </Text>
                </TouchableOpacity>
            </View>
                
            <View style = {{
                justifyContent : 'center',
                alignItems : 'center',
                margin : 20
            }}>   
                <Image 
                    style = {{
                        margin : 10
                    }}
                    source={require('../../assets/Or.png')} />
            </View> 
                
            <View style = {{
                flexDirection : 'row',
                justifyContent : 'center'
            }}>
                <TouchableOpacity
                    onPress={() => { 
                        this.loginWithFacebook();
                    }}>
                <Image 
                    style = {{
                        margin : 10,
                        height : 60,
                        width : 60
                    }}
                    source={require('../../assets/fb.png')} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        this.signInWithGoogleAsync();
                    }}> 
                <Image 
                    style = {{
                        margin : 10,                        
                        height : 60,
                        width : 60
                    }}
                    source={require('../../assets/Google.png')} />
                </TouchableOpacity>   
            </View>

            <View style = {{
                margin : 20,
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style = {{color : 'white'}}>Need an Account?</Text>
            </View>

            <View style= {{
                    justifyContent : 'center',
                    alignItems : 'center'}}>
                <TouchableOpacity
                style = {styles.Registersubmit}
                onPress={() =>  {
                    this.props.navigation.navigate({ routeName: 'Register'});
                }}>
                <Text style = {{fontSize: 20, fontWeight : 'bold'}}>
                    Create an Account
                </Text>
                </TouchableOpacity>
            </View>


        </ScrollView>
    );
    }
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black'
    },
    text:{
        margin: '5%',
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    logoText:{
        margin: '5%',
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold'
    },
    logo:{
        height: 150,
        width: 150 
    },
    textinput: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        height: 40,
        width: '80%',
        color: 'white',
        borderBottomWidth: 1,
        borderColor: 'yellow',
    },
    submit:{
        backgroundColor: Colors.primaryColor,
        height : 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        margin: 10
    },
    Registersubmit:{
        backgroundColor: Colors.primaryColor,
        height : 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: 10
    },
    error: {
        fontSize: 15,
        margin: 10,
        padding: 10,
        height: 40,
        width: '80%',
        color: 'white',
        borderBottomWidth: 1,
        borderColor: 'red',
    },
    submitDisabled:{
        backgroundColor: Colors.primaryColor,
        opacity: 0.3,
        height : 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        margin: 10
    },
});

export default Login;

