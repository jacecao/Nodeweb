// 路由文件
// 加载mongoDB数据模型集
var Movie = require('../models/movie');
var Users = require('../models/user');

// 加载函数库
// Underscor.js定义了一个下划线（_）对象，类似jquery的$
// 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
// 集合（collection）、数组（array）、函数（function）、
// 对象（object）和工具（utility）五大类
// 说白了就是一个对以上数据有强大处理能力的模块
var _ = require('underscore');

module.exports = function(app) {
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
  // 访问路径就是localhost :3000/movie/id 
  app.get('/movie/:id',function(req,res){
    
  // req.params 获取路径变量值，这里指id这个变量
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
      title:'Imovie 数据录入',
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


  // admin uodate movie
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

  // 用户注册
  app.post('/user/signup', function(req, res) {
    
    var user = req.body.user;
    
    // 注意在回调函数中返回参数一定不要与其他变量相同
    // 否则会出错
    // 比如下面的users变成user时就不会出现Bug
    // 当没有找到user时程序会自动找本作用域的相同变量
    
    Users.findOne({name: user.name}, function(err, users) {
      if( err ) { console.log(err); }

      if( users ) {

        res.json({
          info: '用户已经存在啦',
          state: 0
        });

      }else{

        var _user = new Users(user);
        _user.save(function(err, users) {
          if(err){
            console.log(err);
          }else{
            res.json({
              info: '用户注册成功',
              state: 1
            });
          }

        });

      }

    });

  });

  // 用户登陆
  app.post('/user/login', function(req, res) {
    
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    Users.findOne({name: name}, function(err, user) {
      if(err) { console.log(err); }
      if( !user ) {
        res.json({
          info: '没有该用户',
          state: 0
        });
      }
      else {

        user.comparePassword(password, function(err, isMatch) {
          
          if(err) { console.log(err); }

          if(isMatch) {
           req.session.user = user;
           return res.redirect('/');
          }
          else {
            res.json({
              info: '密码有错误',
              state: 0
            });
          }
        });
        
      }
    });

  });

  // 用户退出
  app.get('/logout', function(req, res) {
    delete req.session.user;
    delete app.locals.user;
    res.redirect('/');
  });


  // admin post movie  urlencoded, 
  app.post('/admin/movie/new', function(req, res) {
     
    if(!req.body) return res.sendStatus(400);
   
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    
    if( id != 'undefined' && id != '' ) {

      Movie.findById(id, function(err,movie) {
        if(err){
          console.log(err);
        }
        _movie = _.extend(movie, movieObj);
        _movie.save(function(err, _movie) {
          if(err){
            console.log(err);
          }
          res.redirect('/movie/'+_movie._id);
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


  // 接收删除请求
  app.delete('/admin/list',function(req, res) {
    // req.query 主要获取到客户端提交过来的键值对
    // '/admin/list?id=12'，这里就会获取到12
    var id = req.query.id;
    console.log(id);

    if(id) {
      Movie.remove({_id: id}, function(err) {
        if( err ) {
          console.log(err);
        }else{
          res.json({success: 1});
        }
      });
    }

  });
};