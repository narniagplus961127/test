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

const RequestAccepted = props => {
    return(
        <View  style = {styles.screen}>
        <ScrollView style = {styles.screen}>
            <View style = {styles.chatbar}>
                <Text style ={{fontSize: 20, color : 'white'}}>Chat</Text>
            </View>


        </ScrollView>

        <View>
            <TouchableOpacity
                style = {styles.buttonPositive}
                onPress = {()=>{
                    props.navigation.navigate({ routeName : 'Rate' });
                }}>
                <Text style = {{fontSize: 25}}>
                    Rate
                </Text>
            </TouchableOpacity>
        </View>

        <View>
            <TouchableOpacity
                style = {styles.buttonNegative}
                onPress = {()=>{
 
                }}>
                <Text style = {{fontSize: 25, color: 'white', fontStyle : 'italic'}}>
                    Thank you for rating!
                </Text>
            </TouchableOpacity>
        </View>

        <View>
            <TouchableOpacity
                style = {styles.buttonDisable}
                onPress = {()=>{}}>
                <Text style = {{fontSize: 25, color: 'white', fontStyle: 'italic'}}>
                    Service - RM 30
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
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonPositive:{
        height : 50,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent : 'center'
    },
    buttonDisable:{
        height : 50,
        backgroundColor: '#606060',
        alignItems: 'center',
        justifyContent : 'center'
    }
})

export default RequestAccepted;