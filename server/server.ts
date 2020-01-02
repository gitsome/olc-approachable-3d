import path from 'path';
import express from 'express';
import passport from 'passport';
import LTIStrategy from 'passport-lti';

const PORT = process.env.PORT || 3000;

console.log('launching with conusmerkey:', process.env.consumerKey);

const strategy = new LTIStrategy({
    consumerKey: process.env.consumerKey,
    consumerSecret: process.env.consumerSecret
    // pass the req object to callback
    // passReqToCallback: true,
    // https://github.com/omsmith/ims-lti#nonce-stores
    // nonceStore: new RedisNonceStore('testconsumerkey', redisClient)
}, (lti: any, done: any) => {
    // LTI launch parameters
    console.dir(lti);
    // Perform local authentication if necessary
    return done(null, lti);
});

passport.use(strategy);

// create server
const app = express();

// serve static files from the React app
app.use('/application', express.static(path.join(__dirname + '/../../client/build')));

// create endpoints to handle LTI Tool Launch Endpoints passport.authenticate('lti'),
app.post('/launch', (req, res) => {
  console.log('launch request', JSON.stringify(req.body, null, 2));
  res.send('success');
});

// The "catchall" handler: for any request that doesn't match any previous endpoints
app.get('/application/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

console.log(`starting server on port: ${PORT}`);

// start listening
app.listen(PORT);