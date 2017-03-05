var express = require('express');
var app = express();

//Port for the local server
app.set('port', (process.env.PORT || 3000));

//View engine for html & javascript(We can check which one Chris recommends)
app.set('view engine', 'ejs');

//For our css and javascript files
app.use('/public', express.static(__dirname + '/public'));

//Renders our home page
app.get('/',function(req,res){
    res.render('home');
})

//localhost:3000
app.listen(app.get('port'), function() {
  console.log('Your local server is running on port:', app.get('port'));
});