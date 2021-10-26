const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const fileHelper = require('./util/file.helper');
const util = require('./util');
const middleware = require('./routes/middleware');

const adminRouter = require('./routes/nokiaAdmin');
const workingRouter = require('./routes/nokiaWorking'); 
const reportRouter = require('./routes/nokiaReport'); 

const cronJob = require('./job');

const app = express();

// cors
app.use(cors());
app.options('*', cors());

// compression
app.use(compression({ level: 9 }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// max limit 5 mb
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-nokia/images', express.static(path.join(__dirname, 'uploads')));

// app.post('/purchase', (req, res) => {
//   /** just a test api to get the razor pay test data */
//   res.json(req.body);
// });

app.use('/api-nokia/nokia/', (req, res, next) => {
  // send it to middleware
console.log("api req complete");
  middleware.entry(req, res, next);
});

console.log("middleware - ok");
app.use('/api-nokia/nokia/nokiaadmin/', adminRouter);
app.use('/api-nokia/nokia/nokiaAdmin/', adminRouter);
app.use('/api-nokia/nokia/nokiaWorking/', workingRouter);
app.use('/api-nokia/nokia/nokiaReport/', reportRouter);
// initiliaze all routers here

// path for upload images
fileHelper.init(app, __dirname + '/uploads/', 'nokia');

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //render the error page
  res.status(err.status || 500);
  res.render('error');
});

util.initApp();

setInterval(() => {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
  // two minutes memory check
}, 120000);

module.exports = app;
