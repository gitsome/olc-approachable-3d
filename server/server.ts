import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import LTIStrategy from 'passport-lti';

const PORT = process.env.PORT || 3000;

const strategy = new LTIStrategy({
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret
}, (ltiData: any, done: any) => {

  console.log('ltiData ===========================================>')
  console.log(JSON.stringify(ltiData, null, 2));

  return done(null, {
    user_id: ltiData.user_id
  });
});

passport.use(strategy);

// user serializtion / deserializtion
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// create server
const app = express();

// avoid signature failure for LTI https://github.com/omsmith/ims-lti/issues/4
app.enable('trust proxy');

// body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow passport to be used ( must be used after other middleware ) https://stackoverflow.com/questions/16781294/passport-js-passport-initialize-middleware-not-in-use
app.use(passport.initialize());

// serve static files from the React app
app.use('/application', express.static(path.join(__dirname + '/../../client/build')));

app.post('/launch', passport.authenticate('lti'), (req, res) => {
  res.send('success');
});

// The "catchall" handler: for any request that doesn't match any previous endpoints
app.get('/application/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

console.log(`starting server on port: ${PORT}`);

// start listening
app.listen(PORT);