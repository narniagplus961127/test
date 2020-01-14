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
import DatePicker from 'react-native-datepicker';
import {CATEGORIES} from '../../data/categoryData';  

class RequestCreateDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            serviceType: '', serviceTypeValid: false, serviceTypeError: null, serviceTypeDisabled: true,
            requestDescrip: '', requestDescripValid: false, requestDescripError: null, requestDescripDisabled: true,
            requestContact: '', requestContactValid: false, requestContactError: null, requestContactDisabled: true,
            date : '', dateValid: true, dateError: null, dateDisabled: true,
            time: '', timeValid: true, timeError: null, timeDisabled: true,
            disabled: true
        }
    }

    onNext(){
        const catID = this.props.navigation.getParam('categoryID');
        const selectedCategory = CATEGORIES.find(cat => cat.id == catID);

        if((this.state.serviceTypeValid && this.state.requestDescripValid 
            && this.state.requestContactValid ) == true){
            this.props.navigation.navigate({ 
                routeName: 'RequestUploadPhoto',
                params:{
                    selectedCategory : selectedCategory.title,
                    categoryColor : selectedCategory.color,
                    serviceType: this.state.serviceType,
                    requestDescrip: this.state.requestDescrip,
                    requestContact: this.state.requestContact,
                    date: this.state.date,
                    time : this.state.time
                }
            })
        }
    }

    validateForm(){
        if((this.state.serviceTypeDisabled && this.state.requestDescripDisabled 
            && this.state.requestContactDisabled) == false){
            this.setState({disabled: false})
        }
        else{
            this.setState({disabled: true})
        }
    }

    validateServiceType(){
        if (this.state.serviceType != ''){
            this.setState({serviceTypeValid: true})
            this.setState({serviceTypeError: null})
            this.setState({serviceTypeDisabled: false})
        }
        else{
            this.setState({serviceTypeValid: false})
            this.setState({serviceTypeError: 'This field is required.'})
            this.setState({serviceTypeDisabled: true})
        }
    }

    validateRequestDescrip(){
        if (this.state.requestDescrip != ''){
            this.setState({requestDescripValid: true})
            this.setState({requestDescripError: null})
            this.setState({requestDescripDisabled: false})
        }
        else{
            this.setState({requestDescripValid: false})
            this.setState({requestDescripError: 'This field is required.'})
            this.setState({requestDescripDisabled: true})
        }
    }

    validateRequestContact(){
        if (this.state.requestContact != ''){
            this.setState({requestContactValid: true})
            this.setState({requestContactError: null})
            this.setState({requestContactDisabled: false})
        }
        else{
            this.setState({requestContactValid: false})
            this.setState({requestContactError: 'This field is required.'})
            this.setState({requestContactDisabled: true})
        }
    }

    render(){
        const isServiceTypeCorrect = this.state.serviceTypeValid;
        const isRequestDescripCorrect = this.state.requestDescripValid;
        const isRequestContactCorrect = this.state.requestContactValid;
        const isDisabled = this.state.disabled;

        return (
            <View style= {styles.screen}>
                <ScrollView style= {styles.screen}>
                <View>
                    <Image 
                    style = {styles.image} 
                    source = {require('../../assets/breadcrumb/2.png')}
                    />
                </View> 
    
                <View>
                    <Text style = {styles.content}>Service Type</Text>
                    <TextInput
                        style={ isServiceTypeCorrect ? styles.textinput : styles.textinputerror}
                        placeholder='Enter Your Service Type'
                        placeholderTextColor='grey'
                        autoCapitalize = 'none'
                        autoCorrect = {true}
                        onChangeText={(text) => this.setState({serviceType: text})}
                        value={this.state.serviceType}
                        onEndEditing={()=>{
                            this.validateServiceType(),
                            this.validateForm()
                        }}
                        />
                    <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.serviceTypeError}</Text>
    
                    <Text style = {styles.content}>Request Description</Text>
                    <Textarea
                        style={isRequestDescripCorrect? styles.textarea : styles.textareaerror}
                        multiline={true}
                        maxLength={1000}
                        placeholder='Enter Request Description'
                        placeholderTextColor='grey'
                        autoCapitalize = 'none'
                        autoCorrect = {true}
                        onChangeText={(text) => this.setState({requestDescrip: text})}
                        value={this.state.requestDescrip}
                        onEndEditing={()=>{
                            this.validateRequestDescrip(),
                            this.validateForm()
                        }}
                    />

                    <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.requestDescripError}</Text>
                    
                    <KeyboardAvoidingView behavior = 'padding'>
                    <Text style = {styles.content}>Contact</Text>
                    <TextInput
                        style={isRequestContactCorrect ? styles.textinput : styles.textinputerror}
                        placeholder='012-3456789'
                        placeholderTextColor='grey'
                        autoCapitalize = 'none'
                        autoCorrect = {false}
                        onChangeText={(text) => this.setState({requestContact: text})}
                        value={this.state.requestContact}
                        onEndEditing={()=>{
                            this.validateRequestContact(),
                            this.validateForm()
                        }}
                    />
                    <Text style = {{color: 'red', marginHorizontal: '5%'}}>{this.state.requestContactError}</Text>
                    </KeyboardAvoidingView>
                    
                    <View style = {{flexDirection: 'row', marginTop: 10}}>
                        <View style= {{marginHorizontal: '5%'}}>
                            <Text style = {{fontSize: 15, marginTop: 10, fontWeight: 'bold'}}>Date</Text>
                            <DatePicker
                                style={styles.dateStyle}
                                date={this.state.date} 
                                mode= 'date'
                                placeholder= 'select date'
                                format= 'DD-MM-YYYY'
                                minDate= '01-01-2019'
                                maxDate= '01-01-2050'
                                confirmBtnText= 'Confirm'
                                cancelBtnText= 'Cancel'
                                customStyles={{
                                    dateIcon: {
                                        display: 'none'
                                    },
                                    dateInput:{
                                        borderWidth: 0
                                    }
                                }}
                                onDateChange={(date) => {this.setState({date: date})}}
                            />
                        </View>

                        <View style= {{marginHorizontal: '5%'}}>
                            <Text style = {{fontSize: 15, marginTop: 10, fontWeight: 'bold'}}>Time</Text>
                            <DatePicker
                                style={styles.dateStyle}
                                mode= 'time'
                                date = {this.state.time}
                                placeholder= 'select time'
                                confirmBtnText= 'Confirm'
                                cancelBtnText= 'Cancel'
                                is24Hour = {true}
                                customStyles={{
                                    dateIcon: {
                                        display: 'none'
                                    },
                                    dateInput:{
                                        borderWidth: 0
                                    }
                                }}
                                onDateChange ={(text) => {this.setState({time: text})}}
                            />
                        </View>
                    </View>
                               
                </View>
            </ScrollView>
    
            <View>
                <TouchableOpacity
                    style={isDisabled? styles.buttonSubmitDisabled : styles.buttonSubmit}
                    disabled={isDisabled}
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
        color: 'black',
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
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'black',
        padding: 5
    },
    buttonSubmitDisabled: {
        marginTop: 10,
        height: 50,
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
    },
    dateStyle:{
        marginTop: '5%',
        width: 100, 
        borderColor:'black', 
        borderBottomWidth: 1, 
        backgroundColor: 'white'
    }
});

export default RequestCreateDetails;

