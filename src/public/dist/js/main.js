$(document).ready(() => {
 // register by email
  $('#registerEmail').submit(async (event) => {
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let email = $('#email').val();
    let password = $('#password').val();
    event.preventDefault();
    try {
      const addAudio = new Audio('http://taira-komori.jpn.org/sound_os/game01/poka03.mp3');
      //create user in firebase
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      var user = await firebase.auth().currentUser;
      user.sendEmailVerification();
      $.notify("check email verification ", "success");
      addAudio.play();
      //jquery ajax
      $.ajax({
        url: "/register-email",
        type: "POST",
        data: {
          email,
          password,
          firstName,
          lastName
        },
        success: function (result) {
          console.log(result);
        },
        error: function (xhr, status, err)   {
          console.log(err);
        }
      });
    }catch (err) {
      $.notify(err, "error");
    }
  });

  // login by email

  $('#loginEmail').submit(function (event) {
    event.preventDefault();
    const email = $('#sign-email').val();
    const password = $('#sign-Pwd').val();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: {
        email,
        password,
      }
    }).then((data)=> {
      Cookies.set('token', data);
      return window.location.replace('/');
    }).catch((err)=> {
      $.notify(err.responseJSON, "error");
    })
  })


// login by account google
  $('#login-google').on('click', async (event) => {
    event.preventDefault();
    //login with google account
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then( function ( result )  {
      firebase.auth().currentUser.getIdToken(true).then(function(idToken) {    
        console.log(idToken)
        Cookies.set('idToken', idToken);
        return window.location.replace('/');
      }).catch(function(error) {
        $.notify(error.message, "error");
      });
    })
    .catch((error) => {
      $.notify(error.message, "error");

    });
  });

  // login by account facebook
  $('#login-facebook').on('click', async (event) => {
      
    event.preventDefault();
    //login with facebook account
    let provider = new firebase.auth.FacebookAuthProvider();
    
    provider.addScope('user_birthday, email');
    firebase.auth().useDeviceLanguage();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
        console.log(idToken)
        Cookies.set('idToken', idToken);
        return window.location.replace('/');
      }).catch(function(error) {
        $.notify(error.message, "error");

      });
    }).catch(function(error) {
      $.notify(error.message, "error");

    });
  });
});

// register phone number
$(document).ready(function () {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  
  $('#register-phone-number').submit(function (event) {
  
    event.preventDefault();

    const phoneNumber = $('#phoneNumber').val();
    const appVerifier = window.recaptchaVerifier;
  
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
  
        window.confirmationResult = confirmationResult;
  
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const password = $('#password').val();
  
        $('#login-phone-step1').remove();
        $('#login-phone-step2').css('display', 'block');
        $('#phone-number-verify').submit(function (event) {
  
          event.preventDefault();

          const codeNumber = $('input[name="code"]').val();
          
          confirmationResult.confirm(codeNumber).then(function (result) {
            $.ajax({
              url: "/register-phoneNumber",
              type: "POST",
              data: {
                phoneNumber,
                firstName,
                lastName,
                password
              }
            }).then((result) => {
              $.notify(result.message, "info");
            })
            setTimeout(() => {
              window.location.replace('/login-phoneNumber');
            }, 2000);
          }).catch(function (error) {
            $.notify( error.message, "error");
          });
        });
      }).catch(function (error) {
  
        $.notify( error.message, "error");
  
      });
  })

// login phone number
  $('#login-phone-number').on('submit',async (event) => {
  
    event.preventDefault();

    let signPhone = $('#loginPhone').val();
    let signPassword = $('#loginPassword').val();

    $.ajax({
      url: '/login-phoneNumber',
      type: 'POST',
      data: {
        loginPhone: signPhone,
        loginPassword: signPassword
      }
    })
    .then((data)=> {
      console.log(data);
      Cookies.set('token', data.token);
      return window.location.replace('/');
     })
    .catch((err)=> {
      console.log(err)
      $.notify(err.responseJSON, "error");
    })
  });
});

