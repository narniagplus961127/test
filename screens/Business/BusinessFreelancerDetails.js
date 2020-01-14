import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import Textarea from 'react-native-textarea';
import Colors from '../../constants/Colors';
import { Dimensions } from 'react-native';


class BusinessFreelancerDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:'', nameValid: false, nameError: null, nameDisabled: true,
            ic: '', icValid: false, icError: null, icDisabled: true,
            hp: '', hpValid: false, hpError: null, hpDisabled: true,
            serviceName:'', serviceNameValid: false, serviceNameError: null , serviceNameDisabled: true,
            serviceDescrip:'', serviceDescripValid: false, serviceDescripError: null , serviceDescripDisabled: true,
            wExp:'', wExpValid: false, wExpError: null , wExpDisabled: true,
            disabled: true
        };
    }

    onNext(){
        const businessType= this.props.navigation.getParam('businessTypeF');
        const selectedCategory= this.props.navigation.getParam('selectedCategory');
        const selectedCategoryColor= this.props.navigation.getParam('selectedCategoryColor');

        if((this.state.nameValid && this.state.icValid && this.state.hpValid
            && this.state.serviceNameValid && this.state.serviceDescripValid && this.state.wExpValid) == true){
                this.props.navigation.navigate({ 
                    routeName: 'BusinessUploadPhoto',
                    params:{
                        businessType : businessType,
                        selectedCategory : selectedCategory,
                        selectedCategoryColor: selectedCategoryColor,
                        name: this.state.name,
                        ic: this.state.ic,
                        hp: this.state.hp,
                        serviceName: this.state.serviceName,
                        serviceDescrip: this.state.serviceDescrip,
                        wExp: this.state.wExp
                    }
                })
        }
    }

    validateForm(){
        if((this.state.nameDisabled && this.state.icDisabled && this.state.hpDisabled
            && this.state.serviceNameDisabled && this.state.serviceDescripDisabled && this.state.wExpDisabled) == false){
            this.setState({disabled: false})
        }
        else{
            this.setState({disabled: true})
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

    validateIC(){
        if (this.state.ic != ''){
            this.setState({icValid: true})
            this.setState({icError: null})
            this.setState({icDisabled: false})
        }
        else{
            this.setState({icValid: false})
            this.setState({icError: 'This field is required.'})
            this.setState({icDisabled: true})
        }
    }

    validateHP(){
        if (this.state.hp != ''){
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

    validateServiceName(){
        if (this.state.serviceName != ''){
            this.setState({serviceNameValid: true})
            this.setState({serviceNameError: null})
            this.setState({serviceNameDisabled: false})
        }
        else{
            this.setState({serviceNameValid: false})
            this.setState({serviceNameError: 'This field is required.'})
            this.setState({serviceNameDisabled: true})
        }
    }

    validateServiceDescrip(){
        if (this.state.serviceDescrip != ''){
            this.setState({serviceDescripValid: true})
            this.setState({serviceDescripError: null})
            this.setState({serviceDescripDisabled: false})
        }
        else{
            this.setState({serviceDescripValid: false})
            this.setState({serviceDescripError: 'This field is required.'})
            this.setState({serviceDescripDisabled: true})
        }
    }

    validateWExp(){
        if (this.state.wExp != ''){
            this.setState({wExpValid: true})
            this.setState({wExpError: null})
            this.setState({wExpDisabled: false})
        }
        else{
            this.setState({wExpValid: false})
            this.setState({wExpError: 'This field is required.'})
            this.setState({wExpDisabled: true})
        }
    }


    render(){
        const isNameCorrect = this.state.nameValid;
        const isICCorrect = this.state.icValid;
        const isHpCorrect = this.state.hpValid;
        const isServiceNameCorrect = this.state.serviceNameValid;
        const isServiceDescripCorrect = this.state.serviceDescripValid;
        const isWEXPCorrect = this.state.wExpValid;
        const isDisabled = this.state.disabled;
        
        return (
            <View style = {styles.screen}>
            <ScrollView style= {styles.screen}>
            <View>
                <Image 
                style = {styles.image} 
                source = {require('../../assets/breadcrumb/2.png')}
                />
            </View> 

            <View>
                <Text style = {styles.content}>Full Name</Text>
                <TextInput
                    style={isNameCorrect? styles.textinput : styles.textinputerror}
                    placeholder='Enter Your Full Name'
                    placeholderTextColor='grey'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({name: text})}
                    value={this.state.name}
                    onEndEditing={()=>{
                        this.validateName(), 
                        this.validateForm()
                    }}
                />
                <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.nameError}</Text>                

                <Text style = {styles.content}>IC</Text>
                <TextInput
                    style={isICCorrect? styles.textinput : styles.textinputerror}
                    placeholder='911111-11-1111'
                    placeholderTextColor='grey'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({ic: text})}
                    value={this.state.ic}
                    onEndEditing={()=>{
                        this.validateIC(), 
                        this.validateForm()
                    }}
                />
                <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.icError}</Text>

                <Text style = {styles.content}>H/P Number</Text>
                <TextInput
                    style={isHpCorrect? styles.textinput : styles.textinputerror}
                    placeholder='012-3456789'
                    placeholderTextColor='grey'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({hp: text})}
                    value={this.state.hp}
                    onEndEditing={()=>{
                        this.validateHP(), 
                        this.validateForm()
                    }}
                />
                <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.hpError}</Text>  

                <Text style = {styles.content}>Service Name</Text>
                <TextInput
                    style={isServiceNameCorrect? styles.textinput : styles.textinputerror}
                    placeholder='Enter Your Service Name'
                    placeholderTextColor='grey'
                    autoCapitalize = 'none'
                    autoCorrect = {false}
                    onChangeText={(text) => this.setState({serviceName: text})}
                    value={this.state.serviceName}
                    onEndEditing={()=>{
                        this.validateServiceName(), 
                        this.validateForm()
                    }}
                />
                <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.serviceNameError}</Text> 

                <Text style = {styles.content}>Service Description</Text>
                <Textarea
                    style={isServiceDescripCorrect? styles.textarea : styles.textareaerror}
                    multiline={true}
                    maxLength={1000}
                    placeholder='Enter Service Description'
                    placeholderTextColor='grey'
                    autoCapitalize = 'none'
                    autoCorrect = {true}
                    onChangeText={(text) => this.setState({serviceDescrip: text})}
                    value={this.state.serviceDescrip}
                    onEndEditing={()=>{
                        this.validateServiceDescrip()
                        this.validateForm()
                    }}
                />
                <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.serviceDescripError}</Text> 

                <KeyboardAvoidingView behavior = 'padding'>
                <Text style = {styles.content}>Working Experience</Text>
                <Textarea
                    style={isWEXPCorrect? styles.textarea : styles.textareaerror}
                    multiline={true}
                    maxLength={1000}
                    placeholder='Enter Your Working Experience'
                    placeholderTextColor='grey'
                    autoCapitalize = 'none'
                    autoCorrect = {true}
                    onChangeText={(text) => this.setState({wExp: text})}
                    value={this.state.wExp}
                    onEndEditing={()=>{
                        this.validateWExp(),
                        this.validateForm()
                    }}
                />
                <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.wExpError}</Text>
                </KeyboardAvoidingView>
            </View>
            </ScrollView>

            <View>
                <TouchableOpacity
                    style={isDisabled? styles.buttonSubmitDisabled : styles.buttonSubmit}
                    disabled = {isDisabled}
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
    


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    
    image: {
        width: win.width,
        height: 50,
        marginTop: 20
    },

    imagescreen : {
        flex: 0.1
    },
    content : {
        fontSize: 15,
        fontWeight: 'bold',
        marginHorizontal: '5%',
        marginTop: 10
    },
    textinput: {
        fontSize: 20,
        marginHorizontal: '5%',
        height: 40,
        color: 'black',
        borderBottomWidth: 1,
        borderColor: 'black' 
    },
    textinputerror: {
        fontSize: 20,
        fontStyle: 'italic',
        marginHorizontal: '5%',
        height: 40,
        color: 'black',
        borderBottomWidth: 1,
        borderColor: 'red'
    },
    textarea:{
        height: 150,
        fontSize: 20,
        color: 'black',
        marginHorizontal: '5%',
        marginTop: 5,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        textAlignVertical: 'top'
    },
    textareaerror:{
        fontStyle: 'italic',
        height: 150,
        fontSize: 20,
        color: 'black',
        marginHorizontal: '5%',
        marginTop: 5,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'red',
        textAlignVertical: 'top'
    },
    buttonSubmit: {
        marginTop: 10,
        height: 60,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'black',
        padding: 5
    },
    buttonSubmitDisabled: {
        marginTop: 10,
        height: 60,
        opacity: 0.5,
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

export default BusinessFreelancerDetails;

