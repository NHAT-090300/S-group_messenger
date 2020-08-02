/* eslint-disable require-jsdoc */
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Service from '../Services/AuthService';
import firebase from '../../../database/firebase.js';
import admin from '../../../database/firebase-admin';
import jwt from 'jsonwebtoken';

class AuthMiddleware extends BaseController {
  constructor() {
    super();
    this.service = Service.getService();
  }
  // Check if user is already login
  async hasNotLogined(req, res, next) {
    let x;
    let y;
    // by phone
    jwt.verify(req.cookies.token, 'secret', (err, decoded)=> {
      if (err) {
        return x = false;
        } else {
        return x = true;
        }
    });
    // by google
    try {
      const idToken = req.cookies.idToken;
      if (idToken) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const id = decodedToken.uid;
        if (id) {
          y = true;
        };
      }
    } catch (err) {
      return res.redirect('/');
    }
    // by email
    if (firebase.auth().currentUser || x || y) {
      return res.redirect('/');
    } else {
      return next();
    }
  }
  // Check if user is not already login
  async hasLogined(req, res, next) {
    let x;
    let y;
    // by phone
    jwt.verify(req.cookies.token, 'secret', (err, decoded)=> {
      if (err) {
        return x = false;
        } else {
        return x = true;
        }
    });
    // by google
    try {
      const idToken = req.cookies.idToken;
      if (idToken) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const id = decodedToken.uid;
        if (id) {
          y = true;
        };
      }
    } catch (err) {
      return res.redirect('/login');
    }
    // by email
    if (firebase.auth().currentUser || x || y) {
      return next();
    } else {
      return res.redirect('/login');
    }
  }
}

export default AuthMiddleware;
