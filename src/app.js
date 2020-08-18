import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import 'dotenv/config';
import flash from 'flash-express';
import initRoutes from './config/routes';

const app = express();

// cookieParser
app.use(cookieParser());
// flash-express
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'pug');

// Use the session middleware
app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new (require('express-pg-session')(session))(),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: {maxAge: 30 * 24 * 60 * 60 * 1000}, // 30 days
}));

initRoutes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
