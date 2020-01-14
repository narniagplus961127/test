import React, {Component}  from 'react';
import {
    View, 
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';

class MyProfileScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            userName : '',
            email: '',
            phone: '',
            profilePic: null,
            gender: '',
            refreshing: false
        };
    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
    }

    interval = 0;

    componentDidMount(){
        const currentUID = firebase.auth().currentUser.uid
        firebase.firestore().collection('user').where('uid', '==', currentUID).onSnapshot(
        doc => {
            doc.docChanges().forEach(getInfo => {
                this.setState({userName: getInfo.doc.data().username})
                this.setState({phone: getInfo.doc.data().mobile_number})
                this.setState({profilePic: getInfo.doc.data().profile_picture})
                this.setState({email: getInfo.doc.data().email})
                this.setState({gender: getInfo.doc.data().gender})
            })
        })         
        this.setState({ refreshing : false })
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    onSignOutPress(){
        firebase.auth().signOut();
        this.props.navigation.navigate({routeName: 'Login'});
    }

    render() {
    return (
        <View style = {styles.screen}>
        <ScrollView  style = {styles.screen}
        refreshControl = {
            <RefreshControl               
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.refreshing}/>                
        }>

        <View style = {{alignItems: 'center', justifyContent: 'center', marginTop: '10%'}}>
            {this.state.profilePic != null? 
                <Image
                style = {{height: 150, width : 150}}
                source = {{uri: this.state.profilePic}}
                />
                :                 
                <Image
                style = {{height: 150, width : 150}}
                source = {require ('../../assets/profileicon.png')}
            />}          
        </View>
        
        <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 10, flexDirection: 'row'}}>
            <Text style={{fontSize: 25, marginHorizontal: '2.5%'}}>
                {this.state.userName}
            </Text>
            {this.state.gender != ''? 
                (this.state.gender.toLowerCase() == 'male'? 
                    <Ionicons name= 'md-male' size = {20} style = {{color : 'blue'}}/> 
                    : <Ionicons name= 'md-female' size = {20} style = {{color : 'red'}}/> )
            : null }
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 10, flexDirection: 'row'}}>
            <Text>
                Email : 
            </Text>
            <Text>
                {this.state.email}
            </Text>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 10, flexDirection: 'row'}}>
            <Text>
                Phone Number : 
            </Text>
            <Text>
                {this.state.phone}
            </Text>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 10, flexDirection: 'row'}}>
            <TouchableOpacity 
            style = {styles.btnPositive}
            onPress = {() => {
                this.props.navigation.navigate({ routeName : 'History' });
            }}>
                <Text style={{fontSize: 20}}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style = {styles.btnNegative}
            onPress = {() => {
                this.props.navigation.navigate({ routeName : 'EditProfile' });
            }}>
                <Text style = {{fontSize: 20, color: 'white'}}>Edit Profile</Text>
            </TouchableOpacity>
        </View>

        <View style = {{alignItems: 'center', justifyContent: 'center', marginVertical: 30, marginHorizontal: '10%'}}>
            <TouchableOpacity 
            style = {styles.btnlogout}
            onPress = {()=>{
                this.onSignOutPress();
            }}>
                <Text style = {{fontSize: 25, color: 'white'}}>Logout</Text>
            </TouchableOpacity>
        </View>
        
        </ScrollView>
        </View>
    );
    };
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    btnPositive:{
        height: 40,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor
    },
    btnNegative:{
        height: 40,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    btnlogout : {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    }
});

export default MyProfileScreen;

