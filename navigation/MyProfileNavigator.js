import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'; 

import Colors from '../constants/Colors';

import MyProfileScreen from '../screens/Profile/MyProfileScreen';
import HistoryTopNavigator from './HistoryTopNavigator';
import BusinessChat from '../screens/Business/BusinessChat';
import BusinessView from '../screens/Business/BusinessView';
import RequestView from '../screens/Request/RequestView';
import RequestChat from '../screens/Request/RequestChat';
import EditProfile from '../screens/Profile/EditProfile';

const MyProfileNavigator = createStackNavigator({
    MyProfile : {
        screen: MyProfileScreen,
        navigationOptions: {
            headerTitle: 'My Profile',
            headerStyle: {
                backgroundColor: Colors.primaryColor,
            }
        }
    },
    History :{
        screen: HistoryTopNavigator,
        navigationOptions: {
            headerTitle: 'History',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },    
    EditProfile:{
        screen: EditProfile,
        navigationOptions: {
            headerTitle: 'Edit Profile',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },
    BusinessView : {
        screen : BusinessView,
        navigationOptions: props => ({
            headerTitle: props.navigation.state.params.businessName,
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
            headerTitleStyle:{
                fontWeight: 'bold',
                fontSize: 20,
                fontStyle: 'italic'
            }
        })
    },
    RequestView:{
        screen: RequestView,
        navigationOptions: props => ({
            headerTitle: props.navigation.state.params.requestName,
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
            headerTitleStyle:{
                fontWeight: 'bold',
                fontSize: 20,
                fontStyle: 'italic'
            }
        })
    },
    BusinessChat : {
        screen : BusinessChat,
        navigationOptions: props => ({
            headerTitle: props.navigation.state.params.serviceStatus,
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
            headerTitleStyle:{
                fontWeight: 'bold',
                fontSize: 20,
                fontStyle: 'italic'
            }
        })
    },
    RequestChat : {
        screen : RequestChat,
        navigationOptions: props => ({
            headerTitle: props.navigation.state.params.serviceStatus,
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
            headerTitleStyle:{
                fontWeight: 'bold',
                fontSize: 20,
                fontStyle: 'italic'
            }
        })
    }
});




export default createAppContainer(MyProfileNavigator);