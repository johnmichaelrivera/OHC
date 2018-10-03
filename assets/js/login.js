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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        
    } else {
        
    }
});

function login(){
    var username = $("#username").val();
    var password = $("#password").val();
   
    if(username == "" || password == "") return;
    db.collection("usernames").doc(username).get().then(function(doc) {
       console.log(doc);
    });
    
}
