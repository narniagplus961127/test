import React from 'react';
import {
    Image
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'; 

import BusinessHistory from '../screens/Profile/BusinessHistory';
import RequestHistory from '../screens/Profile/RequestHistory';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const HistoryTopNavigator = createMaterialTopTabNavigator({
    Business:{
        screen : BusinessHistory,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'md-briefcase' size = {30} color='white'/>;
            }
        }
    },
    Request:{
        screen : RequestHistory,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'md-construct' size = {30} color='white'/>;
            }
        }
    }
},{
    tabBarOptions:{
        showIcon: true,
        labelStyle: { 
            fontWeight: 'bold',
            color : 'white'},
        style : {
            backgroundColor : 'black',
        },
        indicatorStyle: {
            borderBottomColor: Colors.primaryColor,
            borderBottomWidth: 5,
        }
    }
});

export default createAppContainer(HistoryTopNavigator);
