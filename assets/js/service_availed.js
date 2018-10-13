var config = {
    apiKey: "AIzaSyATT2nSmDhKdC69bR-Mxu_4wq15AqAp9Lo",
    authDomain: "ohc-iot.firebaseapp.com",
    databaseURL: "https://ohc-iot.firebaseio.com",
    projectId: "ohc-iot",
    storageBucket: "ohc-iot.appspot.com",
    messagingSenderId: "51112269887"
  };

var ohc;
var selectedFile;
var imageURL;
var imgurl;
var imgname;

firebase.initializeApp(config);

console.log(firebase.firestore());
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
        // loadSelectClient();
        loadserviceAvailed();
        //for modal
        $('.modal').modal();
    }else{

    }
});

function loadserviceAvailed(){
    $("#bodyTable").empty();
    db.collection("services").get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                var serviceAvailed = doc.data();
                db.collection("users").doc(serviceAvailed.userID).get().then(function(doc2){
                    var users = doc2.data();
                    db.collection("cards").doc(serviceAvailed.cardID).get().then(function(doc3){
                        var cards = doc3.data();
                        var tr = $("<tr></tr>");
                        tr.append("<td>"+users.fullName+"</td>");
                        tr.append("<td>"+cards.type+"</td>");
                        tr.append("<td>"+serviceAvailed.name+"</td>");
                        tr.append("<td>"+new Date(serviceAvailed.created.seconds*1000).toLocaleString()+"</td>")
                        if(serviceAvailed.used==false){
                            tr.append("<td style='color:green;'><b>Not Used</b></td>");
                        }else if(serviceAvailed.used==true){
                            tr.append("<td style='color:red'><b>Used</b></td>");
                        }

                        $("#bodyTable").append(tr);
                        loadHead();
                    })//end cards
                })//end users
            })//end services availed
    })
}
function loadHead(){
    var txt = ""
    
        txt = "<tr><th>Client</th><th>Card</th><th>Service</th><th>Date</th><th>Status</th></tr>";
        $("thead").html(txt);
}


function loadSelectClient(){
    db.collection("users").get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            var clientList = doc.data();
            var text = $("#selectClient").html();
            text = text+"<option value='"+clientList.uid+"'>"+clientList.fullName+"</option>\n";
            $("#selectClient").html(text);
        })
    })
    $('select').formSelect();
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

function logout(){
    firebase.auth().signOut().then(function() {
        window.open('index.html','_self');
      }, function(error) {
        M.toast({html: "Sign Out Error"});
        console.error('Sign Out Error', error);
      });
}