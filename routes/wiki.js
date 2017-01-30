const express = require('express');
const router = express.Router();
module.exports = router;
let db = require('../models/');
let page = db.Page;
let user = db.User;


// router.get('/', function(req, res, next){
//   console.log("user reached home page")
//   res.render('index');
// })

router.get('/', function(req, res, next){
  console.log("user reached home page")
  page.findAll()
  .then(pages=>{
    res.render('index.html', {pages:pages});
  })
  .catch(next)
})

router.post('/', function(req, res, next){
  user.findOrCreate({
    where:{
      name: req.body.name,
      email: req.body.email
    }
  })
  .spread((user,alreadyExistBool)=>{
    console.log(req.body);
    return page.create({
      title:req.body.title,
      content:req.body.text,
      status:req.body.status,
      tags:req.body.tags
    })
    .then(createdPage=>{
      return createdPage.setAuthor(user);
    })
  })
  .then(page=>{
    res.redirect(page.route)
  })
  .catch(next);
})

router.get('/add', function(req,res,next){
  res.render('addpage',{showForm:true})
})

router.get('/:urlTitle', function (req, res, next) {
  var urlTitle = req.params.urlTitle;
  page.findOne({
    where: {
      urlTitle: urlTitle
    }
  })
  .then((pg)=>{
    if([pg] === null){
      return next(new Error('That page was not found!'))
    }
    return pg.getAuthor()
      .then(author=>{
        pg.author = author;
        res.render('wikipage', {
          page:pg
        })
      })
  })
  .catch(next)
});
