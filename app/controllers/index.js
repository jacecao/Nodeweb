var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req,res){
    
    Category
      .find({})
      .populate({
        path: 'movies',
        options: {limit: 5}
      })
      .exec(function(err,categories){
      if(err) {
        console.log(err);
      }
      res.render('index', {
        title : 'Imovie 首页',
        categories: categories
      });
    });
      
};

exports.search = function(req,res){
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p) || 0;
    // 每页有多少个数据
    var count = 2;
    // 当前页最后一个值的索引
    var index = page * count;

    if( catId ) {
      Category
        .find({_id: catId})
        // 这里是嵌套查询数据
        .populate({
          // 指定关联的数据表
          path: 'movies',
          // 获取此数据表的哪些字段
          select: 'title poster',
          // 对获取到的数据配置读取限制
          // options: {limit:2, skip: index }
        })
        .exec(function(err, categories) {
          if(err) {
            console.log(err);
          }
          var category = categories[0] || {};
          var movies = category.movies || [];
          var results = movies.slice(index, index + count);
          res.render('results', {
            title : '分类列表',
            keyword: category.name,
            catId: ('cat='+catId),
            currentPage: (page+1),
            totalPage: Math.ceil(movies.length / count),
            movies: results
          });  
        });

    }else {

      Movie
        .find( {title: new RegExp(q, 'g')} )
        .exec( function(err, movies) {
          if(err) {
            console.log(err);
          }
          var results = movies.slice(index, index + count);
          res.render('results', {
            title : '搜索结果',
            keyword: q,
            currentPage: (page+1),
            totalPage: Math.ceil(movies.length / count),
            movies: results
          });
        });
    }
    
      
};