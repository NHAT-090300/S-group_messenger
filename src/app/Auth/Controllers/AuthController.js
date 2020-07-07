/* eslint-disable require-jsdoc */
import BaseController from '../../../infrastructure/Controllers/BaseController';
import Service from '../Services/AuthService';
import knex from '../../../database/connection';
import bcrypt from 'bcrypt';

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
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(email);
      await knex('users')
      .insert({
        firstName,
        lastName,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg',
        email,
        password: hashedPassword,
      });
      return res.json({
        message: 'created',
      });
    } catch (error) {
      console.log(error);
      return res.json({
        message: 'Failed',
      });
    };
  };

  async postLogin(req, res) {
    const {email, password} = req.body;
    const user = await knex('users')
    .where({email: email})
    .first();

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (match) {
        req.session.user = user;
        console.log(req.session.user.id);
        return res.redirect('/');
      }
      return res.redirect('/login');
    };
  };

  // eslint-disable-next-line require-jsdoc
  async postRegisterNumber(req, res) {
    try {
      const {firstName, lastName, phoneNumber} = req.body;
      const findUser = await knex('users')
      .where({phoneNumber: phoneNumber})
      .first();
      console.log(findUser);
      if (findUser == undefined) {
        const data = await knex('users')
        .insert({
          firstName,
          lastName,
          avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/User_font_awesome.svg',
          phoneNumber,
        });
        console.log(data);
        return res.json({
          message: 'created',
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        message: 'failed',
      });
    }
  };

  logout(req, res) {
    req.session.destroy();
    return res.redirect('/login');
  };
}

export default AuthController;
