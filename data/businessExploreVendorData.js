import * as firebase from 'firebase'

export async function getBusiness(businessReceived){
    var businessList = [];
    var snapshot = await firebase.firestore().collection('business').where('businessType', '==','vendor') 
    .orderBy('businessName').get()

    snapshot.forEach((doc) => {
        businessList.push(doc.data())
    });

    businessReceived(businessList);  
}     