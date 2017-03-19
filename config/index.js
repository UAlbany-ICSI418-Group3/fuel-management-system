var configValues = require('./config');

module.exports = {

    getDbConnectionString: function(){
        return 'mongodb://' + configValues.username + 
        ':' + configValues.pwd + 
        '@ds145039.mlab.com:45039/fuel';
    }
}