var express = require('express');

// 加载静态资源模块serve-static
var serveStatic = require('serve-static');

// 加载表单序列化模块
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
var urlencoded = bodyParser.urlencoded({ extended: true });

// 加载mongoDB数据处理模块
var mongoose = require('mongoose');

// 加载mongoDB数据模型集
var Movie = require('./models/movie');

// 加载函数库
// Underscor.js定义了一个下划线（_）对象，
// 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
// 集合（collection）、数组（array）、函数（function）、
// 对象（object）和工具（utility）五大类
var _ = require('underscore');

// 端口设置
// process.env.PORT 这里是指Node环境中默认的端口
var port = process.env.PORT || 3000;

// 创建服务应用实例
var app = express();

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/imovie');

// 设置视图路径
app.set('views','./views/pages');
// 设置模板引擎为jade
app.set('view engine','jade');

// 指定读取静态资源的路径为bower_components文件夹
// 这里主要是加载bootstrap中的 css js）
app.use(serveStatic('bower_components'));

// 加载时间处理模块
// app.locals 其作用就是注册一个环境变量
// 该环境变量可以在render()函数中传递
// 这里是指可以在模板中使用moment方法
// 在list.jade中我们需要将数据中的时间转换成mm/dd/yyyy
// 那么久需要用到moment，所以这里是为了将该方法能传入到模板中
// 这里如果换成app.locals.dateFun = require('moment');
// 在list模板中我们就需要 #{dateFun(xxxxx).format(MM/DD/YYYY)}
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

  Movie.findById({_id:id}, function(err,movie) {
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
app.post('/admin/movie/new', urlencoded, function(req,res) {
   
  if(!req.body) return res.sendStatus(400);
 
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  
  if( id != '') {

    Movie.findOne({_id:id},function(err,movie) {
      if(err){
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
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
      movies: movies,
    });
  });
});

// 监听端口
app.listen(port);
console.log('imovie started on port:' +port);