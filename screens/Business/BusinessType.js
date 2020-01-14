import React, {Component} from 'react';
import {
    View, 
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import {CATEGORIES} from '../../data/categoryData';  
import Colors from '../../constants/Colors';

class BusinessType extends Component{

    constructor(props){
        super(props);
        this.state = {
        };
    }

    render(){
        const catID = this.props.navigation.getParam('categoryID');
        const selectedCategory = CATEGORIES.find(cat => cat.id == catID);

    return (
        <ScrollView style = {styles.screen}>
            <View>
                <Image 
                    style = {styles.image}
                    source={require('../../assets/breadcrumb/2.png')} />
            </View>
            
            <View style = {styles.content} >   
                <Text style = {
                   {
                    fontSize : 20 
                   }
                }>Business Type</Text>
            </View>


            <View>
                <TouchableOpacity style = {styles.container}
                onPress = {() => {
                    this.props.navigation.navigate({ 
                        routeName: 'BusinessVendorDetail',
                        params:{
                            selectedCategory : selectedCategory.title,
                            selectedCategoryColor : selectedCategory.color,
                            businessTypeV: 'vendor'
                        } 
                    })
                } 
                }>
                <Image 
                    style = {styles.icon}
                    source={require('../../assets/businesstype/Vendor.png')} />
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style = {styles.container}
                onPress = {() => {
                    this.props.navigation.navigate({ 
                        routeName: 'BusinessFreelancerDetail',
                        params:{
                            selectedCategory : selectedCategory.title,
                            selectedCategoryColor : selectedCategory.color,
                            businessTypeF: 'freelancer'
                        } 
                    })} 
                }>
                <Image 
                    style = {styles.icon}
                    source={require('../../assets/businesstype/Freelancer.png')} />
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style = {styles.container}
                onPress = {() => {
                    this.props.navigation.navigate({ 
                        routeName: 'BusinessStudentDetail',
                        params:{
                            selectedCategory: selectedCategory.title,
                            selectedCategoryColor : selectedCategory.color,
                            businessTypeS: 'student'
                        } 
                    })}  
                }>
                <Image 
                    style = {styles.icon}
                    source={require('../../assets/businesstype/Student.png')} />
                </TouchableOpacity>
            </View>
            
        </ScrollView>


        );
    };
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    },

    image: {
        width: '100%',
        height: 50,
        top: 20
    },
    container: {
        marginTop: 20
    },
    content: {
        marginTop: 50,
        marginLeft: 20
    },
    icon:{
        width: '100%',
        height: 120,
    }
});

export default BusinessType;
