import React, {Component} from 'react';
import StarRating from 'react-native-star-rating';
import {
    View, 
    Text,
    Button,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import Textarea from 'react-native-textarea';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';

class Rate extends Component {
    constructor(props){
        super(props);
        this.state = {
            qualityStar : 5,
            attitudeStar : 5,
            speedStar : 5,
            comment : '',
            requestUserName: ''
        }
    }

    onQualityStarRatingPress(rating) {
        this.setState({
          qualityStar: rating
        });
    }

    onAttitudeStarRatingPress(rating) {
        this.setState({
          attitudeStar: rating
        });
    }

    onSpeedStarRatingPress(rating) {
        this.setState({
          speedStar: rating
        });
    }

    componentDidMount(){
        const requestID = this.props.navigation.getParam('requestID'); 

        firebase.firestore().collection('request').doc(requestID).get()
        .then(doc => {
            this.setState({requestUserName : doc.data().requestUserName})
        })
    }

    onSubmit(){
        var finalRating = (this.state.attitudeStar + this.state.qualityStar + this.state.speedStar) / 3;
        const requestID = this.props.navigation.getParam('requestID'); 
        const businessID = this.props.navigation.getParam('businessID'); 

        firebase.firestore().collection('business').doc(businessID)
        .collection('customer').doc(requestID).set({
            finalRating : finalRating,
            customerName : this.state.requestUserName,
            qualityRating : this.state.qualityStar,
            attitudeRating : this.state.attitudeStar,
            speedRating : this.state.speedStar,
            requestID : requestID,
            comment : this.state.comment,
            ratingDate: new Date().getDate() + '/' + (new Date().getMonth() +1)+ '/' + new Date().getFullYear(),
            ratingTime: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
        })

        Alert.alert(
            'Review',
            'Thank you for rating!',
            [
                {
                    text: 'OK', 
                    onPress: () => {                        
                        this.props.navigation.navigate({
                            routeName : 'Request'
                        })
                        this.props.navigation.navigate({
                            routeName : 'MyProfile'
                        })
                    }
                }
            ],
            {cancelable: false},
        );   
    }

    render(){
        return(
            <View  style = {styles.screen}>
            <ScrollView style = {styles.screen}>
                <View style = {styles.bar}>
                    <Text style ={{fontSize: 20, color : 'white'}}>Rating</Text>
                </View>
    
                <View style ={styles.bar2}>
                <Text style ={{fontSize: 20, color : 'white'}}>Quality</Text>
                </View>
                <View style = {{alignItems: 'center', justifyContent: 'center' , marginVertical: 10}}>
                <StarRating
                    disabled={false}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5}
                    rating={this.state.qualityStar}
                    selectedStar={(rating) => this.onQualityStarRatingPress(rating)}
                    fullStarColor={Colors.primaryColor}
                />
                </View>
    
                <View style ={styles.bar2}>
                <Text style ={{fontSize: 20, color : 'white'}}>Attitude</Text>
                </View>
                <View style = {{alignItems: 'center', justifyContent: 'center' , marginVertical: 10}}>
                <StarRating
                    disabled={false}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5}
                    rating={this.state.attitudeStar}
                    selectedStar={(rating) => this.onAttitudeStarRatingPress(rating)}
                    fullStarColor={Colors.primaryColor}
                />
                </View>
    
                <View style ={styles.bar2}>
                <Text style ={{fontSize: 20, color : 'white'}}>Speed</Text>
                </View>
                <View style = {{alignItems: 'center', justifyContent: 'center' , marginVertical: 10}}>
                <StarRating
                    disabled={false}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5}
                    rating={this.state.speedStar}
                    selectedStar={(rating) => this.onSpeedStarRatingPress(rating)}
                    fullStarColor={Colors.primaryColor}
                />
                </View>
    
                <View style = {styles.bar}>
                    <Text style ={{fontSize: 20, color : 'white'}}>Comments</Text>
                </View>
                <KeyboardAvoidingView behavior = 'padding'>
                    <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                        <Textarea
                            style={styles.textarea}
                            multiline={true}
                            maxLength={1000}
                            placeholder='Enter Your Comments'
                            placeholderTextColor='grey'
                            autoCapitalize = 'none'
                            autoCorrect = {true}
                            onChangeText={(text) => this.setState({comment: text})}
                            >
                        </Textarea>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
    
            <View>
                <TouchableOpacity
                    style = {styles.btnSubmit}
                    onPress = {()=>{
                        this.onSubmit()
                    }}>
                    <Text style = {{fontSize: 25}}>
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
    
            </View>
        )
    }
}


const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.backgroundColor,
        flex : 1
    },
    bar:{
        marginHorizontal : '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        height: 40
    },
    bar2:{
        marginHorizontal : '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#606060',
        height: 40
    },
    btnSubmit:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        height: 50
    },
    textarea:{
        height: 150,
        fontSize: 14,
        color: 'black',
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        textAlignVertical: 'top',
        marginHorizontal: '5%'
    }
})

export default Rate;