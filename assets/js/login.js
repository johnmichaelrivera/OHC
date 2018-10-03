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
        console.log(user.uid);
        window.open("dashboard.html","_self");
    } else {
        console.log('no user');
    }
});

function login(){
    var username = $("#username").val();
    var password = $("#password").val();

    if(username == "" || password == "") return;

    var email;
   db.collection("usernames").doc(username).get().then(function(doc){
        if(doc.exists){
            email = doc.data().email;
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
                //Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(error.code);
                console.log(error.message);
                M.toast({html: "Invalid Username or Password"});
            })
        }else{
            M.toast({html: "Invalid Username or Password"});
        }
    });
    
}