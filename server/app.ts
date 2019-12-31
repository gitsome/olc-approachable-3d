import express from 'express';

const PORT = process.env.PORT || 3000;

// create server

// create endpoints to handle LTI Tool Launch Endpoints



const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));