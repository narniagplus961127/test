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
import Colors from '../../constants/Colors';
import * as firebase from 'firebase'

class ForgotPassword extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '', 
            emailValid : false,
            emailError: null,
            disabled: true
        };
    }

    onResetPasswordPress(){
        if (this.state.emailValid == true){
            firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert('Password reset email has been sent.')
            },(error) => { 
                Alert.alert(error.message)
                this.setState({emailError: null})
                this.setState({emailValid: false})
                this.setState({disabled: true})
            })
        }
    }

    validateEmail(){
        if (this.state.email != ''){
            this.setState({emailValid: true})
            this.setState({emailError: null})
            this.setState({disabled: false})
        }
        else{
            this.setState({emailValid: false})
            this.setState({emailError: 'This field is required.'})
            this.setState({disabled: true})
        }
    }

    render(){
        const isCorrect = this.state.emailValid;
        const isDisabled = this.state.disabled;

        return (
        <ScrollView style = {styles.screen}>

            <View style = {{
                margin: 10,
                alignItems : 'center'
            }}>
                <Text style = {styles.text}>Forgot Password</Text>
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
            <View style = {{alignItems : 'center'}}>
                <TextInput
                    style={isCorrect? styles.textinput : styles.error}
                    keyboardType = 'email-address'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    placeholder='Email address'
                    placeholderTextColor='white'
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                    onEndEditing={()=>{
                        this.validateEmail()
                    }}
                />
            </View>
                <Text style = {{color: 'red', marginHorizontal: '10%', marginBottom: 10}}>{this.state.emailError}</Text>
            </View>

            <View style = {{alignItems : 'center'}}>
                <TouchableOpacity
                    style = {isDisabled? styles.submitDisabled : styles.submit}
                    disabled = {isDisabled}
                    onPress={() =>  {
                        this.onResetPasswordPress();
                        
                    }}>
                    <Text style = {{fontSize: 20, fontWeight : 'bold'}}>
                        Reset Password
                    </Text>
                </TouchableOpacity>
            </View>

            <View style = {{alignItems: 'center', margin : 10}}>
                <TouchableOpacity
                    onPress={() => { 
                        this.props.navigation.navigate({ routeName: 'Login'})
                    }}>
                    <Text style = {{
                        textDecorationLine: 'underline',
                        color: 'white'
                    }}>
                        Back to Login?
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

export default ForgotPassword;

