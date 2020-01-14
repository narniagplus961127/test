import React, {Component} from 'react';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';

class BusinessQuote extends Component {
    constructor(props){
        super(props);
        this.state = {
            refreshing: false,
            servicePrice: null,
            category: '',
            MinPrice: '',
            MaxPrice: ''
        }
    }

    componentDidMount(){
        const businessID = this.props.navigation.getParam('businessID')
        const requestID = this.props.navigation.getParam('requestID')
        firebase.firestore().collection('request').doc(requestID)
        .collection('serviceProvider').doc(businessID).get().then(doc => {
            this.setState({ servicePrice : doc.data().servicePrice}) 
        })
        firebase.firestore().collection('business').doc(businessID).get().then(doc => {
            firebase.firestore().collection('category').doc(doc.data().businessCategory).get()
            .then(catdoc => {
                this.setState({ MinPrice : catdoc.data().MinPrice})
                this.setState({ MaxPrice : catdoc.data().MaxPrice})
            })
        })  
    }

    onSubmit(){
        const businessID = this.props.navigation.getParam('businessID')
        const requestID = this.props.navigation.getParam('requestID')
        firebase.firestore().collection('request').doc(requestID)
        .collection('serviceProvider').doc(businessID).update({
            servicePrice : this.state.servicePrice
        })    
        this.props.navigation.navigate({routeName: 'BusinessChat'});    
    }

    render(){
        return(
            <View style = {styles.screen}>
                <ScrollView style = {styles.screen}> 
                
                <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                <Image 
                style = {{height: 150, width: 150 , margin : 30}}
                source = {require('../../assets/Price.png')}>
                </Image>
                </View>
    
                <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent : 'center'}}>
                    <View style = {{height: 30, width: 80, backgroundColor: 'black', alignItems:'center', justifyContent:'center'}}>
                        <Text style = {{fontSize: 20, color: 'white'}}>RM</Text>
                    </View>
                    <TextInput style = {styles.inputText}
                        value= {this.state.servicePrice}
                        autoCapitalize = 'none'
                        autoCorrect = {false}
                        onChangeText={(text) => this.setState({servicePrice: text})}
                    /> 
                </View>
    
                <View style = {{marginVertical : 5, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style = {{fontSize: 20}}>Price Range : RM {this.state.MinPrice} - {this.state.MaxPrice}</Text>
                </View>
    
                </ScrollView>
    
                <View>
                    <TouchableOpacity
                    style =  {styles.btnSubmit}
                    onPress = {()=> {
                        this.onSubmit()
                    }}
                    >
                    <Text style = {{fontSize : 25}}>
                        Submit
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen : {
        flex : 1,
        backgroundColor : Colors.backgroundColor
    },
    btnSubmit:{
        height : 50,
        backgroundColor: Colors.primaryColor,
        width: '100%',
        alignItems: 'center',
        justifyContent : 'center'
    },
    inputText:{
        margin: 10,
        padding: 5,
        height: 30,
        width: 200,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
    }
});

export default BusinessQuote;