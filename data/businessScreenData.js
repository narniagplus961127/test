import * as firebase from 'firebase'

export async function getBusiness(businessReceived){
    var businessList = [];
        var CurrentUID = firebase.auth().currentUser.uid
            var snapshot = await firebase.firestore().collection('business').where('uid', '==',CurrentUID) 
            .orderBy('businessCreatedDate').get()
    
            snapshot.forEach((doc) => {
                businessList.push(doc.data())
            });
        businessReceived(businessList);  
}     