$(document).ready(() => {

 // register by email
  $('#registerEmail').submit(async (event) => {
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let email = $('#email').val();
    let password = $('#password').val();
    event.preventDefault();
    try {
      //create user in firebase
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      var user = await firebase.auth().currentUser;
      
      user.sendEmailVerification();

      $.notify("check email verification ", "success");

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

// *login by password and emaillink
/*
  $('#loginEmail').on('submit',async (event) => {
  
    event.preventDefault();
    // sign in with email in firebase
    let signEmail = $('#sign-email').val();
    let signPassword = $('#sign-Pwd').val();

    var user = await firebase.auth().currentUser;

    console.log(user.emailVerified)
    // check verification
    try {
      if(user.emailVerified) {
        
        const result = await firebase.auth().signInWithEmailAndPassword(signEmail, signPassword)

        $.notify("login successful", "success");

        // window.location.replace('/');
        $.ajax({
          url: "/login",
          type: "POST",
          data: {
            email,
            password
          },
          success: function (result) {
            console.log(result);
          },
          error: function (xhr, status, err)   {
            console.log(err);
          }
        });

      } else {

        user.sendEmailVerification();
  
        $.notify("sent link email verification", "warn");

        user.updateEmail(signEmail)

        console.log(user.emailVerified)
      }
    } catch (err) {

      $.notify(err, "error");

    }
  });
*/
// login google
  $('#login-google').on('click', (event) => {
    
    event.preventDefault();
    //login with google account
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(() => {

      firebase.auth().getRedirectResult().then(() => {

        $.notify("login by google successful", "warn");
        
        window.location.replace('/');
      
      }).catch((error) => {

        $.notify( error, "error");
      
      });
      
    }).catch((error) => {

      $.notify( error, "error");

    });
  });
});

// sign-in phoneNumber
$(document).ready(function () {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  
  $('#login-phone-number').submit(function (event) {
  
    event.preventDefault();

    const phoneNumber = $('#phoneNumber').val();
    const appVerifier = window.recaptchaVerifier;
  
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
  
        window.confirmationResult = confirmationResult;
  
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
  
        $('#login-phone-step1').remove();
        $('#login-phone-step2').css('display', 'block');
        $('#phone-number-verify').submit(function (event) {
  
          event.preventDefault();
          $.ajax({
            url: "/login-phone-number",
            type: "POST",
            data: {
              phoneNumber,
              firstName,
              lastName
            },
            success: function (result) {
              console.log(result);
            },
            error: function (xhr, status, err) {
              console.log(err);
            }
          });
          const codeNumber = $('input[name="code"]').val();
          confirmationResult.confirm(codeNumber).then(function (result) {
  
            var user = result.user;
            console.log(user);
          }).catch(function (error) {
            $.notify( error, "error");
            window.location.replace('/login-phone-number')
          });
        });
      }).catch(function (error) {
  
        $.notify( error, "error");
  
      });
  })
});
