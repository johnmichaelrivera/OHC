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
             $("#ohc_name").text(ohc.username);
        }).catch(function(error){
            console.log(error.code);
            console.log(error.message);
        })

        loadTransactions();
    }else{

    }
});



function loadTransactions(){
    $('#bodyTable').empty();
    db.collection('transactions').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            var transactions = doc.data();
            db.collection('users').doc(transactions.userID).get().then(function(doc2){
                var user = doc2.data();
           db.collection('services').doc(transactions.services[0]).get().then(function(doc3){
                var cardservices = doc3.data();

                var tr = $("<tr></tr>");
                tr.append("<td>"+transactions.clinicID+"</td>");
                tr.append("<td>"+transactions.representative+"</td>");
                tr.append("<td>"+user.fullName+"</td>");
                tr.append("<td>"+transactions.cardID+"</td>");
                tr.append("<td>"+cardservices.name+"</td>");
                $("#bodyTable").append(tr); 
                loadHead();

           });//end services
            });//end users
            
            /*var tr = $("<tr></tr>");
            tr.append("<td>"+transactions.clinicID+"</td>");
            tr.append("<td>"+transactions.cardID+"</td>");
            tr.append("<td>"+transactions.representative+"</td>");

            $("#bodyTable").append(tr);*/
            });
    });
}

function loadHead(){
    var txt = ""
    
        txt = "<tr><th>Clinic</th><th>Representative</th>\
            <th>Client</th><th>Card ID</th>\
            <th>Service</th></tr>";
        $("thead").html(txt);
}

function logout(){
    firebase.auth().signOut().then(function() {
        window.open('index.html','_self');
      }, function(error) {
        M.toast({html: "Sign Out Error"});
        console.error('Sign Out Error', error);
      });
}