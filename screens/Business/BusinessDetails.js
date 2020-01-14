import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Button,
    SafeAreaView,
    Alert,
    RefreshControl,
    FlatList,
    StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
    Card, 
    CardItem,
    Body,
    Left,
    Right,
    Fab,
    Thumbnail
} from 'native-base';
import * as firebase from 'firebase';
import ImageView from 'react-native-image-view';
import StarRating from 'react-native-star-rating';
import * as Permissions from 'expo-permissions';

class BusinessDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            uid: '',
            profile_pic: null,
            joinDate: '',
            businessUserName: '',
            businessType: '',
            category: '',
            description:'',
            workingExp: '',
            contact: '',
            categoryColor: '',
            active: false,
            refreshing: false,
            gender: '',
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            image5: null,
            images: [],
            viewPhoto: false,
            averageRating: 0,
            noRating: 0,
            review: [],
            region : {
                latitude : null,
                longitude : null,
                latitudeDelta:  0.045,
                longitudeDelta: 0.0045,
            },   
            address: null
        }
    } 

    getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted'){
            console.log('Permission to access location was denied');
        }
    }

    displayDetails(){
        const businessID = this.props.navigation.getParam('businessID');    
        firebase.firestore().collection('business').doc(businessID)
        .get().then((getInfo) => {
            this.setState({uid : getInfo.data().uid})
            this.setState({joinDate: getInfo.data().businessCreatedDate})
            this.setState({businessUserName: getInfo.data().businessUserName})
            this.setState({businessType: getInfo.data().businessType})
            this.setState({category: getInfo.data().businessCategory})
            this.setState({description: getInfo.data().businessDescription})
            this.setState({workingExp: getInfo.data().businessWorkingExp})
            this.setState({contact: getInfo.data().businessUserHP})
            this.setState({categoryColor: getInfo.data().BusinessCategoryColor})
            this.setState({gender: getInfo.data().businessGender})
            this.setState({image1: getInfo.data().businessImage1})
            this.setState({image2: getInfo.data().businessImage2})
            this.setState({image3: getInfo.data().businessImage3})
            this.setState({image4: getInfo.data().businessImage4})
            this.setState({image5: getInfo.data().businessImage5})
            this.setState({region: getInfo.data().businessLocation})
            this.setState({address: getInfo.data().businessAddress})
        }).then(()=>{
            firebase.firestore().collection('user').doc(this.state.uid)
            .get().then((getProfilePic) => {
                this.setState({profile_pic : getProfilePic.data().profile_picture})
            })
        })
    }

    onViewPhoto(){
        const businessID = this.props.navigation.getParam('businessID'); 
        firebase.firestore().collection('business').doc(businessID)
        .get().then((getPhoto) => {
            //image1
            this.state.images.push({
                source: {
                    uri: getPhoto.data().businessImage1
                },
                width: 800,
                height: 800,
            })
            this.setState({images: this.state.images});

            //image2
            this.state.images.push({
                source: {
                    uri: getPhoto.data().businessImage2
                },
                width: 800,
                height: 800,
            })
            this.setState({images: this.state.images});

            //image3
            this.state.images.push({
                source: {
                    uri: getPhoto.data().businessImage3
                },
                width: 800,
                height: 800,
            })
            this.setState({images: this.state.images});

            //image4
            this.state.images.push({
                source: {
                    uri: getPhoto.data().businessImage4
                },
                width: 800,
                height: 800,
            })
            this.setState({images: this.state.images});

            //image5
            this.state.images.push({
                source: {
                    uri: getPhoto.data().businessImage5
                },
                width: 800,
                height: 800,
            })
            this.setState({images: this.state.images});
        })
    }

    ViewPhoto(){
        return(
            <ImageView
                images={this.state.images}
                isVisible={this.state.isImageViewVisible}
                onClose = {()=>{
                    this.setState({
                        viewPhoto: false
                    })
                }}
            />
        )
    }

    getRating(){
        const businessID = this.props.navigation.getParam('businessID');    
        var noCustomer = 1;
        var averageRating = null
        firebase.firestore().collection('business').doc(businessID).collection('customer').get()
        .then(doc => {
            doc.forEach(info => {
                averageRating = (averageRating + info.data().finalRating) / noCustomer
                this.setState({averageRating : averageRating})
                this.setState({noRating : noCustomer})
                noCustomer++;
            })
        })
    }  

    async getReview(reviewReceived){
        const businessID = this.props.navigation.getParam('businessID');   
        var review = [];
        var snapshot = await firebase.firestore().collection('business').doc(businessID)
        .collection('customer').orderBy('ratingDate', 'desc').orderBy('ratingTime', 'desc').get()
        
        snapshot.forEach(info => {
                review.push(info.data())
            })
        reviewReceived(review)
    }

    onReviewReceived = (review) => {
        this.setState(prevState => ({
            review: prevState.review = review
        }))
    }

    componentDidMount(){     
        this.getLocationAsync()
        this.getReview(this.onReviewReceived)
        this.displayDetails();          
        this.getRating();
        this.onViewPhoto();
        this.setState({refreshing: false})  
    }

    onRefresh(){
        this.setState({ refreshing : true })
        this.componentDidMount()
    }

    onDeleteBusiness(){
        const businessID = this.props.navigation.getParam('businessID');    
        firebase.firestore().collection('business').doc(businessID).delete();  
        firebase.firestore().collection('business').doc().collection('customer').doc().delete();  
        this.props.navigation.navigate({ routeName: 'Business'});
    }

    onAlertDelete(){
        Alert.alert(
            'Delete Confirmation',
            'Are you sure to delete?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                 },
                 {
                    text: 'Yes', 
                    onPress: () => this.onDeleteBusiness()
                },
            ],  
            {cancelable: false},
          );
    }

    onEdit(){
        const businessID = this.props.navigation.getParam('businessID'); 
        this.props.navigation.navigate({
            routeName: 'EditBusiness',
            params:{
                businessID : businessID
            }
        })
        this.onRefresh()
    }

    render(){
        return (
            <View style = {styles.screen}>
            <ScrollView 
            style = {styles.screen}
            refreshControl = {
                <RefreshControl               
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.refreshing}/>                
            }
            >
                <View style = {{backgroundColor : 'white'}}>
                <View style = {{alignItems : 'center'}}>
                <Text style = {styles.contentText}>Rating</Text>
                    <StarRating
                        disabled={true}
                        emptyStar={'ios-star-outline'}
                        fullStar={'ios-star'}
                        halfStar={'ios-star-half'}
                        iconSet={'Ionicons'}
                        maxStars={5}
                        rating={this.state.averageRating}
                        fullStarColor={Colors.primaryColor}
                        starSize = {20}
                    />
                    <Text>
                        <Text>{this.state.averageRating.toFixed(2)}</Text>
                        <Text>{' '}</Text>
                        <Text>/</Text>
                        <Text>{' '}</Text>
                        <Text>5</Text>
                        <Text>{' '}</Text>
                        <Text style ={{fontSize : 10}}>({this.state.noRating}</Text>
                        <Text style ={{fontSize : 10}}>{' '}</Text>
                        <Text style ={{fontSize : 10}}>ratings)</Text>
                    </Text>
                    <Text>{' '}</Text>

                    <Text>
                        <Text style = {styles.contentText2}>Joined since</Text>
                        <Text>{' '}</Text>
                        <Text style = {styles.contentText2}>{this.state.joinDate}</Text>
                    </Text>
                </View>
    
                <View style = {{margin : 10}}>
                    <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                        {this.state.profile_pic != null? 
                        <Image
                            style = {{height: 80, width : 80}}
                            source = {{uri: this.state.profile_pic}}
                        />
                        : <Ionicons name= 'md-contact' size = {80}/> }
                        <View style= {{justifyContent: 'center'}}>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style = {{                                        
                                    fontSize : 20,
                                    fontWeight : 'bold',
                                    marginHorizontal : 10,
                                }}>{this.state.businessUserName}</Text>
                                {this.state.gender != ''? 
                                    (this.state.gender.toLowerCase() == 'male'? 
                                        <Ionicons name= 'md-male' size = {20} style = {{color : 'blue'}}/> 
                                        :<Ionicons name= 'md-female' size = {20} style = {{color : 'red'}}/> )
                                : null }
                            </View>
                            <Text style = {styles.contentText2}>{this.state.contact}</Text>
                        </View>
                    </View>
                </View>
    
                <View style = {{margin : 10}}>
                    <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                        <Ionicons name= 'ios-card' size = {30}/> 
                        <Text style = {styles.contentText}>Business Type</Text>
                    </View>
                     <Text style = {styles.contentText2}>{this.state.businessType}</Text>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'md-bookmark' size = {30}/> 
                    <Text style = {styles.contentText}>Category</Text>
                </View>
                <View style = {{marginHorizontal: 10, width: 150, height: 40, backgroundColor: this.state.categoryColor, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style = {{fontSize: 15, margin: 10, fontWeight:'bold', fontStyle: 'italic'}}>{this.state.category}</Text>
                </View>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'ios-brush' size = {30}/> 
                    <Text style = {styles.contentText}>Description</Text>
                </View>
                <Text style = {styles.contentText2}>{this.state.description}</Text>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'md-filing' size = {30}/>     
                    <Text style = {styles.contentText}>Working Experience</Text>
                </View>
                <Text style = {styles.contentText2}>{this.state.workingExp}</Text>
                </View>
    
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'md-images' size = {30}/>   
                    <Text style = {styles.contentText}>Photos</Text>
                </View>
                <TouchableOpacity
                    style = {{margin : 10}}
                    onPress = {() => {
                        this.setState({
                            viewPhoto: true
                        })
                }}>
                    <View style = {{flexDirection: 'row'}}>
                        <Image style = {styles.image} source = {{uri: this.state.image1}}/>  
                        <Image style = {styles.image} source = {{uri: this.state.image2}}/> 
                        <Image style = {styles.image} source = {{uri: this.state.image3}}/> 
                    </View>
                    <View style = {{flexDirection: 'row'}}>
                        <Image style = {styles.image} source = {{uri: this.state.image4}}/>   
                        <Image style = {styles.image} source = {{uri: this.state.image5}}/>   
                    </View> 
                </TouchableOpacity>
                </View>
                            
                <View style = {{margin : 10}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'ios-home' size = {30}/>   
                    <Text style = {styles.contentText}>Address</Text>
                </View>
                    <Text style = {styles.contentText2}>{this.state.address}</Text>
                </View>
    
                <View style = {{marginHorizontal: 10, marginTop:10, marginBottom:30}}>
                <View style = {{flexDirection: 'row', alignItems: 'center',marginHorizontal: '5%'}}>
                    <Ionicons name= 'ios-compass' size = {30}/>   
                    <Text style = {styles.contentText}>Location</Text>
                </View>
                    <TouchableOpacity
                        style = {{
                            flex:1,
                            flexDirection: 'row', 
                            alignItems : 'center', 
                            justifyContent : 'center', 
                            backgroundColor: 'white',
                            borderBottomWidth : 3,
                            borderRightWidth : 3,
                            borderColor : Colors.primaryColor,
                            elevation: 7,
                            shadowRadius: 5,
                            shadowOpacity: 1.0,
                            width: '100%',
                            height: '20%'
                        }}
                        onPress = {() => {
                            this.props.navigation.navigate({ 
                                routeName : 'BusinessMap',
                                params : {
                                    location : this.state.region,
                                    businessName : this.props.navigation.getParam('businessName')
                                }
                            })
                        }}
                    >
                        <Ionicons name= 'md-map' size ={40} style ={{margin: 10}}/>
                        <Text>
                            <Text style = {{fontSize: 30, color: 'blue'}}>G</Text>
                            <Text style = {{fontSize: 30, color: 'red'}}>o</Text>
                            <Text style = {{fontSize: 30, color: 'yellow'}}>o</Text>
                            <Text style = {{fontSize: 30, color: 'blue'}}>g</Text>
                            <Text style = {{fontSize: 30, color: 'green'}}>l</Text>
                            <Text style = {{fontSize: 30, color: 'red'}}>e</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
                </View>

                <TouchableOpacity
                    style = {styles.review}
                    onPress = {() => {}}>
                        <Text style = {styles.contentText}>Review</Text>
                </TouchableOpacity>
    
                <FlatList
                    data = {this.state.review}
                    keyExtractor={(item,index) => item.requestID}
                    renderItem={({item}) => {
                        return(
                        <View style = {{marginVertical : 10}}>
                            <Card>
                                <CardItem header bordered style = {{height : 40}}>
                                    <Left>
                                    <Text style = {styles.reviewTitle}>{item.customerName}</Text>
                                    </Left>
                                    <Right>
                                    <Text style = {styles.reviewContentText}>{item.ratingTime}</Text>
                                    <Text style = {styles.reviewContentText}>{item.ratingDate}</Text>
                                    </Right>
                                </CardItem>

                                <CardItem>
                                <StarRating
                                    disabled={true}
                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    maxStars={5}
                                    rating={item.finalRating}
                                    starSize= {30}
                                    fullStarColor={Colors.primaryColor}
                                />
                                </CardItem>
                                <CardItem footer>
                                    <Text style = {styles.reviewContentText2}>{item.comment}</Text>
                                </CardItem>
                            </Card>
                        </View>
                        )
                    }}
                    numColumns={1} 
                    ListEmptyComponent = {
                        <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                            <Text>No Review</Text>
                        </View>
                    }
                    />

                {this.state.viewPhoto? this.ViewPhoto() : null}
            </ScrollView>
                
                <Fab
                    active={this.state.active}
                    direction='up'
                    style={{ backgroundColor: 'black', position: 'absolute', bottom: 5, right: 5}}
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <Ionicons name= 'ios-settings' size = {30} />
                        <Button 
                            style={{ backgroundColor: Colors.primaryColor }}
                            onPress = {() => this.onEdit()}>
                        <Ionicons name= 'ios-brush' size = {30}/>
                        </Button>
                        
                        <Button 
                            style={{ backgroundColor: 'red' }}
                            onPress = {() => this.onAlertDelete()}>
                        <Ionicons name= 'ios-trash' size = {30}/>
                        </Button>
                </Fab>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },
    contentText: {
        fontSize : 20,
        fontWeight : 'bold',
        margin : 10
    },
    contentText2: {
        fontSize : 15,
        margin : 10,
        color : 'grey'
    },
    image: {
        height: 100,
        width: 100
    },
    review:{
        backgroundColor : Colors.primaryColor,
        justifyContent : 'center',
        marginTop : 10,
        alignItems : 'center',
    },
    reviewTitle:{
        fontWeight : 'bold',
        fontSize : 20
    },
    reviewContentText: {
        fontSize : 10,
        color : 'grey',
        fontStyle : 'italic'
    },
    reviewContentText2: {
        fontSize : 15
    },
});

export default BusinessDetails;
