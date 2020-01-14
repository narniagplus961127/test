import * as firebase from 'firebase'

export async function getRating(ratingReceived){
    var rating = null;
    var CurrentUID = firebase.auth().currentUser.uid
    var snapshot = await firebase.firestore().collection('user').where('uid', '==',CurrentUID).get()
    snapshot.forEach((doc) => {
        gender = doc.data().gender
    })

    genderReceived(gender);  
}     