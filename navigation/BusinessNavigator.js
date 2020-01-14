import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

import Colors from '../constants/Colors';
import * as firebase from 'firebase';

import BusinessVendorDetails from '../screens/Business/BusinessVendorDetails';
import BusinessScreen from '../screens/Business/BusinessScreen';
import BusinessType from '../screens/Business/BusinessType';
import BusinessFreelancerDetails from '../screens/Business/BusinessFreelancerDetails';
import BusinessStudentDetails from '../screens/Business/BusinessStudentDetails';
import BusinessUploadPhoto from '../screens/Business/BusinessUploadPhoto';
import BusinessLocation from '../screens/Business/BusinessLocation';
import BusinessCategory from '../screens/Business/BusinessCategory';
import BusinessTopNavigator from './BusinessTopNavigator';
import RequestView from '../screens/Request/RequestView';
import BusinessChat from '../screens/Business/BusinessChat';
import BusinessQuote from '../screens/Business/BusinessQuote';
import BusinessEditQuote from '../screens/Business/BusinessEditQuote';
import EditBusiness from '../screens/Business/EditBusiness';
import BusinessMap from '../screens/Business/BusinessMap';
import RequestMap from '../screens/Request/RequestMap';

const BusinessNavigator = createStackNavigator({

    Business : {
        screen : BusinessScreen,
        navigationOptions: {
            headerTitle: 'Business',
            headerStyle: {
                 backgroundColor: Colors.primaryColor
            },
        }
    },
    BusinessCategory : {
        screen: BusinessCategory,
        navigationOptions: {
            headerTitle: 'Categories',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },

    BusinessVendorDetail :{
        screen: BusinessVendorDetails,
        navigationOptions: {
            headerTitle: 'Business Details',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },

    BusinessFreelancerDetail :{
        screen: BusinessFreelancerDetails,
        navigationOptions: {
            headerTitle: 'Business Details',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },

    BusinessStudentDetail :{
        screen: BusinessStudentDetails,
        navigationOptions: {
            headerTitle: 'Business Details',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },

    BusinessType : {
        screen: BusinessType,
        navigationOptions: {
            headerTitle: 'Business Type',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },
    BusinessUploadPhoto : {
        screen: BusinessUploadPhoto,
        navigationOptions: {
            headerTitle: 'Upload Photos',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },
    BusinessLocation: {
        screen: BusinessLocation,
        navigationOptions: {
            headerTitle: 'Location',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
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
    BusinessProfile : {
        screen : BusinessTopNavigator,
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
    EditBusiness : {
        screen : EditBusiness,
        navigationOptions: {
            headerTitle: 'Edit Business',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
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
    BusinessQuote : {
        screen : BusinessQuote,
        navigationOptions: {
            headerTitle: 'Quotation',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
    },
    BusinessEditQuote : {
        screen : BusinessEditQuote,
        navigationOptions: {
            headerTitle: 'Edit Quotation',
            headerStyle: {
                backgroundColor: Colors.primaryColor
            }
        }
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
    RequestMap: {
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
    }
});

export default createAppContainer(BusinessNavigator);