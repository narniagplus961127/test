import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

import UserNavigator from './UserNavigator';
import Loading from '../screens/User/Loading';

const SwitchNavigator = createSwitchNavigator({
    Loading: {
        screen : Loading
    },
    UserNavigator: {
        screen : UserNavigator
    }
    
});



export default createAppContainer(SwitchNavigator);