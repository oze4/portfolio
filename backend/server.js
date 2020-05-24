const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const winston = require('./config/winston');
const mongoose = require('mongoose');
const path = require('path');
const posts = require('./routes/postRoute');
const users = require('./routes/userRoute');
const actors = require('./routes/actorRoute');
const images = require('./routes/imageRoute');
const dbURI = process.env.REACT_APP_DB_URI || require('./secrets').dbURI;

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  return next();
});

mongoose
  .connect(
    dbURI,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

app.use(bodyParser.json({ extended: true, limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Sets up logging for different environments
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: winston.stream }));
}
else {
  app.use(morgan('dev'));
}

app.use('/posts', posts);
app.use('/users', users);
app.use('/images', images);
// For ActivityPub/WebFinger
app.use('/actors', actors);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', 'client', 'build', 'index.html')
    );
  });
}

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
