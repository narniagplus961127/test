import React from 'react';
import {Image} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'; 

import ExploreFreelancer from '../screens/Explore/ExploreFreelancer';
import ExploreVendor from '../screens/Explore/ExploreVendor';
import ExploreStudent from '../screens/Explore/ExploreStudent';

import Colors from '../constants/Colors';

const BusinessTopNavigator = createMaterialTopTabNavigator({
   Vendor:{
       screen : ExploreVendor,
       navigationOptions : {
        tabBarIcon: () => {
            return (<Image
                style={{ width: 25, height: 25 }}
                source={require('../assets/iconTypeWhite/VendorWhiteIcon.png')}/>);
        }
        }
    },

    Freelancer:{
        screen : ExploreFreelancer,
        navigationOptions : {
         tabBarIcon: () => {
             return (<Image
                 style={{ width: 25, height: 25 }}
                 source={require('../assets/iconTypeWhite/FreelancerWhiteIcon.png')}/>);
         }
         }
     },

    Student:{
        screen : ExploreStudent,
        navigationOptions : {
         tabBarIcon: () => {
             return (<Image
                 style={{ width: 25, height: 25 }}
                 source={require('../assets/iconTypeWhite/StudentWhiteIcon.png')}/>);
         }
         }
     },
    
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
