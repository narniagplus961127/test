import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';


import Colors from '../constants/Colors';

import Login from '../screens/User/Login';
import Register from '../screens/User/Register';
import ServiceBtmNavigator from './ServiceNavigation';
import ForgotPassword from '../screens/User/ForgotPassword';


const UserNavigator = createStackNavigator({

    Login :{ 
        screen: Login,
        navigationOptions: {
            header: null,
        } 
    },
    Register : {
        screen: Register,
        navigationOptions: {
            header: null,
        } 
    },
    ForgotPassword : {
        screen: ForgotPassword,
        navigationOptions: {
            header: null,
        } 
    },
    Service : {
        screen: ServiceBtmNavigator,
        navigationOptions: {
            header: null,
        } 
    }
});

export default createAppContainer(UserNavigator);