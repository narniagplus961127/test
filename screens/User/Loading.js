import React, { Component } from 'react';
import {
    View, 
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase'

class Loading extends Component {

    componentDidMount(){
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(function(user){
          if(user){
            this.props.navigation.navigate({ routeName: 'Service'})
          }
          else{
            this.props.navigation.navigate({ routeName: 'Login'})
          }
        }.bind(this)
        );
      }

    render(){
        return(
            <View style = {styles.container}>
                <ActivityIndicator size='large' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Loading;

