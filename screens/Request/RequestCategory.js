import React, {Component} from 'react';
import {
    View, 
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import {CATEGORIES} from '../../data/categoryData';
import Colors from '../../constants/Colors';

class RequestCategory extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        const renderGridItem = itemData => {
            return (             
            <TouchableOpacity style={styles.gridItem}
                onPress={() => {
                    this.props.navigation.navigate({ routeName: 'RequestCreateDetails', 
                    params:{
                        categoryID : itemData.item.id
                    } });
                }}
            >

            <View style = {styles.container}>
                <Image
                    style = {styles.imageStyle} 
                    source = {{uri: itemData.item.imageURL}}
                    PlaceholderContent={itemData.item.title}/>
            </View>
            </TouchableOpacity>
            );
        };
        
            return (
                <FlatList 
                style = {styles.screen}
                keyExtractor={(item,index) => item.id} 
                data={CATEGORIES}  
                renderItem={renderGridItem} 
                numColumns={2} />
            );
        
    }
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.backgroundColor
    },

    gridItem: {
        flex: 1,
        margin: 15,
        height: 130,
        alignItems: 'center',
    },

    imageStyle:{
        width: 150,
        height: 150,
    },

    container: {
        flex: 1,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0 , height: 2},
        shadowRadius: 10
    },
});

export default RequestCategory;

