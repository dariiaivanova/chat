var mongoose = require('./libs/mongoose');
mongoose.set('debug', true);
var async = require('async');

async.series([
    open,
    dropDb,
    requireModels,
    createUsers
], function (err) {
    console.log(arguments);
    mongoose.disconnect();
});


function open(callback) {
    mongoose.connection.on('open', callback);
}


function dropDb(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback){
    require('./models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback){
        mongoose.model(modelName).ensureIndexes(callback);
    }, callback)
}

function createUsers(callback) {
    var users = [
        {username: 'Vasya', password: 'superpuper'},
        {username: 'Petya', password: 'superpuper'},
        {username: 'admin', password: 'thetruehero'}
    ];
   async.each(users, function(userData, callback) {
       var user = new mongoose.models.User(userData);
       user.save(callback);
   }, callback)
}


