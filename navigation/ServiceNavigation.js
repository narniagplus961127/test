import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'; 

import { useScreens } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';

import ExploreNavigator from '../navigation/ExploreNavigator';
import BusinessNavigator from './BusinessNavigator';
import RequestNavigator from './RequestNavigator';
import NotificationNavigator from './NotificationNavigator';
import MyProfileNavigator from './MyProfileNavigator';

const ServiceBtmNavigator = createBottomTabNavigator({
    Explore : {
        screen : ExploreNavigator,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'md-globe' size = {30} color='white'/>;
            }
        }
    },

    Business : {
        screen : BusinessNavigator,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'md-briefcase' size = {30} color='white'/>;
            }
        }
    },

    Request : {
        screen : RequestNavigator,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'md-construct' size = {25} color='white'/>;
            }
        }
    },

    Notification : {
        screen : NotificationNavigator,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'ios-notifications' size = {25} color='white'/>;
            }
        }
    },

    MyProfile : {
        screen : MyProfileNavigator,
        navigationOptions : {
            tabBarIcon: () => {
                return <Ionicons name= 'md-contact' size = {25} color='white'/>;
            }
        }
    }
    
},  {
    tabBarOptions:{
        activeTintColor : 'black',
        activeBackgroundColor : 'grey',
        labelStyle: { 
            fontWeight: 'bold',
            color : 'white'},
        inactiveBackgroundColor : 'black',

    }
}
);

export default createAppContainer(ServiceBtmNavigator);
