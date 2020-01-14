import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

import Colors from '../constants/Colors';

import RequestScreen from '../screens/Request/RequestScreen';
import RequestCategory from '../screens/Request/RequestCategory';
import RequestCreateDetails from '../screens/Request/RequestCreateDetails';
import RequestUploadPhoto from '../screens/Request/RequestUploadPhoto';
import RequestLocation from '../screens/Request/RequestLocation';
import RequestTopNavigator from './RequestTopNavigator';
import BusinessView from '../screens/Business/BusinessView';
import RequestChat from '../screens/Request/RequestChat';
import RequestAccepted from '../screens/Request/RequestAccepted';
import Rate from '../screens/Request/Rate';
import RequestMap from '../screens/Request/RequestMap';
import BusinessMap from '../screens/Business/BusinessMap';

const RequestNavigator = createStackNavigator({
    Request : {
        screen: RequestScreen,
        navigationOptions: {
            headerTitle: 'Request',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },

    RequestCategory : {
        screen: RequestCategory,
        navigationOptions: {
            headerTitle: 'Category',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },
    RequestCreateDetails : {
        screen: RequestCreateDetails,
        navigationOptions: {
            headerTitle: 'Details',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },
    RequestUploadPhoto :{
        screen: RequestUploadPhoto,
        navigationOptions: {
            headerTitle: 'Upload Photo',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },    
    RequestLocation :{
        screen: RequestLocation,
        navigationOptions: {
            headerTitle: 'Location',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },
    RequestProfile : {
        screen : RequestTopNavigator,
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
    },
    RequestAccepted : {
        screen : RequestAccepted,
        navigationOptions: {
            headerTitle: 'Service Status',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },
    Rate : {
        screen : Rate,
        navigationOptions: {
            headerTitle: 'Rating',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },
    RequestMap : {
        screen : RequestMap,
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
    BusinessMap : {
        screen : BusinessMap,
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
});

export default createAppContainer(RequestNavigator);