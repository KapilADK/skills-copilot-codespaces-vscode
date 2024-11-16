// create web server
const express = require('express');
const app = express();
// parse incoming JSON data
app.use(express.json());

// create a comments array
const comments = [];

// create a new comment
app.post('/comments', (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment });
  res.status(201).send();
});

// get all comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// start the server
app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});