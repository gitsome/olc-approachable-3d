import path from 'path';
import loki from 'lokijs';
import AppServer from './AppServer';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const CREATE_REACT_APP_ROOT = path.join(__dirname + '/../../client/build');

const onDBInit = (dbReference: Loki) => {

  let itemViews = dbReference.getCollection("ITEM_VIEWS");
  if (itemViews === null) {
    dbReference.addCollection("ITEM_VIEWS");
  }

  const appServer = new AppServer(PORT, dbReference, CREATE_REACT_APP_ROOT);
  appServer.start();
};

const db: Loki = new loki('data.db', {
  autoload: true,
  autoloadCallback : () => onDBInit(db),
  autosave: true,
  autosaveInterval: 5000
});