var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
// 加载函数库
// Underscor.js定义了一个下划线（_）对象，类似jquery的$
// 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
// 集合（collection）、数组（array）、函数（function）、
// 对象（object）和工具（utility）五大类
// 说白了就是一个对以上数据有强大处理能力的模块
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// 加载admin page
exports.new = function(req,res){
    Category.find({}, function(err, categories) {
      res.render('admin',{
        title:'电影数据录入',
        categories: categories,
        movie: {}
    });
    });
    
};

// admin uodate movie
exports.update = function(req, res){
    
    var id = req.params.id;
    if(id) {
      Movie.findById(id, function(err, movie) {
        
        if (err) { console.log(err); }

        Category.find({}, function(err, categories) {
          if (err) { console.log(err); }
            res.render('admin',{
            title: '电影数据更新',
            movie: movie,
            categories: categories
          });
        });
        
      });
    }
    
};

// save poster 作为数据处理上传中间件
exports.savePoster = function(req, res, next) {
  // 获取到长传文件的描述数据
  console.log('+++++++++++++++++++++++++++++++');
  // req.files 得到是上传文件对象
  // {表单名(uploadPoster): {上传文件属性}}
  // 这些属性包括一下内容：
  // filelName\originalFilename\path\headers\size\name\type
  // 其中这里的path不是指文件的原始路径而是内存路径
  // fileName指字段名称 这里是指uploadPoster
  console.log(req.files);
  
  var posterData = req.files.uploadPoster;
  // 上传文件的地址
  var filePath = posterData.path;
  // 获取上传文件的原始名字
  var originalFilename = posterData.originalFilename;

  if (originalFilename) {
    fs.readFile( filePath, function(err, data) {
      var timestamp = Date.now();
      // 获取原始文件的类型
      var type = posterData.type.split('/')[1];
      // 构建新的文件名
      var poster = timestamp + '.' + type;
      // 指向上传文件储存在服务器的绝对路径
      // path.join 结合合并路径
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
      console.log('-----------------------------');
      console.log(newPath);
      fs.writeFile(newPath, data, function(err) {
        req.poster = poster;
        next();
      });

    });
  }else{
    next();
  }

};

// admin post movie  urlencoded,
exports.save = function(req, res) {
     
    if(!req.body) return res.sendStatus(400);
   
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movieObj, _movie;
    // 检测是否收到中间件传来的req.poster
    if (req.poster) {
      movieObj.poster = req.poster;
    }

    if( id ) {

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

      // 保存分类的ID
      var categoryId = movieObj.categoryId;
      if ( categoryId ) {

        Category.findById(categoryId, function(err, category) {
          
          if (err) { console.log(err); }
          _movieObj = _.extend({category: category.name}, movieObj); 
          // console.log('******************');
          // console.log(_movieObj);
          _movie = new Movie( _movieObj );

          _movie.save(function(err,movie){
            if(err){
              console.log(err);
            }
            console.log(movie);
            category.movies.push(movie._id);
            category.save(function(err, category) {
              res.redirect('/movie/'+movie._id);
            });
          });

        });

      }else if (movieObj.category) {
  
        var category = new Category({
          name: movieObj.category,
          movies: []
        });

        category.save( function(err, category) {
          
          if (err) {
            console.log(err); 
          }
          console.log(category._id);
          movieObj.categoryId = category._id;
          // console.log('+++++++++++++++++++++');
          // console.log(movieObj);
          _movie = new Movie(movieObj);
          _movie.save(function(err,movie){
            if(err){
              console.log(err);
              console.log("xxxxxxx");
            }
            // console.log('+++++++++++++++++++++');
            // console.log(movie);
            category.movies.push(movie._id);
            category.save(function(err, category) {
              res.redirect('/movie/'+movie._id);
            });
          });

        });
      }
      
    }
    
};

exports.detail = function(req,res){
    
  // req.params 获取路径变量值，这里指id这个变量
    var id = req.params.id;
    // 加入电影点击量
    Movie.update({_id: id}, {$inc: {clicksRatio: 1}}, function(err) {
      console.log(err);
    });
    Movie.findById({_id: id}, function(err,movie) {
      // 通过电影数据id来寻找对于的评论数据
      // 然后再通过populat来处理关联数据
      // 最后渲染到页面
      // 先找movieID > comment > 再将movie和comment渲染到页面
      Comment
        .find({movie: id})
        .populate('from', 'name')
        // 注意这里需要mongoose版本>=3.6版本才能这样书写
        .populate('reply.from reply.to', 'name')
        .exec(function(err, comments) {
          res.render('detail',{
            title: movie.title,
            movie: movie,
            comments: comments
          });
      });
      
    });

};

// 加载list page
exports.list = function(req,res) {
    
    Movie.fetch(function(err,movies){
      if(err){
        console.log(err);
      }
      res.render('list',{
        title : '电影列表',
        movies: movies,
      });
    });

};

// 接收删除请求
exports.delete = function(req, res) {
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

};