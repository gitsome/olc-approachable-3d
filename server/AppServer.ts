import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import passport, { Strategy } from 'passport';
import LTIStrategy from 'passport-lti';
import session from 'express-session';
import https from 'https';
import fs from 'fs-extra';
import groupBy from 'lodash.groupby';

import ltiLaunchHandler from './ltiLaunchHandler';
import devLaunchHandler from './devLaunchHandler';
import DevStrategy from './DevStrategy';

const isDev = process.env.dev && process.env.dev === 'true';

let launchStrategy: Strategy;

if (isDev) {
  launchStrategy = new DevStrategy();
} else {
  launchStrategy = new LTIStrategy({
    consumerKey: process.env.consumerKey,
    consumerSecret: process.env.consumerSecret
  }, (ltiData: any, done: any) => {

    console.log('ltiData ===========================================>');
    console.log(JSON.stringify(ltiData, null, 2));

    return done(null, {
      user_id: ltiData.user_id,
      sectionId: ltiData.sectionId,
      itemId: ltiData.itemId
    });
  });
}

class AppServer {

  private port: number;
  private db: Loki;
  private createReactAppRoot: string;

  constructor (port: number, db: Loki, createReactAppRoot: string) {
    this.port = port;
    this.db = db;
    this.createReactAppRoot = createReactAppRoot;
  }

  start () {

    passport.use(launchStrategy);

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

    // in memory sessions for demo
    app.use(session({
      secret: 'demo',
      resave: false,
      saveUninitialized: true,
    }));

    // body parsing
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // allow passport to be used ( must be used after other middleware ) https://stackoverflow.com/questions/16781294/passport-js-passport-initialize-middleware-not-in-use
    app.use(passport.initialize());


    /* ============ AUTHENTICATION (LTI) ============ */

    if (isDev) {
      app.get('/launch/:sectionId/:sectionName/:itemId', passport.authenticate('lti'), (req, res) => { return devLaunchHandler(req, res, this.db); });
    } else {
      app.post('/launch', passport.authenticate('lti'), (req, res) => { return ltiLaunchHandler(req, res, this.db); });
    }


    /* ============ API REQUEST HANDLERS ============ */

    app.get('/api/user', (req, res) => {

      if (req.session === undefined || req.session.passport === undefined) {
        throw new Error('invalid_user_session');
      }

      const user = req.session.passport.user as any;

      const itemViewsCollection = this.db.getCollection("ITEM_VIEWS");
      const itemViews = itemViewsCollection.find({user_id: user.user_id});

      const itemsBySection = groupBy(itemViews, (itemView) => {
        return itemView.sectionId;
      });

      const mappedSections = Object.keys(itemsBySection).map((sectionId) => {
        const name = itemsBySection[sectionId][0].sectionName;
        return {
          id: sectionId,
          name: name,
          items: itemsBySection[sectionId].map((itemView) => { return itemView.itemId; })
        };
      });

      res.send({sections: mappedSections});
    });

    app.get('/api/clear', (req, res) => {

      if (req.session === undefined || req.session.passport === undefined) {
        throw new Error('invalid_user_session');
      }

      const user = req.session.passport.user as any;

      const itemViewsCollection = this.db.getCollection("ITEM_VIEWS");
      const itemViews = itemViewsCollection.findAndRemove({user_id: user.user_id});

      res.redirect('/');
    });


    /* ============ STATIC FILES SERVER CONFIGS ============ */

    app.use('/', express.static(this.createReactAppRoot))


    /* ============ CREATE REACT APP CATCH ALL ============ */

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
    });


    /* ============ START ACCEPTING REQUESTS ============ */

    if (isDev) {

      // local dev requires https, you will need to create a local server.key and server.cert file and place it in the build directory
      https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
      }, app)
      .listen(this.port, () => { console.log(`Example app listening on port ${this.port}`)});

    } else {

      // not dev assumes this is launched into a Heroku app. The UI needs HTTPS to do WebVR, so if in Heroku, it handles the SSL and talks
      // to this NodeJS server via HTTP.
      app.listen(this.port, () => { console.log(`Example app listening on port ${this.port}`)});
    }
  }
}

export default AppServer;