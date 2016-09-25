var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Imovie = require('../app/controllers/movie');

module.exports = function(app) {
  
  // 将获取到的用户数据传入到页面变量中
  app.use( function(req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  // 加载index page并指定访问路径
  app.get('/', Index.index);

  // 加载detail page
  // 访问路径就是localhost :3000/movie/id 
  app.get('/movie/:id', Imovie.detail);
  // 加载admin page
  app.get('/admin/new', Imovie.new);
  // admin uodate movie
  app.get('/admin/update/:id', Imovie.update);
  // admin post movie  urlencoded, 
  app.post('/admin/movie/new', Imovie.save);
  // 加载list page
  app.get('/admin/list', Imovie.list);
  // 接收电影删除请求
  app.delete('/admin/list', Imovie.delete);


  // 用户注册
  app.post('/user/signup', User.signup);
  // 用户登陆
  app.post('/user/login', User.login);
  // 用户退出
  app.get('/logout', User.logout);
  
};