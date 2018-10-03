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
             $("#ohc_name").text(ohc.email);
        }).catch(function(error){
            console.log(error.code);
            console.log(error.message);
        })
        //display cardlist
        loadCards();

        $('#enrollBtn').click(function(){
            var id = "";
            var cardname = $('#cardname').val();
            var cardprice = $('#cardprice').val();
            db.collection("card_templates").doc(cardname).set({
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
        //for modal
        $('.modal').modal();
    }else{

    }
});

function loadCards(){
    $("#bodyTable").empty();
    db.collection("card_templates").get().then(function(querySnapShot){
        querySnapShot.forEach(function(doc){
            var cards = doc.data();
            var tr = $("<tr></tr>");
            tr.append("<td><img src='"+cards.imageURL+"'></td>");
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

                    db.collection('card_templates').doc(cards.name).set(cards)
                    .then(function(){
                        loadCards();
                    });
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
                db.collection("card_templates").doc(cards.name).delete().then(function(){
                    tr.remove();
                })
            });

            td.append(editBtn);
            td.append(deleteBtn);
            tr.append(td);
            $("#bodyTable").append(tr); 
        })
        $('.modal').modal();
    })
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