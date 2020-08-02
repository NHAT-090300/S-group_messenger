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
      return res.status(500).json({
        message: 'Failed',
      });
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
          return res.redirect('/');
        }
        res.flash('password failed', 'success');
        return res.redirect('/login');
      }
      res.flash(`haven't user`, 'success');
      return res.redirect('/login');
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line require-jsdoc
  async postRegisterNumber(req, res) {
    try {
      const {firstName, lastName, phoneNumber, password} = req.body;
      const findUser = await knex('users')
      .where({phoneNumber: phoneNumber})
      .first();
      console.log(findUser);
      if (findUser == undefined) {
        await this.service.registerUserByPhone(phoneNumber, firstName, lastName, password);
        return res.json({
          message: 'create user success',
        });
      } else {
        throw new Error('user already exists');
      }
    } catch (err) {
      throw new Error(err);
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
    } catch (err) {
      return res.json({
        message: err.message,
      });
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
