import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import LTIStrategy from 'passport-lti';

const PORT = process.env.PORT || 3000;

console.log('starting with:', process.env.consumerKey, process.env.consumerSecret);

const strategy = new LTIStrategy({
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret
});

passport.use(strategy);

// create server
const app = express();

app.enable('trust proxy');

// body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve static files from the React app
app.use('/application', express.static(path.join(__dirname + '/../../client/build')));

// create endpoints to handle LTI Tool Launch Endpoints
app.post('/launch', (req, res, next) => {

  console.log('current time', new Date().getTime(), 'oauth time stamp:', req.body.oauth_timestamp);

  console.log('request.body:', req.body);

  passport.authenticate('lti', (err, user, info) => {

    if (err) {
      console.log('error:', err);
      return next(err);
    }

    console.log('no error:', user, info);
    return res.send('success');

  })(req, res, next);
});


// app.post('/launch', passport.authenticate('lti'), (req, res) => {
//   console.log('launch request', req);
//   res.send('success');
// });

// The "catchall" handler: for any request that doesn't match any previous endpoints
app.get('/application/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

console.log(`starting server on port: ${PORT}`);

// start listening
app.listen(PORT);