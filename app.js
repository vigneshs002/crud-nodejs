const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/database.js');
const port = 8080;

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(require('./routes'));
app.set('secretKey', 'nodeCRUDRestApi'); 
app.use(cors());

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected!!!");    
}).catch(err => {
    console.log('Database Connection Failed!. Error: ', err);
    process.exit();
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
