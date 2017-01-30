const express = require('express');
const router = express.Router();
module.exports = router;
const db = require('../models/');
const user = db.User;
const page = db.Page;



router.get('/', function(req, res, next){
  console.log("user reached users page")
  user.findAll()
  .then(pages=>{
    res.render('users',{names:pages});
  })
  .catch(next)
});

router.get('/:id', function(req, res, next){
  var userSearch = user.findOne({
    where: {id: req.params.id}
  });
  var pageSearch = page.findAll({
    where:{authorId: req.params.id}
  });
  Promise.all([userSearch,pageSearch])
  .then((result)=>{
    console.log(result);
    var usr = result[0];
    var pages = result[1];
    usr.pages = pages;
    console.log(usr);
    res.render('user', {user:usr})
  })
  .catch(next)
})
