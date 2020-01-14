import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';

class Register extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: '', emailValid: false, emailError: null, emailDisabled: true,
            password: '', passwordValid: false, passwordError: null, passwordDisabled: true,
            confirmPassword: '', confirmPasswordValid: false, confirmPasswordError: null, confirmPasswordDisabled: true,
            name:'', nameValid: false, nameError: null, nameDisabled: true,
            hp: '', hpValid: false, hpError: null, hpDisabled: true,
            gender:'', genderValid: false, genderError: null , genderDisabled: true,
            profile_picture: null,
            disabled: true
        };
    }

    onCreateAccount() {
        if ((this.state.emailValid && this.state.passwordValid && this.state.confirmPasswordValid 
        && this.state.nameValid && this.state.genderValid && this.state.hpValid) == true){
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((authData) => {
                this.props.navigation.navigate({ routeName: 'Login'}),

                firebase.firestore().collection('user').doc(authData.user.uid).set({
                    uid: authData.user.uid,
                    email: authData.user.email,
                    mobile_number: this.state.hp,
                    username: this.state.name,
                    profile_picture: this.state.profile_picture,
                    gender: this.state.gender,
                    createdDate_at: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear(),
                    createdTime_at: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                })
               
            },(error) => {
                Alert.alert(error.message);
                this.setState({emailValid: false}),
                this.setState({emailError: null}),

                this.setState({passwordValid: false}),
                this.setState({passwordError: null}),

                this.setState({confirmPasswordValid: false}),
                this.setState({confirmPasswordError: null})

                this.setState({emailDisabled: true}),
                this.setState({passwordDisabled: true}),
                this.setState({disabled: true})
            });
        }
    }

    validateForm(){
        if((this.state.emailDisabled && this.state.passwordDisabled && this.state.confirmPasswordDisabled 
            && this.state.nameDisabled && this.state.hpDisabled && this.state.genderDisabled) == false){
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
        else{
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
        else{           
            this.setState({passwordValid: false})
            this.setState({passwordError: 'This field is required.'})
            this.setState({passwordDisabled: true})
        }
    }

    validateConfirmPassword(){
        if (this.state.confirmPassword == ''){
            this.setState({confirmPasswrodValid: false})
            this.setState({confirmPasswordError: 'This field is required.'})
            this.setState({confirmPasswordDisabled: true})
        }
        else{
            if (this.state.confirmPassword !== this.state.password){
                this.setState({confirmPasswordValid: false}),
                this.setState({confirmPasswordError: 'Password do not match.'})
                this.setState({confirmPasswordDisabled: true})
            }
            else{
            this.setState({confirmPasswordValid: true})
            this.setState({confirmPasswordError: null})
            this.setState({confirmPasswordDisabled: false})
            }
        }
    }

    validateName(){
        if (this.state.name != ''){
            this.setState({nameValid: true})
            this.setState({nameError: null})
            this.setState({nameDisabled: false})
        }
        else{
            this.setState({nameValid: false})
            this.setState({nameError: 'This field is required.'})
            this.setState({nameDisabled: true})
        }
    }

    validateHp(){
        if (this.state.hp!= ''){
            this.setState({hpValid: true})
            this.setState({hpError: null})
            this.setState({hpDisabled: false})
        }
        else{
            this.setState({hpValid: false})
            this.setState({hpError: 'This field is required.'})
            this.setState({hpDisabled: true})
        }
    }

    validateGender(){
        if (this.state.gender != ''){
            this.setState({genderValid: true})
            this.setState({genderError: null})
            this.setState({genderDisabled: false})
        }
        else{
            this.setState({genderValid: false})
            this.setState({genderError: 'This field is required.'})
            this.setState({genderDisabled: true})
        }
    }

    render(){
        const isEmailCorrect = this.state.emailValid;
        const isPasswordCorrect = this.state.passwordValid;
        const isConfirmPasswordCorrect = this.state.confirmPasswordValid;
        const isNameCorrect = this.state.nameValid;
        const isHpCorrect = this.state.hpValid;
        const isGenderCorrect = this.state.genderValid;
        const isDisabled = this.state.disabled;

    return (

        <ScrollView style = {styles.screen}>
            <View style = {{
                margin: 10,
                alignItems : 'center'
            }}>
                <Text style = {styles.text}>Create an Account</Text>
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
            <Text style = {styles.label}>
                    Email
            </Text>
            <View style = {{alignItems : 'center'}}>
            <TextInput
                style={isEmailCorrect? styles.textinput : styles.error}
                keyboardType = 'email-address'
                placeholder='abc123@gmail.com'
                placeholderTextColor='white'
                autoCapitalize = 'none'
                autoCorrect = {false}
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
            <Text style = {styles.label}>
                Password
            </Text>
            <View style = {{alignItems : 'center'}}>
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

            <View>
            <Text style = {styles.label}>
                Confirmation of Password
            </Text>
            <View style = {{alignItems : 'center'}}>
                <TextInput
                    style={isConfirmPasswordCorrect? styles.textinput : styles.error}
                    secureTextEntry
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    placeholder='Re-type Password'
                    placeholderTextColor='white'
                    onChangeText={(text) => this.setState({confirmPassword: text})}
                    value={this.state.confirmPassword}
                    onEndEditing={()=>{
                        this.validateConfirmPassword(), 
                        this.validateForm()
                    }}
                />
            </View>
                <Text style = {{color: 'red', marginHorizontal: '10%'}}>{this.state.confirmPasswordError}</Text>
            </View>

            <View>
            <Text style = {styles.label}>
                Display Name
            </Text>
            <View style = {{alignItems : 'center'}}>
                <TextInput
                    style={isNameCorrect? styles.textinput : styles.error}
                    placeholder='Your Name'
                    placeholderTextColor='white'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({name: text})}
                    value={this.state.name}
                    onEndEditing={()=>{
                        this.validateName(), 
                        this.validateForm()
                    }}
                />
            </View>
                <Text style = {{color: 'red', marginHorizontal: '10%'}}>{this.state.nameError}</Text>
            </View>

            <View>
            <Text style = {styles.label}>
                Mobile Number
            </Text>
            <View style = {{alignItems : 'center'}}>
                <TextInput
                    style={isHpCorrect? styles.textinput : styles.error}
                    placeholder='012-3456789'
                    placeholderTextColor='white'
                    keyboardType= 'numbers-and-punctuation'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({hp: text})}
                    value={this.state.hp}
                    onEndEditing={()=>{
                        this.validateHp(), 
                        this.validateForm()
                    }}
                />
            </View>
                <Text style = {{color: 'red', marginHorizontal: '10%'}}>{this.state.hpError}</Text>
            </View>
            
            <KeyboardAvoidingView behavior = 'padding'>
            <View>
            <Text style = {styles.label}>
                Gender
            </Text>
            <View style = {{alignItems : 'center'}}>
                <TextInput
                    style={isGenderCorrect? styles.textinput : styles.error}
                    placeholder='Male / Female'
                    placeholderTextColor='white'
                    autoCapitalize = 'none'
                    autoCorrect = {true}
                    onChangeText={(text) => this.setState({gender: text})}
                    value={this.state.gender}
                    onEndEditing={()=>{
                        this.validateGender(), 
                        this.validateForm()
                    }}
                />
            </View>
                <Text style = {{color: 'red', marginHorizontal: '10%'}}>{this.state.genderError}</Text>
            </View>
            </KeyboardAvoidingView>

            <View style = {{alignItems : 'center', marginTop: '5%'}}>
                <TouchableOpacity
                    style = {isDisabled? styles.submitDisabled : styles.submit}
                    disabled = {isDisabled}
                    onPress={() =>  {
                        this.onCreateAccount();
                    }}
                >
                <Text style = {{fontSize: 20, fontWeight : 'bold'}}>
                    Register
                </Text>
                </TouchableOpacity>
            </View>

            <View style = {{alignItems: 'center', margin : 10}}>
                <Text style = {{color: 'white'}}>By registering, you accept our</Text>
                
                <View style = {{flexDirection : 'row'}}>
                    <TouchableOpacity
                    onPress={() => { }}>
                    <Text style = {{
                        textDecorationLine: 'underline',
                        color: Colors.primaryColor
                    }}>
                        Term of Use
                    </Text>
                    </TouchableOpacity>
                    
                    <Text style = {{color: 'white'}}> and </Text>
                    
                    <TouchableOpacity
                    onPress={() => { }}>
                    <Text style = {{
                        textDecorationLine: 'underline',
                        color: Colors.primaryColor
                    }}>
                        Privacy Policy
                    </Text>
                    </TouchableOpacity>

                </View>
            </View>

            <View style = {{
                marginTop : 50,
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style = {{color : 'white'}}>Already Have an Account?</Text>
            </View>

            <View style= {{
                    justifyContent : 'center',
                    alignItems : 'center'}}>
                <TouchableOpacity
                style = {styles.Signinsubmit}
                onPress={() =>  {
                    this.props.navigation.navigate({ routeName: 'Login'})
                }}>
                <Text style = {{fontSize: 20, fontWeight : 'bold'}}>
                    Sign In
                </Text>
                </TouchableOpacity>
            </View>


        </ScrollView>

    );
};
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
        marginHorizontal: '10%',
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
    Signinsubmit:{
        backgroundColor: Colors.primaryColor,
        height : 40,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: 10
    },
    error: {
        fontSize: 15,
        fontStyle: 'italic',
        marginHorizontal: '10%',
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
    label:{
        color: 'white', 
        fontSize: 20, marginHorizontal : '10%', 
        fontWeight: 'bold',
        marginTop: '5%'
    }
});

export default Register;

