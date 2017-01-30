const express = require( 'express' );
const app = express();
const nunjucks = require( 'nunjucks' );
const PORT = 3000;


const path = require('path');
let wikiRouter = require('./routes/wiki.js');
let usersRouter = require('./routes/users.js');
let db = require('./models/index.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// module.exports = app;

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);
// point nunjucks to the proper directory for templates. nocache means to look at directory each time
nunjucks.configure('views', {noCache:true});
app.set('view engine', 'html'); //
app.set('views', __dirname + '/views');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res, next){
  console.log("user reached home page")
  res.redirect('/wiki')
})

app.use(function(err,req,res,next){
  console.error(err);
  res.status(500).send(err.message);
})

app.use('/wiki/', wikiRouter);
app.use('/users/', usersRouter);

db.User.sync({force:false})
.then(()=>{
  return db.Page.sync({force:false})})
  .then(()=>{
    app.listen(PORT, function(){
      console.log("listening on PORT 3000");
    })
  })
