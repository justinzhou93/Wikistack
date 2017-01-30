var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging:false});

var Page = db.define('page',{
  title: {type: Sequelize.STRING, allowNull:false},
  urlTitle: {type: Sequelize.STRING, allowNull:false},
  content: {type: Sequelize.TEXT, allowNull:false},
  status: Sequelize.ENUM('open', 'closed'),
  date: {type: Sequelize.DATE, defaultValue: Sequelize.NOW}
},{
  hooks:{
    beforeValidate: function(page) {
      if (page.title) {
        // Removes non-alphanumeric characters and make whitespace underscore
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
      }
    }
  },
  getterMethods:{
    route: function(){
      return "/wiki/" + this.urlTitle;
    }
  }
})

var User = db.define('user',{
  name: {type: Sequelize.STRING, allowNull:false},
  email: {type: Sequelize.STRING, allowNull:false, unique:true, validate:{isEmail:true}}
})

Page.belongsTo(User,{as:'author'});

module.exports= {Page:Page, User:User};
