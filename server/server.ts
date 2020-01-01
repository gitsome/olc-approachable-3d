import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;

// create server
const app = express();


// create endpoints to handle LTI Tool Launch Endpoints

// handle requests for static pages
app.use('static', express.static(path.join(__dirname + '/../../client/build/')));

// serve static files from the React app

// The "catchall" handler: for any request that doesn't
app.get('*', (req, res) => {
  console.log("returngin this:", path.join(__dirname + '/../../client/build/index.html'));
  res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

console.log(`starting server on port: ${PORT}`);

// start listening
app.listen(PORT);