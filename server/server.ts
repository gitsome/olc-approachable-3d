import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;

// create server
const app = express();

// create endpoints to handle LTI Tool Launch Endpoints

// serve static files from the React app
app.use('/application', express.static(path.join(__dirname + '/../../client/build')));


// The "catchall" handler: for any request that doesn't match any previous endpoints
app.get('/application/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../client/build/index.html'));
});

console.log(`starting server on port: ${PORT}`);

// start listening
app.listen(PORT);