import * as firebase from 'firebase'

export async function getRequest(requestReceived){
    var requestList = [];
    var CurrentUID = firebase.auth().currentUser.uid
    var snapshot = await firebase.firestore().collection('request').where('uid', '==',CurrentUID).where('serviceStatus', '==', '') 
    .orderBy('requestCreatedDate').get()
    snapshot.forEach((doc) => {
        requestList.push(doc.data())
    });
    requestReceived(requestList);  
}     