import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'; 

import BusinessDetails from '../screens/Business/BusinessDetails';
import BusinessResponse from '../screens/Business/BusinessResponse';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const BusinessTopNavigator = createMaterialTopTabNavigator({
   Details:{
       screen : BusinessDetails,
       navigationOptions : {
        tabBarIcon: () => {
            return <Ionicons name= 'md-list-box' size = {30} color='white'/>;
        }
        }
    },

    Response:{
        screen : BusinessResponse,
        navigationOptions : {
        tabBarIcon: () => {
            return <Ionicons name= 'ios-cog' size = {30} color='white'/>;
         }
        }
    }
    
},  {
    tabBarOptions:{
        showIcon: true,
        indicatorStyle: {
            borderBottomColor: Colors.primaryColor,
            borderBottomWidth: 5,
        },
        labelStyle: { 
            fontWeight: 'bold',
            color : 'white'},
        style : {
            backgroundColor : 'black',
        }
    }
}
);

export default createAppContainer(BusinessTopNavigator);
