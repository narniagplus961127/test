import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

import Colors from '../constants/Colors';

import NotificationScreen from '../screens/NotificationScreen';

const NotificationNavigator = createStackNavigator({
    Notification : {
        screen: NotificationScreen,
        navigationOptions: {
            headerTitle: 'Notification',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            },
        }
    },
});

export default createAppContainer(NotificationNavigator);