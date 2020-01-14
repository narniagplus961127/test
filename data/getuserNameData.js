import * as firebase from 'firebase'

export async function getName(nameReceived){
    var name = '';
    var CurrentUID = firebase.auth().currentUser.uid
    var snapshot = await firebase.firestore().collection('user').where('uid', '==',CurrentUID).get()
    snapshot.forEach((doc) => {
        name = doc.data().username
    })
    nameReceived(name); 
}     