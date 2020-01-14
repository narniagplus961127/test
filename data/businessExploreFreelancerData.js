import * as firebase from 'firebase'

export async function getBusiness(businessReceived){
    var businessList = [];
    var averageRating = null;
    var noCustomer = 1;
    var snapshot = await firebase.firestore().collection('business').where('businessType', '==','freelancer') 
    .orderBy('businessName').get()

    snapshot.forEach((doc) => {
        firebase.firestore().collection('business').doc(doc.data().businessID)
        .collection('customer').get()
        .then(subdoc => {
            subdoc.forEach(info => {
                averageRating = (averageRating + info.data().finalRating) / noCustomer; 
                noCustomer++;
            })
        })
        businessList.push(doc.data())
        let businessList = [...businessList];
        let index = businessList.findIndex(list => list.businessID === doc.data().businessID);
        businessList[index] = {
            ...businessList[index],
            finalRating: averageRating
        }
    });

    businessReceived(businessList);  
}     