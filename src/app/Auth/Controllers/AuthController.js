/* eslint-disable require-jsdoc */
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Service from '../Services/AuthService';
import knex from '../../../database/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import firebase from '../../../database/firebase.js';

class AuthController extends BaseController {
  constructor() {
    super();
    this.service = Service.getService();
  };

  register(req, res) {
    return res.render('app/auth/register');
  }

  registerByEmail(req, res) {
    return res.render('app/auth/register-email');
  }

  registerByPhone(req, res) {
    return res.render('app/auth/register-phone');
  }

  loginPhoneNumber(req, res) {
    return res.render('app/login-phone-number');
  }

  resetPassword(req, res) {
    return res.render('app/reset-password');
  }

  redirectHome(req, res) {
    return res.redirect('/conversations');
  }

  home(req, res) {
    return res.render('app/conversation/index');
  }

  login(req, res) {
    return res.render('app/login');
  }

  async postRegisterEmail(req, res) {
    try {
      const {firstName, lastName, email, password} = req.body;
      return this.service.RegisterEmail(email, password, firstName, lastName);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    };
  };

  async postLogin(req, res) {
    try {
      const {email, password} = req.body;
      const user = await knex('users')
      .where({email: email})
      .first();
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          await firebase.auth().signInWithEmailAndPassword(email, password);
          console.log(firebase.auth().currentUser.emailVerified);
          if (firebase.auth().currentUser.emailVerified) {
            const token = jwt.sign({id: user.id}, 'secret');
            return res.json(token);
          } else {
            throw new Error(`please!, Check your email,You haven't confirmed the email.`);
          }
        }
        throw new Error(`Wrong password! please, enter your password again`);
      }
      throw new Error('Account not found!  please, try login again');
    } catch (error) {
      console.log(error.message);
      return res.status(402).json(error.message);
    }
  };

  // eslint-disable-next-line require-jsdoc
  async postRegisterNumber(req, res) {
    try {
      const {firstName, lastName, phoneNumber, password} = req.body;
      const data = await this.service.registerByPhone(phoneNumber, firstName, lastName, password);
      return res.json({
        data,
        message: 'create user success',
      });
    } catch (err) {
      return res.json({
        message: err.message,
      });
    }
  };

  async postLoginPhoneNumber(req, res) {
    try {
      const {loginPhone, loginPassword} = req.body;
      const user = await knex('users')
      .where({phoneNumber: loginPhone})
      .first();
      console.log(user);
      if (user) {
        const match = await bcrypt.compare(loginPassword, user.password);
        console.log(match);
        if (match) {
          const token = jwt.sign({id: user.id}, 'secret');
          return res.json({
            user,
            token: token,
          });
        } else {
          throw new Error('Wrong password! please, enter your password again');
        }
      } else {
        throw new Error('Account not found!  please, try login again');
      }
    } catch (error) {
      res.status(402).json(error.message);
    }
  }

  logout(req, res) {
    const user = firebase.auth().currentUser;
    const token = req.cookies.token;
    const idToken = req.cookies.idToken;
    if ( user ) {
      firebase.auth().signOut();
    }
    if ( token ) {
      res.clearCookie('token');
    }
    if ( idToken ) {
      res.clearCookie('idToken');
    }
    return res.redirect('/login');
  };
}

export default AuthController;
