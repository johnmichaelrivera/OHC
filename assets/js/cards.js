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
        //display cardlist
        loadCards();

        $('#cardimage').on('change', function(event){
             selectedFile = event.target.files[0];
        });

        $('#editcardimage').on('change', function(event){
            selectedFile = event.target.files[0];
       });

        $('#enrollBtn').click(function(){
            var filename = selectedFile.name;
            var storageRef = firebase.storage().ref(filename);
            var uploadTask = storageRef.put(selectedFile);

            uploadTask.on('state_changed', function(snapshot){
                M.toast({html: "Enrolling Card Please wait..."});
            }, function(error){
                // console.log(error.mesage);
            }, function(){
                // imageURL = uploadTask.snapshot.ref.getDownloadURL();
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    // console.log('File available at', downloadURL);
                    imageURL = downloadURL;
            //add to collection
            var id = "";
            var cardname = $('#cardname').val();
            var cardprice = $('#cardprice').val();
            db.collection("card_templates").doc(cardname).set({
                'imageURL': imageURL,
                'name':cardname,
                'price':cardprice
            }).then(function(){
                M.toast({html: "Card enrollment Successfull"});
                loadCards();
            }).catch(function(error){
                console.log(error.code);
                console.log(error.message);
            });

                  });
            });
            /*var id = "";
            var cardname = $('#cardname').val();
            var cardprice = $('#cardprice').val();
            db.collection("card_templates").doc(cardname).set({
                'imageURL': imageURL,
                'name':cardname,
                'price':cardprice
            }).then(function(){
                M.toast({html: "Card enrollment Successfull"});
                loadCards();
            }).catch(function(error){
                console.log(error.code);
                console.log(error.message);
            });*/

            });
        //for modal
        $('.modal').modal();
    }else{

    }
});

function loadCards(){
    $("#bodyTable").empty();
    db.collection("card_templates").orderBy('name','asc').get().then(function(querySnapShot){
        querySnapShot.forEach(function(doc){
            var cards = doc.data();
             imgurl = cards.imageURL.split('/').pop()
             imgname = imgurl.split('?');
             imgname = imgname[0];

            var tr = $("<tr></tr>");
            tr.append("<td width='4%'><img src='"+cards.imageURL+"' height='100px'></td>");
            tr.append("<td>"+cards.name+"</td>");
            tr.append("<td>Php "+formatNumber(cards.price)+"</td>");
            var td = $("<td></td>")
            var editBtn = $('<a class="btn-floating blue modal-trigger" href="#editCard"> <i class="material-icons">edit</i></a>');
            var deleteBtn = $('<a class="btn-floating blue modal-trigger"><i class="material-icons">delete_forever</i></a>');


            editBtn.click(function(){
                $('#editcardname').val(cards.name);
                $('#editcardprice').val(cards.price);
                M.updateTextFields();
                var editFxn = function(e){
                    cards.name = $('#editcardname').val();
                    cards.price = $('#editcardprice').val();

                    var editfilename = selectedFile.name;
                    // var editstorageRef = firebase.storage().ref(editfilename);
                    // var edituploadTask = storageRef.put(selectedFile);

                    console.log(editfilename);

                    /*db.collection('card_templates').doc(cards.name).set(cards)
                    .then(function(){
                        loadCards();
                    });*/
                    $(this).unbind(e);
                }

                $('#editBtn').bind('click',editFxn);
                var options = {
                    onCloseEnd: function(){
                        $('#editBtn').unbind('click',editFxn);
                    }
                }
                $('.modal#editCard').modal(options);
            });

            deleteBtn.click(function(){

                firebase.storage().ref(imgname).delete().then(function(){
                    console.log(''+imgname+' deleted ');
                    db.collection("card_templates").doc(cards.name).delete().then(function(){
                        tr.remove();
                    })
                }).catch(function(error){
                    console.log(error.code);
                    console.log(error.message);
                })
             
            });

            td.append(editBtn);
            td.append(deleteBtn);
            tr.append(td);
            $("#bodyTable").append(tr); 
            loadHead();
        })
        $('.modal').modal();
    })
}


function loadHead(){
    var txt = ""
    
        txt = "<tr><th width='4%'>Name</th><th></th><th>Price</th>\</tr>";
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