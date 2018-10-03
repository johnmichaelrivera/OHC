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

console.log(firebase.app().name); // [DEFAULT]


var username;
var password;
var repeat;
var email;

function signup(){
    var valid = true;
    $(".input-field > input").each(function(){
        if($(this).val() == '' && valid){
            valid = false;
            M.toast({html: $(this).parent().text()+"is Required"+$(this).val()});
        }
    });

    if(!valid) return;
    username = $('#username').val();
    password = $('#password').val();
    repeat = $('#repeat').val();
    email = $('#email').val();

    // $(".progress").fadeIn();
    db.collection("users").doc(username).get().then(function(doc) {
        if(doc.exists){
            console.log('exists');
        }else{
            console.log('not exists');
            if(password == repeat){
                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    //handle errors here
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(error.code);
                    console.log(error.message);

                    if(error.code == "auth/invalid-email"){
                        M.toast({html: 'Invalid Email'});
                        console.log(email);
                    }
                    // $('.progress').fadeOut();
                })
            }else{
                M.toast({html: "Passwords do not match"});
                // $('.progress').fadeOut();
            }//end check password
        }
    }).catch(function(error) {
        console.log(error);
    });
}

firebase.auth().onAuthStateChanged(function(user){
    if(user) {
        //user is signed in
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        db.collection('usernames').doc(username).set({
            'email':email
        }).then(function(){
            db.collection('dashboard_users').doc(uid).set({
                'email':email,
                'username':username,
                'uid':uid
            }).then(function(){
                M.toast({html: "Account Creation Successful"});
                window.open("dashboard.html","_self");
            }).catch(function(error){
                console.log(error.code);
                console.log(error.message);
            }).catch(function(error){
                console.log(error.code);
                console.log(error.message);
            })
        })

    }else{

    }
});