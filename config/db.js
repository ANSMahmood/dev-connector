
const mongoose = require('mongoose');
const config = require('config');

const ConnectDb = () => {

    try{ 
      mongoose.connect(config.get('mongodb'));
      console.log("DataBase Connected");
    } catch(error) {
        console.error(error.message);
    }
}
module.exports = ConnectDb;