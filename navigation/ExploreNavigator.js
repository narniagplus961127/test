import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

import Colors from '../constants/Colors';

import BusinessView from '../screens/Business/BusinessView';
import ExploreTopNavigator from './ExploreTopNavigator';
import BusinessMap from '../screens/Business/BusinessMap';
import ServiceMap from '../screens/Explore/ServiceMap';
import MapDetails from '../screens/Explore/MapDetails';


const ExploreNavigator = createStackNavigator({
    Explore :{ 
        screen: ExploreTopNavigator,
        navigationOptions: {
            headerTitle: 'Explore',
            headerStyle: {
            backgroundColor: Colors.primaryColor
            },
        }
    },
    BusinessView : {
        screen: BusinessView,
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
    ServiceMap : {
        screen : ServiceMap,
        navigationOptions: {
            headerTitle: 'Services',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },
    MapDetails : {
        screen: MapDetails,
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
    }
});

export default createAppContainer(ExploreNavigator);