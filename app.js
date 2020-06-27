const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/database.js');
const port = 8090;

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(require('./routes'));
app.use('/public', express.static('public'));
app.set('secretKey', 'nodeCRUDRestApi'); 
app.use(cors());

var whitelist = ['http://localhost:4100', 'http://localhost:8090']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

// Then pass them to cors:
app.use(cors(corsOptions));


// mongoose.connect(dbConfig.url, {
//     useNewUrlParser: true
// }).then(() => {
//     console.log("Database Connected!!!");    
// }).catch(err => {
//     console.log('Database Connection Failed!. Error: ', err);
//     process.exit();
// });

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
