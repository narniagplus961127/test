import React from 'react';
import {
    View, 
    Text,
    StyleSheet
} from 'react-native';
import Colors from '../constants/Colors';

const NotificationScreen = props => {
    return (
        <View style = {styles.screen}>
            <Text> </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundColor
    }
});

export default NotificationScreen;

