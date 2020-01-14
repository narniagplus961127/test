import React from 'react';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';

const BusinessEditQuote = props => {
    return(
        <View  style = {styles.screen}>
        <ScrollView style = {styles.screen}>
            <View style = {styles.chatbar}>
                <Text style ={{fontSize: 20, color : 'white'}}>Chat</Text>
            </View>


        </ScrollView>

        <View style = {{flexDirection: 'row', position: 'absolute', bottom: 0}}>
            <TouchableOpacity
                style = {styles.buttonNegative}
                onPress = {()=>{}}>
                <Text style = {{fontSize: 25, color: 'white'}}>
                    Decline
                </Text>
            </TouchableOpacity>

             <TouchableOpacity
                style = {styles.buttonPositive}
                onPress = {()=>{
                    props.navigation.navigate({ routeName : 'BusinessQuote' })
                }}>
                <Text style = {{fontSize: 25}}>
                    Edit Quote
                </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.backgroundColor,
        flex : 1
    },
    chatbar:{
        height : 40, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor : '#606060'
    },
    buttonNegative:{
        height : 50,
        backgroundColor: 'black',
        width: '50%',
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonPositive:{
        height : 50,
        backgroundColor: Colors.primaryColor,
        width: '50%',
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonDisable:{
        height : 50,
        backgroundColor: '#606060',
        width: '50%',
        alignItems: 'center',
        justifyContent : 'center'
    }
})

export default BusinessEditQuote;