import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import LTIStrategy from 'passport-lti';

const PORT = process.env.PORT || 3000;

const strategy = new LTIStrategy({
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret
}, (lti: any, done: any) => {
  console.log('verification nation:', lti);
  return done(null, 'dope');
});

passport.use(strategy);

// create server
const app = express();

// avoid signature failure for LTI https://github.com/omsmith/ims-lti/issues/4
app.enable('trust proxy');

// body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from the React app
app.use('/application', express.static(path.join(__dirname + '/../../client/build')));

// create endpoints to handle LTI Tool Launch Endpoints
// app.post('/launch', (req, res, next) => {

//   console.log('current time', new Date().getTime(), 'oauth time stamp:', req.body.oauth_timestamp);

//   console.log('request.body:', req.body);

//   passport.authenticate('lti', (err, user, info) => {

//     if (err) {
//       console.log('error:', err);
//       return next(err);
//     }

//     console.log('no error:', user, info);
//     return res.send('success');

//   })(req, res, next);
// });


app.post('/launch', passport.authenticate('lti'), (req, res) => {
  console.log('launch request', req);
  res.send('success');
});

// The "catchall" handler: for any request that doesn't match any previous endpoints
app.get('/application/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

console.log(`starting server on port: ${PORT}`);

// start listening
app.listen(PORT);