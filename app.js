var express = require('express');
// 加载静态资源模块serve-static
var serveStatic = require('serve-static');
// 加载表单序列化模块
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();

// 设置视图路径
app.set('views','./views/pages');
// 设置模板引擎为jade
app.set('view engine','jade');
// 指定读取静态资源的路径为bower_components文件夹（这里只加载bootstrap中的 css js）
app.use(serveStatic('bower_components'));
app.use(bodyParser.urlencoded());
// 监听端口
app.listen(port);

console.log('imooc started on port:' +port);

// 加载index page并指定访问路径
app.get('/',function(req,res){
  res.render('index',{
    title: 'nodeweb 首页',
    movies: [{
      title : 'super man',
      _id: 1,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    },{
      title : 'super man',
      _id: 2,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    },{
      title : 'super man',
      _id: 3,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    },{
      title : 'super man',
      _id: 4,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    },{
      title : 'super man',
      _id: 6,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    },{
      title : 'super man',
      _id: 7,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
    },
    ]

  });
});

// 加载detail page
//访问路径就是localhost :3000/movie/id 
app.get('/movie/:id',function(req,res){
  res.render('detail',{
    title:'nodeweb 详情页',
    movie: {
      doctor: 'woqu',
      country: 'mememe',
      title: 'superman',
      year: 2011,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
      language: 'chinese',
      flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
      summary: 'woxiuansdnasnmn url.format(dasCsdasdasdasdassssssssssssd);'
    }
  });
});

// 加载admin page
app.get('/admin/movie',function(req,res){
  res.render('admin',{
    title:'nodeweb 后台登陆',
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

// 加载list page
app.get('/admin/list',function(req,res){
  res.render('list',{
    title:'nodeweb 列表页',
    movies: {
      doctor: 'woqu',
      _id: 1,
      country: 'chinese',
      title: 'superman',
      year: 2011,
      poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
      language: 'chinese',
      flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
      summary: 'woxiuansdnasnmn url.format(dasCsdasdasdasdassssssssssssd);'
    }
  });
});