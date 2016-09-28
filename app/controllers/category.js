var Category = require('../models/category');

exports.new = function(req, res) {
     
  res.render('category',{
    title: '电影分类设置录入',
    category: {}
  });
};

exports.save = function(req, res) {
     
  var _category = req.body.category;
  var category = new Category(_category);
  category.save(function(err,category){
    if(err){
      console.log(err);
    }
    res.redirect('/movie/category/list');
  });

};

exports.list = function(req, res) {
     
  Category.fetch(function(err, categories){
    if(err){
      console.log(err);
    }
    res.render('categorylist',{
      title : '电影分类设置列表',
      categories: categories,
    });
  });

};


