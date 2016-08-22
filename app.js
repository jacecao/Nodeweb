var express = require('express');
// 加载静态资源模块serve-static
var serveStatic = require('serve-static');
// 加载表单序列化模块
var bodyParser = require('body-parser');

//加载mongoDB数据处理模块
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');

//端口设置
var port = process.env.PORT || 3000;
var app = express();

//连接数据库
mongoose.connect('mongodb://localhost/imovie');

// 设置视图路径
app.set('views','./views/pages');
// 设置模板引擎为jade
app.set('view engine','jade');
// 指定读取静态资源的路径为bower_components文件夹（这里只加载bootstrap中的 css js）
app.use(serveStatic('bower_components'));
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.moment = require('moment');

// 加载index page并指定访问路径
app.get('/',function(req,res){
  Movie.fetch(function(err,movies){
    if(err) {
      console.log(err);
    }

    res.render('index', {
      title : 'Imovie 首页',
      movies: movies
    });
  });
});

// 加载detail page
//访问路径就是localhost :3000/movie/id 
app.get('/movie/:id',function(req,res){
  
  var id = req.params.id;

  Movie.findById(id,function(err,movie){
    res.render('detail',{
      title:'Imovie'+movie.title,
      movie: movie
    });
  });

});


// 加载admin page
app.get('/admin/movie',function(req,res){
  res.render('admin',{
    title:'Imovie录入',
    movie: {
      title: '',
      doctor: '',
      country: '',
      poster: '',
      language: '',
      flash:'',
      summary: '',
      year: ''
    }
  });
});


//admin uodate movie
app.get('/admin/update/:id',function(req,res){
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie){
      res.render('admin',{
        title: 'Imovie更新',
        movie: movie
      }); 
    });
  }
});


//admin post movie
app.post('/admin/movie/new', function(req,res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  if( id != 'undefined'){
    Movie.findById(id,function(err,movie) {
      if(err){
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      console.log(_movie);
      _movie.save(function(err, movie) {
        if(err){
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);
      });
    });
  }else{
    _movie = new Movie({
      title: movieObj.title,
      doctor: movieObj.doctor,
      country: movieObj.country,
      language: movieObj.language,
      poster: movieObj.poster,
      flash: movieObj.flash,
      year: movieObj.year,
      summary: movieObj.summary
    });
    _movie.save(function(err,movie){
      if(err){
        console.log(err);
      }
      res.redirect('/movie/'+movie._id);
    });
  }
});


// 加载list page
app.get('/admin/list',function(req,res){
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err);
    }
    res.render('list',{
      title : 'Imove列表',
      movies: movies
    });
  });
});

// 监听端口
app.listen(port);
console.log('imovie started on port:' +port);