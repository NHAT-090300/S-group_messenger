$(document).ready(() => {
  $('#registerEmail').submit((event) => {
    let name = $('#firtName').val() + $('#lastName').val();
    let email = $('#email').val();
    let password = $('#password').val();
    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(()=> {
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(() => {
        alert('sent link email verification');
        console.log(user);
      });
    })
    .catch((err) => {
      alert('error', err);
    })
  });

// *login by password and emaillink

  $('#loginEmail').on('submit',(event) => {
    event.preventDefault();
    let signEmail = $('#sign-email').val();
    let signPassword = $('#sign-Pwd').val();
    var user = firebase.auth().currentUser;
    if(user.emailVerified) {
      firebase.auth().signInWithEmailAndPassword(signEmail, signPassword)
      .then(() => {
        alert('login successful');
        window.location.replace('/');
      })
      .catch(function(e) {
        console.log(e)
        alert('An error happened.');
      });
    } else {
      user.sendEmailVerification().then(() => {
        alert('sent link email verification');
      });
    }
  });

// login google

  $('#login-google').on('click', (event) => {
    event.preventDefault();

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(() => {
      firebase.auth().getRedirectResult().then(() => {
        alert('login by google successful')
        window.location.replace('/');
      }).catch((error) => {
        alert(error.message);
      });
    }).catch((error) => {
      alert(error.message);
    });
  });
});

