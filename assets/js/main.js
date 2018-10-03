var config = {
    apiKey: "AIzaSyATT2nSmDhKdC69bR-Mxu_4wq15AqAp9Lo",
    authDomain: "ohc-iot.firebaseapp.com",
    databaseURL: "https://ohc-iot.firebaseio.com",
    projectId: "ohc-iot",
    storageBucket: "ohc-iot.appspot.com",
    messagingSenderId: "51112269887"
  };

var ohc;
firebase.initializeApp(config);
const db = firebase.firestore();
const settings = {
    "timestampsInSnapshots": true
}
db.settings(settings);

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        db.collection('dashboard_users').doc(uid).get().then(function(doc){
             ohc = doc.data();
             
        }).catch(function(error){
            console.log(error.code);
            console.log(error.message);
        })
    }
});