var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Imovie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app) {
  
  // 将获取到的用户数据传入到页面变量中
  app.use( function(req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  // 加载index page并指定访问路径
  app.get('/', Index.index);


  // 加载admin page
  app.get('/movie/new', User.userRequired, User.superUser, Imovie.new);
  // admin uodate movie
  app.get('/movie/update/:id', Imovie.update);
  // admin post movie  urlencoded, 
  app.post('/movie/movie/new', Imovie.savePoster, Imovie.save);
  // 加载list page
  app.get('/movie/list', User.userRequired, User.superUser, Imovie.list);
  // 接收电影删除请求
  app.delete('/movie/list', Imovie.delete);
  // 电影分类提交
  app.get('/movie/category', User.userRequired, User.superUser, Category.new);
  app.post('/movie/category/new', Category.save);
  app.get('/movie/category/list', User.userRequired, User.superUser, Category.list);
  app.get('/movie/results', Index.search);
  // 加载detail page
  // 访问路径就是localhost :3000/movie/id 
  app.get('/movie/:id', Imovie.detail);

  // 用户注册
  app.post('/user/signup', User.signup);
  app.get('/signup', User.showSign);
  // 用户登陆
  app.post('/user/login', User.login);
  app.get('/login', User.showLogin);
  // 用户退出
  app.get('/logout', User.logout);
  // 用户列表 加入访问限制中间件
  app.get('/user/list', User.userRequired, User.superUser, User.userslist);
  
  // Comment
  app.post('/user/comment', User.userRequired, Comment.save);

};