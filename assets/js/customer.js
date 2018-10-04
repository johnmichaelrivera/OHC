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

        loadHead();
        loadCustomers();
    }else{

    }
});


function loadCustomers(){
    $('#bodyTable').empty();
    db.collection('users').orderBy('fullName').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            var customers = doc.data();
            var date = new Date(customers.birthday.seconds*1000);
            var year = date.getFullYear();
            // var month = date.getMonth()+1 //getMonth is zero based;
            var locale = "en-us";
            var month = date.toLocaleString(locale, {month: "long"});
            var day = date.getDate();
            var format_date = ""+month+" "+day+", "+year+""; 
            var tr = $("<tr></tr>");
            tr.append("<td>"+customers.fullName+"</td>");
            tr.append("<td>"+format_date+"</td>");
            tr.append("<td>"+customers.gender+"</td>");
            tr.append("<td>"+customers.address+"</td>");
            tr.append("<td>"+customers.email+"</td>");
            tr.append("<td>"+customers.phone+"</td>");

            $('#bodyTable').append(tr);
        })
    });
}
function loadHead(){
    var txt = ""
    
        txt = "<tr><th>Name</th><th>Birthday</th>\
            <th>Gender</th><th>Address</th>\
            <th>Email</th><th>Contact</th></tr>";
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