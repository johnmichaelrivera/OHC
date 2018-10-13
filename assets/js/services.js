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

        loadServices();

        //for modal
        $('.modal').modal();
    }else{

    }
});


function loadServices(){
    $("bodyTable").empty();
    db.collection("service_templates").orderBy('services').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
           var servicelist = doc.data();
           db.collection("category_templates").doc(servicelist.category_id).get().then(function(doc2){
               var categorylist = doc2.data();

               var tr = $("<tr></tr>");
            //    tr.append("<td>"+categorylist.category+"</td>");
               tr.append("<td>"+servicelist.services+"</td>");
               tr.append("<td>"+servicelist.description+"</td>");
              
               $("#bodyTable").append(tr);
               loadHead();
           })
        })
    })
}

function loadHead(){
    var txt = ""
    
        txt = "<tr><th>Category</th><th>Services</th><th>Description</th></tr>";
        $("thead").html(txt);
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