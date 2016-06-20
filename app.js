var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

// 设置视图路径
app.set('views','./views');
// 设置模板引擎为jade
app.set('view engine','jade');
// 监听端口
app.listen(port);

console.log('imooc started on port:' +port);

// 加载index page并指定访问路径
app.get('/',function(req,res){
  res.render('index',{
    title:'nodeweb 首页'
  });
});

// 加载detail page
//访问路径就是localhost :3000/movie/id 
app.get('/movie/:id',function(req,res){
  res.render('detail',{
    title:'nodeweb 详情页'
  });
});

// 加载admin page
app.get('/admin/movie',function(req,res){
  res.render('admin',{
    title:'nodeweb 后台登陆'
  });
});

// 加载list page
app.get('/admin/list',function(req,res){
  res.render('list',{
    title:'nodeweb 列表页'
  });
});